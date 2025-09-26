'use client'

import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function useBusData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE_URL}/api/locations`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setData(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch bus data')
        }
      } catch (err) {
        console.error('Error fetching bus data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch bus data')
      } finally {
        setLoading(false)
      }
    }

    fetchBusData()
    
    // Poll every 5 seconds
    const interval = setInterval(fetchBusData, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}