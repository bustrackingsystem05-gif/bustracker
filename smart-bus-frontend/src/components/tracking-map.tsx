'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="4"/>
      <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🚌</text>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
})

interface BusData {
  id: string
  lat: number
  lon: number
  speed: number
  updated: string
}

interface TrackingMapProps {
  busData: BusData
  className?: string
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  const [previousCenter, setPreviousCenter] = useState<[number, number] | null>(null)
  
  useEffect(() => {
    // Only update map view if the position has actually changed
    if (!previousCenter || 
        Math.abs(previousCenter[0] - center[0]) > 0.0001 || 
        Math.abs(previousCenter[1] - center[1]) > 0.0001) {
      console.log('🗺️ Map updating to new position:', center)
      map.setView(center, 15, { animate: true, duration: 1 })
      setPreviousCenter(center)
    }
  }, [map, center])
  
  return null
}

export default function TrackingMap({ busData, className }: TrackingMapProps) {
  const center: [number, number] = [busData.lat, busData.lon]
  const [mapKey, setMapKey] = useState(0)

  // Force map re-render when bus data changes significantly
  useEffect(() => {
    setMapKey(prev => prev + 1)
  }, [busData.id])

  return (
    <div className={className}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} />
        
        <Marker position={center} icon={busIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Bus {busData.id.replace('BUS_', '')}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Speed: {busData.speed.toFixed(1)} km/h
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Position: {busData.lat.toFixed(6)}, {busData.lon.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600">
                Updated: {new Date(busData.updated).toLocaleTimeString()}
              </p>
              <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                🔄 Live Updates Every 5s
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}