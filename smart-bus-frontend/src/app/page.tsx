'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Clock, Zap, Bus } from 'lucide-react'
import { SearchForm } from '@/components/search-form'
import { RecentSearches } from '@/components/recent-searches'

export default function HomePage() {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

    console.log('🎨 Smart Bus Frontend: UI loaded successfully')
  }, [])

  const addRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 lg:mb-6 shadow-lg"
          >
            <Bus className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4"
          >
            Smart Bus Tracking
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 lg:mb-8 px-4"
          >
            Track your bus in real-time with live GPS and accurate ETA predictions
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">Live GPS Tracking</h3>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Real-time location updates every 5 seconds</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">Accurate ETA</h3>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Precise arrival time calculations</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Search</h3>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Find buses by route or destination</p>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 lg:p-8 mb-6 lg:mb-8"
        >
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 text-center">
            Find Your Bus
          </h2>
          <SearchForm onSearch={addRecentSearch} />
        </motion.div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <RecentSearches searches={recentSearches} onSelect={addRecentSearch} />
          </motion.div>
        )}

        {/* Bus 001 Route Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 lg:mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 lg:p-8 border border-blue-100 dark:border-blue-800"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mb-4">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Route: Bus 001
            </h3>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              Boothapadi - Mpnmjec Route
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">First Stop</div>
              <div className="font-semibold text-gray-900 dark:text-white">Boothapadi</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">7:00 AM</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Stop</div>
              <div className="font-semibold text-gray-900 dark:text-white">Mpnmjec</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">9:20 AM</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Stops</div>
              <div className="font-semibold text-gray-900 dark:text-white">15</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Stations</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
              <div className="font-semibold text-gray-900 dark:text-white">2h 20m</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Journey</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}