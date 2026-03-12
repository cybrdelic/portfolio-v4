import express from 'express';
import path from 'node:path';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const distDir = path.resolve(process.cwd(), 'dist');

const app = express();

app.use(express.static(distDir));
app.get(/.*/, (_request, response) => {
  response.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, host, () => {
  console.log(`dist server ready at http://${host}:${port}`);
});
