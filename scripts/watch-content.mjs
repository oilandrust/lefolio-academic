import chokidar from 'chokidar';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'Content');

let timer = null;

function runSync() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['scripts/sync-content.mjs'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`sync failed: ${code}`))));
  });
}

function debouncedSync() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    runSync().catch((err) => console.error(err.message));
  }, 150);
}

console.log(`Watching ${CONTENT_DIR} for changes...`);

chokidar
  .watch(CONTENT_DIR, { ignoreInitial: true })
  .on('all', (event, filePath) => {
    console.log(`[content] ${event}: ${path.relative(CONTENT_DIR, filePath)}`);
    debouncedSync();
  });
