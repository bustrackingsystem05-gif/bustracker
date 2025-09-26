'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BusCard } from '@/components/bus-card'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorMessage } from '@/components/error-message'
import { useBusData } from '@/hooks/use-bus-data'
import { RefreshCw } from 'lucide-react'

interface Bus {
  id: string
  number: string
  driver: string
  lat: number
  lon: number
  speed: number
  status: 'active' | 'stopped'
  eta: number | string
  updated: string
}

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const { data, loading, error, lastUpdate } = useBusData()

  useEffect(() => {
    if (data) {
      // Transform API data to bus format
      const transformedBuses: Bus[] = Object.entries(data).map(([deviceId, location]: [string, any]) => ({
        id: deviceId,
        number: deviceId.replace('BUS_', ''),
        driver: `Driver ${deviceId.slice(-3)}`,
        lat: location.lat,
        lon: location.lon,
        speed: location.speed || 0,
        status: (location.speed || 0) > 0.1 ? 'active' : 'stopped',
        eta: location.speed > 0 ? Math.round(Math.random() * 15 + 5) : 'Stopped',
        updated: location.updated
      }))
      setBuses(transformedBuses)
    }
  }, [data])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Available Buses
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {buses.length} buses currently tracked
              </p>
            </div>
            
            {/* Live Update Indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Live Updates</span>
              {lastUpdate && (
                <span className="text-xs">
                  ({lastUpdate.toLocaleTimeString()})
                </span>
              )}
            </div>
          </div>
        </div>

        {buses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚌</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No buses available
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Waiting for GPS data from hardware devices...
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {buses.map((bus, index) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BusCard bus={bus} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}