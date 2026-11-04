// Concurrent dev runner for Sahyadri Placement Hub
const { spawn } = require('child_process');
const path = require('path');

console.log('========================================================');
console.log('🚀 Starting Sahyadri Placement Hub Full-Stack Environment');
console.log('========================================================\n');

// 1. Start Server on Port 5000
const serverProcess = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' }
});

// 2. Start Vite Client on Port 3000
const clientProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nStopping servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

