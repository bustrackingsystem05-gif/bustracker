#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

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

const localIP = getLocalIPAddress();

console.log('\n🚍 =============================================');
console.log('   SMART BUS TRACKING SYSTEM');
console.log('=============================================');
console.log('🚀 Starting both Backend and Frontend...\n');

// Start Backend
console.log('📡 Starting Backend (Express API)...');
const backend = spawn('node', ['run-backend.js'], { 
  stdio: 'inherit',
  cwd: process.cwd()
});

// Wait a moment then start Frontend
setTimeout(() => {
  console.log('\n🎨 Starting Frontend (Next.js)...');
  const frontend = spawn('node', ['run-frontend.js'], { 
    stdio: 'inherit',
    cwd: path.join(process.cwd(), 'smart-bus-frontend')
  });

  frontend.on('close', (code) => {
    console.log(`\n🛑 Frontend exited with code ${code}`);
  });
}, 3000);

backend.on('close', (code) => {
  console.log(`\n🛑 Backend exited with code ${code}`);
});

// Print final instructions
setTimeout(() => {
  console.log('\n✅ =============================================');
  console.log('   SYSTEM READY!');
  console.log('=============================================');
  console.log('🔗 URLs:');
  console.log(`   Backend:  http://localhost:3000`);
  console.log(`   Frontend: http://localhost:5173`);
  console.log('\n🌍 LAN Access:');
  console.log(`   Backend:  http://${localIP}:3000`);
  console.log(`   Frontend: http://${localIP}:5173`);
  console.log('\n📡 Hardware Team POST URL:');
  console.log(`   http://${localIP}:3000/api/locations`);
  console.log('\n👥 Passenger Access URL:');
  console.log(`   http://${localIP}:5173`);
  console.log('\n🔄 Features:');
  console.log('   ✅ Real-time GPS tracking');
  console.log('   ✅ Live map updates every 5s');
  console.log('   ✅ ETA calculations');
  console.log('   ✅ Bus status monitoring');
  console.log('=============================================\n');
}, 8000);