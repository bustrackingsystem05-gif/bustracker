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
          setBusData({
            id: busId,
            lat: result.data.lat,
            lon: result.data.lon,
            speed: result.data.speed,
            updated: result.data.updated
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
      fetchBusData()
      
      // Poll every 5 seconds
      const interval = setInterval(fetchBusData, 5000)
      
      return () => clearInterval(interval)
    }
  }, [busId])

  return { busData, loading, error }
}