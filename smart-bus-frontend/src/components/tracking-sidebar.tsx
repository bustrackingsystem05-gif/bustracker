'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, MapPin, Clock, Gauge, Bell, BellOff, Navigation, Route } from 'lucide-react'
import { BUS_ROUTES, getNextStop, BusStop } from '@/data/bus-routes'

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

export function TrackingSidebar({ busData, onClose }: TrackingSidebarProps) {
  const [alerts, setAlerts] = useState<{ [key: string]: boolean }>({})
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Get route data
  const route = BUS_ROUTES[busData.id]
  const nextStop = route ? getNextStop(route, busData.lat, busData.lon) : null

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleAlert = (stopName: string, minutes: number) => {
    const key = `${stopName}-${minutes}`
    setAlerts(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    
    const message = alerts[key] 
      ? `Alert cancelled for ${stopName}`
      : `Alert set for ${minutes} min before ${stopName}`
    
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

  const calculateETA = (stop: BusStop) => {
    // Simple ETA calculation based on distance and current speed
    const distance = calculateDistance(busData.lat, busData.lon, stop.lat, stop.lon)
    if (busData.speed > 0) {
      const etaMinutes = (distance / busData.speed) * 60
      return Math.round(etaMinutes)
    }
    return 'N/A'
  }

  const isStopPassed = (stop: BusStop) => {
    const distance = calculateDistance(busData.lat, busData.lon, stop.lat, stop.lon)
    return distance < 0.1 // Less than 100m means passed
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            Bus {busData.id.replace('BUS_', '')}
          </h2>
          {route && (
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {route.name}
            </p>
          )}
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Live Tracking
          </p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Status Section */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 lg:p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Gauge className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
            </div>
            <div className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
              {busData.speed.toFixed(1)} km/h
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 lg:p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Navigation className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            </div>
            <div className={`text-sm lg:text-lg font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 lg:p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-600 dark:text-blue-400">Last Updated</span>
          </div>
          <div className="text-sm lg:text-lg font-semibold text-blue-700 dark:text-blue-300">
            {formatTime(busData.updated)}
          </div>
        </div>

        {/* Next Stop Highlight */}
        {nextStop && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 lg:p-4">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Next Stop</span>
            </div>
            <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
              {nextStop.name}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              Scheduled: {nextStop.scheduledTime}
            </div>
          </div>
        )}
      </div>

      {/* Route Stops */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Route className="w-5 h-5 text-blue-500" />
            <span>Route Stops</span>
          </h3>

          {route ? (
            <div className="space-y-3">
              {route.stops.map((stop, index) => {
                const eta = calculateETA(stop)
                const isPassed = isStopPassed(stop)
                const isNext = nextStop?.id === stop.id
                
                return (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`rounded-xl p-4 transition-all ${
                      isNext
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800'
                        : isPassed
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isNext
                            ? 'bg-yellow-500'
                            : isPassed
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">
                            {stop.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Scheduled: {stop.scheduledTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {isPassed ? (
                          <div className="text-sm font-bold text-green-600 dark:text-green-400">
                            Passed
                          </div>
                        ) : isNext ? (
                          <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                            Next
                          </div>
                        ) : (
                          <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {typeof eta === 'number' ? `${eta} min` : eta}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {calculateDistance(busData.lat, busData.lon, stop.lat, stop.lon).toFixed(1)} km
                        </div>
                      </div>
                    </div>

                    {/* Alert Buttons - Only for upcoming stops */}
                    {!isPassed && !isNext && (
                      <div className="flex space-x-2 mt-3">
                        {[5, 10].map((minutes) => {
                          const alertKey = `${stop.name}-${minutes}`
                          const isActive = alerts[alertKey]
                          
                          return (
                            <button
                              key={minutes}
                              onClick={() => toggleAlert(stop.name, minutes)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
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
                              <span>{minutes}m</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Route className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No route data available for this bus
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          🔄 Updates every 5 seconds
        </div>
      </div>
    </div>
  )
}

// Helper function for distance calculation
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