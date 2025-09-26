// Bus route data with stops and timings
export interface BusStop {
  id: string
  name: string
  lat: number
  lon: number
  scheduledTime: string
  estimatedTime?: string
}

export interface BusRoute {
  id: string
  number: string
  name: string
  stops: BusStop[]
  polyline: [number, number][]
}

// Bus 001 Route: Boothapadi to Mpnmjec
export const BUS_001_ROUTE: BusRoute = {
  id: 'BUS_001',
  number: '001',
  name: 'Boothapadi - Mpnmjec Route',
  stops: [
    {
      id: 'boothapadi',
      name: 'Boothapadi',
      lat: 11.3410,
      lon: 77.7172,
      scheduledTime: '7:00 AM'
    },
    {
      id: 'poonachi',
      name: 'Poonachi',
      lat: 11.3445,
      lon: 77.7205,
      scheduledTime: '7:20 AM'
    },
    {
      id: 'chithar',
      name: 'Chithar',
      lat: 11.3480,
      lon: 77.7238,
      scheduledTime: '7:30 AM'
    },
    {
      id: 'bhavani-bs',
      name: 'Bhavani BS',
      lat: 11.4448,
      lon: 77.6792,
      scheduledTime: '7:40 AM'
    },
    {
      id: 'kalingarayanpalayam',
      name: 'Kalingarayanpalayam',
      lat: 11.4515,
      lon: 77.6825,
      scheduledTime: '7:50 AM'
    },
    {
      id: 'lakshminagar',
      name: 'Lakshminagar',
      lat: 11.4582,
      lon: 77.6858,
      scheduledTime: '7:55 AM'
    },
    {
      id: 'kasipalayam',
      name: 'Kasipalayam',
      lat: 11.4615,
      lon: 77.6891,
      scheduledTime: '7:45 AM'
    },
    {
      id: 'kk-nagar',
      name: 'KK-nagar',
      lat: 11.4648,
      lon: 77.6924,
      scheduledTime: '7:55 AM'
    },
    {
      id: 'rn-pudhur',
      name: 'R.N. Pudhur',
      lat: 11.4681,
      lon: 77.6957,
      scheduledTime: '8:10 AM'
    },
    {
      id: 'agraharam',
      name: 'Agraharam',
      lat: 11.4714,
      lon: 77.6990,
      scheduledTime: '8:15 AM'
    },
    {
      id: 'erode-bs',
      name: 'Erode BS',
      lat: 11.3410,
      lon: 77.7172,
      scheduledTime: '8:30 AM'
    },
    {
      id: 'savitha-gh',
      name: 'Savitha & G.H',
      lat: 11.3443,
      lon: 77.7205,
      scheduledTime: '8:35 AM'
    },
    {
      id: 'diesel-shed',
      name: 'Diesel Shed',
      lat: 11.3476,
      lon: 77.7238,
      scheduledTime: '8:40 AM'
    },
    {
      id: 'iti',
      name: 'ITI',
      lat: 11.3509,
      lon: 77.7271,
      scheduledTime: '8:50 AM'
    },
    {
      id: 'mpnmjec',
      name: 'Mpnmjec',
      lat: 11.3542,
      lon: 77.7304,
      scheduledTime: '9:20 AM'
    }
  ],
  polyline: [
    [11.3410, 77.7172], // Boothapadi
    [11.3445, 77.7205], // Poonachi
    [11.3480, 77.7238], // Chithar
    [11.4448, 77.6792], // Bhavani BS
    [11.4515, 77.6825], // Kalingarayanpalayam
    [11.4582, 77.6858], // Lakshminagar
    [11.4615, 77.6891], // Kasipalayam
    [11.4648, 77.6924], // KK-nagar
    [11.4681, 77.6957], // R.N. Pudhur
    [11.4714, 77.6990], // Agraharam
    [11.3410, 77.7172], // Erode BS
    [11.3443, 77.7205], // Savitha & G.H
    [11.3476, 77.7238], // Diesel Shed
    [11.3509, 77.7271], // ITI
    [11.3542, 77.7304]  // Mpnmjec
  ]
}

export const BUS_ROUTES: { [key: string]: BusRoute } = {
  'BUS_001': BUS_001_ROUTE
}

// Helper function to get next stop based on current position
export function getNextStop(route: BusRoute, currentLat: number, currentLon: number): BusStop | null {
  let closestStop = null
  let minDistance = Infinity
  
  for (const stop of route.stops) {
    const distance = calculateDistance(currentLat, currentLon, stop.lat, stop.lon)
    if (distance < minDistance) {
      minDistance = distance
      closestStop = stop
    }
  }
  
  // Find the next stop after the closest one
  if (closestStop) {
    const currentIndex = route.stops.findIndex(stop => stop.id === closestStop.id)
    if (currentIndex < route.stops.length - 1) {
      return route.stops[currentIndex + 1]
    }
  }
  
  return null
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}