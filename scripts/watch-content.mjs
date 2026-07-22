import chokidar from 'chokidar';
import { spawn } from 'child_process';
import { CONTENT_DIR, ENGINE_ROOT, contentEnv } from './resolve-paths.mjs';

let timer = null;

function runSync() {
  const contentFlag = process.argv.includes('--content')
    ? ['--content', process.argv[process.argv.indexOf('--content') + 1]]
    : [];

  return new Promise((resolve, reject) => {
    const child = spawn('node', ['scripts/sync-content.mjs', ...contentFlag], {
      cwd: ENGINE_ROOT,
      stdio: 'inherit',
      env: contentEnv(),
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
    console.log(`[content] ${event}: ${filePath}`);
    debouncedSync();
  });
