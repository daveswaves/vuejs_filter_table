/* 
Run: node dev.js
Starts both processes (node backend/index.js and npm run dev).
Ctrl+C stops both processes.
*/
import { spawn } from 'child_process';

// Start both processes
const backend = spawn('node', ['backend/index.js'], {
    stdio: 'inherit',
    shell: true
});

const frontend = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
});

// Output to terminal explicitly
process.stdout.write('Ctrl+C to quit backend & frontend.\n');

// Handle clean shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    backend.kill();
    frontend.kill();
    process.exit(0);
});