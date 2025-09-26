'use client'

import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface BusData {
  id: string
  lat: number
  lon: number
  speed: number
  updated: string
}

export function useBusTracking(busId: string) {
  const [busData, setBusData] = useState<BusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        setError(null)
        
        const response = await fetch(`${API_BASE_URL}/api/locations/${busId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Bus ${busId} not found`)
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          const newBusData = {
            id: busId,
            lat: result.data.lat,
            lon: result.data.lon,
            speed: result.data.speed,
            updated: result.data.updated
          }
          
          setBusData({
            id: busId,
            lat: result.data.lat,
            lon: result.data.lon,
            speed: result.data.speed,
            updated: result.data.updated
          })
          setLastUpdate(new Date())
          console.log(`🚌 Bus ${busId} updated:`, {
            position: `${result.data.lat.toFixed(6)}, ${result.data.lon.toFixed(6)}`,
            speed: `${result.data.speed} km/h`,
            time: new Date(result.data.updated).toLocaleTimeString()
          })
        } else {
          throw new Error(result.error || 'Failed to fetch bus data')
        }
      } catch (err) {
        console.error('Error fetching bus tracking data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch bus data')
      } finally {
        setLoading(false)
      }
    }

    if (busId) {
      // Initial fetch
      fetchBusData()
      
      // Poll every 5 seconds for real-time updates
      const interval = setInterval(() => {
        console.log(`🔄 Polling bus ${busId} for updates...`)
        fetchBusData()
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [busId])

  return { busData, loading, error, lastUpdate }
}