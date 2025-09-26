'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, MapPin, Clock, Gauge, Bell, BellOff, Navigation } from 'lucide-react'

interface BusData {
  id: string
  lat: number
  lon: number
  speed: number
  updated: string
}

interface TrackingSidebarProps {
  busData: BusData
  onClose: () => void
}

const mockStops = [
  { name: 'Central Station', eta: 3, distance: '0.8 km' },
  { name: 'City Mall', eta: 7, distance: '1.5 km' },
  { name: 'University Campus', eta: 12, distance: '2.3 km' },
  { name: 'Airport Terminal', eta: 18, distance: '3.7 km' },
]

export function TrackingSidebar({ busData, onClose }: TrackingSidebarProps) {
  const [alerts, setAlerts] = useState<{ [key: string]: boolean }>({})

  const toggleAlert = (stopName: string, minutes: number) => {
    const key = `${stopName}-${minutes}`
    setAlerts(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    
    // Show toast notification
    const message = alerts[key] 
      ? `Alert cancelled for ${stopName}`
      : `Alert set for ${minutes} min before ${stopName}`
    
    // You could integrate with a toast library here
    console.log(message)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getStatusColor = () => {
    if (busData.speed === 0) return 'text-red-500'
    if (busData.speed < 10) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusText = () => {
    if (busData.speed === 0) return 'Stopped'
    if (busData.speed < 10) return 'Moving Slowly'
    return 'Moving'
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bus {busData.id.replace('BUS_', '')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Live Tracking
          </p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Status Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Gauge className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {busData.speed.toFixed(1)} km/h
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Navigation className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            </div>
            <div className={`text-lg font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-600 dark:text-blue-400">Last Updated</span>
          </div>
          <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            {formatTime(busData.updated)}
          </div>
        </div>
      </div>

      {/* Next Stops */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span>Next Stops</span>
          </h3>

          <div className="space-y-4">
            {mockStops.map((stop, index) => (
              <motion.div
                key={stop.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {stop.name}
                  </h4>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {stop.eta} min
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {stop.distance}
                    </div>
                  </div>
                </div>

                {/* Alert Buttons */}
                <div className="flex space-x-2">
                  {[5, 10].map((minutes) => {
                    const alertKey = `${stop.name}-${minutes}`
                    const isActive = alerts[alertKey]
                    
                    return (
                      <button
                        key={minutes}
                        onClick={() => toggleAlert(stop.name, minutes)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                      >
                        {isActive ? (
                          <Bell className="w-3 h-3" />
                        ) : (
                          <BellOff className="w-3 h-3" />
                        )}
                        <span>{minutes} min alert</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Updates every 5 seconds
        </div>
      </div>
    </div>
  )
}