import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const isWindows = process.platform === 'win32';

function quoteWindowsArg(arg) {
  if (arg.length === 0) {
    return '""';
  }

  if (!/[\s"]/u.test(arg)) {
    return arg;
  }

  return `"${arg.replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/g, '$1$1')}"`;
}

function createCommand(command, args) {
  if (!isWindows) {
    return {
      command,
      args,
    };
  }

  const comspec = process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe';
  const commandLine = [command, ...args].map(quoteWindowsArg).join(' ');

  return {
    command: comspec,
    args: ['/d', '/s', '/c', commandLine],
  };
}

function run(command, args, options = {}) {
  const commandSpec = createCommand(command, args);
  return new Promise((resolve, reject) => {
    const child = spawn(commandSpec.command, commandSpec.args, {
      cwd: repoRoot,
      env: process.env,
      stdio: 'inherit',
      ...options,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'null'}`));
    });
  });
}

async function runWithRetries(command, args, retries) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await run(command, args);
      return;
    } catch (error) {
      lastError = error;
      if (attempt >= retries) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1_000 * attempt));
    }
  }
  throw lastError;
}

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function findFreePort(host) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, host, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Unable to determine free port')));
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
    server.on('error', reject);
  });
}

async function main() {
  const shouldBuild = !process.argv.includes('--skip-build');
  const forwardedArgs = process.argv.slice(2).filter((arg) => arg !== '--skip-build');
  const host = '127.0.0.1';
  const port = await findFreePort(host);
  const baseUrl = `http://${host}:${port}`;

  if (shouldBuild) {
    await runWithRetries('npm', ['run', 'build'], 3);
  }

  const outputDir = path.join(repoRoot, 'output', 'playwright');
  await fs.mkdir(outputDir, { recursive: true });

  const server = spawn(process.execPath, ['scripts/serve-dist.mjs'], {
    cwd: repoRoot,
    env: {
      ...process.env,
      HOST: host,
      PORT: String(port),
    },
    stdio: 'inherit',
  });

  try {
    await waitForServer(baseUrl, 20_000);

    await run('npx', ['playwright', 'test', ...forwardedArgs], {
      env: {
        ...process.env,
        PLAYWRIGHT_EXTERNAL_SERVER: '1',
        PLAYWRIGHT_BASE_URL: baseUrl,
      },
    });
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
