const express = require('express');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// In-memory storage for bus locations
const busLocations = new Map();

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

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // Distance in kilometers
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Calculate ETA based on distance and speed
function calculateETA(distanceKm, speedKmh) {
  if (speedKmh === 0 || speedKmh === null || speedKmh === undefined) {
    return "Stopped";
  }
  
  if (speedKmh < 0.1) {
    return "Stopped";
  }
  
  const etaMinutes = (distanceKm / speedKmh) * 60;
  return Math.round(etaMinutes);
}

// Middleware to log all requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// POST /api/locations - ESP32 hardware posts GPS data
app.post('/api/locations', (req, res) => {
  try {
    const { device_id, lat, lon, speed } = req.body;
    
    // Validate required fields
    if (!device_id || lat === undefined || lon === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: device_id, lat, lon'
      });
    }
    
    // Convert to numbers and validate
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const busSpeed = speed !== undefined ? parseFloat(speed) : 0;
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid latitude or longitude values'
      });
    }
    
    // Store the location data
    const locationData = {
      device_id,
      lat: latitude,
      lon: longitude,
      speed: busSpeed,
      updated: new Date().toISOString()
    };
    
    busLocations.set(device_id, locationData);
    
    console.log(`📍 Location updated for ${device_id}: ${latitude}, ${longitude} (Speed: ${busSpeed} km/h)`);
    
    res.json({
      success: true,
      message: 'Location updated successfully',
      data: locationData
    });
    
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/locations/:id - Get last known location
app.get('/api/locations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const locationData = busLocations.get(id);
    
    if (!locationData) {
      return res.status(404).json({
        error: `No location data found for device: ${id}`,
        available_devices: Array.from(busLocations.keys())
      });
    }
    
    res.json({
      success: true,
      data: {
        lat: locationData.lat,
        lon: locationData.lon,
        speed: locationData.speed,
        updated: locationData.updated
      }
    });
    
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/locations - Get all bus locations
app.get('/api/locations', (req, res) => {
  try {
    const allLocations = {};
    for (const [deviceId, locationData] of busLocations) {
      allLocations[deviceId] = {
        lat: locationData.lat,
        lon: locationData.lon,
        speed: locationData.speed,
        updated: locationData.updated
      };
    }
    
    res.json({
      success: true,
      count: busLocations.size,
      data: allLocations
    });
    
  } catch (error) {
    console.error('Error fetching all locations:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// POST /api/eta - Calculate ETA between two points
app.post('/api/eta', (req, res) => {
  try {
    const { device_id, destination_lat, destination_lon } = req.body;
    
    if (!device_id || destination_lat === undefined || destination_lon === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: device_id, destination_lat, destination_lon'
      });
    }
    
    const busLocation = busLocations.get(device_id);
    if (!busLocation) {
      return res.status(404).json({
        error: `No location data found for device: ${device_id}`
      });
    }
    
    const destLat = parseFloat(destination_lat);
    const destLon = parseFloat(destination_lon);
    
    if (isNaN(destLat) || isNaN(destLon)) {
      return res.status(400).json({
        error: 'Invalid destination coordinates'
      });
    }
    
    const distance = calculateDistance(
      busLocation.lat, 
      busLocation.lon, 
      destLat, 
      destLon
    );
    
    const eta = calculateETA(distance, busLocation.speed);
    
    res.json({
      success: true,
      data: {
        device_id,
        current_location: {
          lat: busLocation.lat,
          lon: busLocation.lon
        },
        destination: {
          lat: destLat,
          lon: destLon
        },
        distance_km: Math.round(distance * 100) / 100,
        current_speed_kmh: busLocation.speed,
        eta_minutes: eta,
        eta_text: typeof eta === 'number' ? `${eta} minutes` : eta,
        updated: busLocation.updated
      }
    });
    
  } catch (error) {
    console.error('Error calculating ETA:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Bus Tracking API is running',
    timestamp: new Date().toISOString(),
    active_devices: busLocations.size,
    uptime: process.uptime()
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  const localIP = getLocalIPAddress();
  res.json({
    message: 'Smart Bus Tracking API',
    version: '1.0.0',
    endpoints: {
      'POST /api/locations': 'Update bus location (ESP32)',
      'GET /api/locations/:id': 'Get specific bus location',
      'GET /api/locations': 'Get all bus locations',
      'POST /api/eta': 'Calculate ETA to destination',
      'GET /api/health': 'Health check'
    },
    examples: {
      'Update location': `curl -X POST http://${localIP}:${PORT}/api/locations -H "Content-Type: application/json" -d '{"device_id":"BUS_101","lat":40.7128,"lon":-74.0060,"speed":25}'`,
      'Get location': `curl http://${localIP}:${PORT}/api/locations/BUS_101`,
      'Calculate ETA': `curl -X POST http://${localIP}:${PORT}/api/eta -H "Content-Type: application/json" -d '{"device_id":"BUS_101","destination_lat":40.7589,"destination_lon":-73.9851}'`
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: [
      'POST /api/locations',
      'GET /api/locations/:id',
      'GET /api/locations',
      'POST /api/eta',
      'GET /api/health'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIPAddress();
  
  console.log('\n🚍 =============================================');
  console.log('   SMART BUS TRACKING BACKEND STARTED');
  console.log('=============================================');
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log(`🌍 Access from other devices: http://${localIP}:${PORT}`);
  console.log(`👉 Example API: http://${localIP}:${PORT}/api/locations/BUS_101`);
  console.log('\n📡 Available Endpoints:');
  console.log(`   POST http://${localIP}:${PORT}/api/locations`);
  console.log(`   GET  http://${localIP}:${PORT}/api/locations/:id`);
  console.log(`   GET  http://${localIP}:${PORT}/api/locations`);
  console.log(`   POST http://${localIP}:${PORT}/api/eta`);
  console.log(`   GET  http://${localIP}:${PORT}/api/health`);
  console.log('\n💡 ESP32 Example (Arduino):');
  console.log('   String url = "http://' + localIP + ':' + PORT + '/api/locations";');
  console.log('   String payload = "{\\"device_id\\":\\"BUS_101\\",\\"lat\\":40.7128,\\"lon\\":-74.0060,\\"speed\\":25}";');
  console.log('\n🔥 Server ready for connections!');
  console.log('=============================================\n');
});