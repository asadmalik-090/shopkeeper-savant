#!/usr/bin/env node

// This script is a workaround for running Vite when the global command isn't found
// It directly uses the locally installed Vite package

console.log('Starting Vite development server using local installation...');

// Use the require.resolve to find the local vite package
try {
  const { createServer } = require('vite');
  
  async function startServer() {
    const server = await createServer({
      // Load config from vite.config.ts
      configFile: './vite.config.ts',
      root: process.cwd(),
      server: {
        port: 8080,
        open: true,
      },
    });
    
    await server.listen();
    
    server.printUrls();
    
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.on(signal, () => {
        server.close().then(() => {
          process.exit();
        });
      });
    });
  }
  
  startServer().catch((err) => {
    console.error('Error starting Vite server:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Failed to start Vite server. Make sure Vite is installed:');
  console.error(err);
  console.error('\nTry running: npm install vite --save-dev');
  process.exit(1);
}
