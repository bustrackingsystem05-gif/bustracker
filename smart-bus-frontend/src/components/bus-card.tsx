'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, Gauge, User, Wifi } from 'lucide-react'

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

interface BusCardProps {
  bus: Bus
}

export function BusCard({ bus }: BusCardProps) {
  const router = useRouter()

  const handleTrack = () => {
    router.push(`/track/${bus.id}`)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUpdateStatus = () => {
    const updateTime = new Date(bus.updated)
    const now = new Date()
    const diffSeconds = (now.getTime() - updateTime.getTime()) / 1000
    
    if (diffSeconds < 10) return { color: 'text-green-500', text: 'Live' }
    if (diffSeconds < 30) return { color: 'text-yellow-500', text: 'Recent' }
    return { color: 'text-red-500', text: 'Delayed' }
  }

  const updateStatus = getUpdateStatus()

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 hover:shadow-xl"
      onClick={handleTrack}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🚌</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Bus {bus.number}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>{bus.driver}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          bus.status === 'active'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {bus.status === 'active' ? 'Active' : 'Stopped'}
        </div>
      </div>
          
          {/* Live Update Indicator */}
          <div className={`flex items-center space-x-1 text-xs ${updateStatus.color}`}>
            <Wifi className="w-3 h-3" />
            <span>{updateStatus.text}</span>
          </div>

      {/* ETA */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Estimated Arrival
          </span>
        </div>
        <div className={`text-2xl font-bold ${
          typeof bus.eta === 'number'
            ? bus.eta <= 5
              ? 'text-green-600 dark:text-green-400'
              : bus.eta <= 10
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-blue-600 dark:text-blue-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {typeof bus.eta === 'number' ? `${bus.eta} min` : bus.eta}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Speed</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {bus.speed.toFixed(1)} km/h
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Updated</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {formatTime(bus.updated)}
            </div>
          </div>
        </div>
      </div>

      {/* Track Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
        onClick={(e) => {
          e.stopPropagation()
          handleTrack()
        }}
      >
        <MapPin className="w-4 h-4" />
        <span>Track Live</span>
      </motion.button>
    </motion.div>
  )
}