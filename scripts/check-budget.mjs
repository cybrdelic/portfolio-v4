import { readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import path from 'node:path';
const files = readdirSync('dist/assets');
const js = files.filter(f => f.endsWith('.js'));
const html = readFileSync('dist/index.html', 'utf8');
const initial = [...html.matchAll(/src="\/assets\/(index-[^"]+\.js)"/g)].map(match => match[1]);
const imports = initial.map(file => readFileSync(`dist/assets/${file}`, 'utf8')).join('');
const world = js.filter(file => file.startsWith('MotionWorld-') && imports.includes(file));
const size = paths => paths.reduce((total, name) => total + gzipSync(readFileSync(`dist/assets/${name}`)).length, 0);
const initialGzip = size(initial), worldGzip = size(world);
assert(initial.length > 0 && world.length > 0, 'Main and lazy GPU chunks must exist');
assert(initialGzip < 120_000, `Initial JavaScript exceeds 120 KB gzip: ${initialGzip}`);
assert(worldGzip < 25_000, `GPU system exceeds 25 KB gzip: ${worldGzip}`);
const readSource = directory => readdirSync(directory, { withFileTypes: true }).map(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? readSource(file) : /\.tsx?$/.test(entry.name) ? readFileSync(file, 'utf8') : '';
}).join('\n');
const source = readSource('src');
const media = readdirSync('dist/media').filter(file => /\.(mp4|webp)$/.test(file));
const archiveMedia = new Set(['aqua.mp4', 'aqua.webp', 'ignia.mp4', 'ignia.webp', 'firesim.webp']);
let featuredMediaBytes = 0, archiveMediaBytes = 0;
assert(media.length > 0, 'Production media must exist');
for (const file of media) {
  assert(source.includes(`/media/${file}`), `Unused production media: ${file}`);
  const bytes = statSync(`dist/media/${file}`).size;
  const limit = file.endsWith('.mp4') ? 1_500_000 : 500_000;
  assert(bytes < limit, `${file} exceeds ${limit} bytes`);
  if (archiveMedia.has(file)) archiveMediaBytes += bytes;
  else featuredMediaBytes += bytes;
}
console.log(JSON.stringify({ initialGzipBytes: initialGzip, gpuGzipBytes: worldGzip, featuredMediaBytes, archiveMediaBytes, status: 'passed' }));
