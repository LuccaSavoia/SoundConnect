import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const viteEntry = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const processes = [];
let stopping = false;

function stopAll() {
  if (stopping) return;
  stopping = true;
  for (const child of processes) {
    if (child && !child.killed) child.kill();
  }
}

function start(label, script, args = []) {
  // Inicia diretamente pelo executável Node. Sem shell, os espaços em
  // C:\\Program Files\\nodejs\\node.exe funcionam no Windows/Git Bash.
  const child = spawn(process.execPath, [script, ...args], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });
  processes.push(child);
  child.on('error', err => {
    console.error(`[${label}] Falha ao iniciar: ${err.message}`);
    stopAll();
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`[${label}] Processo encerrado (${signal || code}).`);
      stopAll();
      process.exitCode = code || 1;
    }
  });
}

if (!fs.existsSync(viteEntry)) {
  console.error('As dependências não estão instaladas. Execute npm install antes de npm run dev.');
  process.exit(1);
}

console.log('SoundConnect iniciado:');
console.log('Aplicativo: http://localhost:5173');
console.log('API: http://localhost:3001/api/health');
start('API', path.join(root, 'server', 'index.js'));
start('React', viteEntry, ['--host', '0.0.0.0']);
process.on('SIGINT', () => { stopAll(); process.exit(0); });
process.on('SIGTERM', () => { stopAll(); process.exit(0); });
