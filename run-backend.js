#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

// Helper function to get local IP address
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

console.log('\n🚍 =============================================');
console.log('   STARTING SMART BUS BACKEND');
console.log('=============================================');

const localIP = getLocalIPAddress();

console.log('📦 Installing dependencies...');
const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });

npmInstall.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }

  console.log('\n🚀 Starting backend server...');
  console.log(`✅ Backend will run at http://localhost:3000`);
  console.log(`🌍 LAN Access: http://${localIP}:3000`);
  console.log(`👉 API Example: http://${localIP}:3000/api/locations/BUS_101`);
  console.log('\n📡 Hardware Team POST URL:');
  console.log(`   http://${localIP}:3000/api/locations`);
  console.log('=============================================\n');

  // Start the server
  const server = spawn('npm', ['run', 'start'], { stdio: 'inherit' });
  
  server.on('close', (code) => {
    console.log(`\n🛑 Backend server exited with code ${code}`);
  });
});