'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, ArrowRight } from 'lucide-react'

interface SearchFormProps {
  onSearch: (search: string) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!departure.trim() || !destination.trim()) return

    setIsLoading(true)
    const searchQuery = `${departure} → ${destination}`
    onSearch(searchQuery)

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    router.push('/buses')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Departure Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              placeholder="Enter departure location"
              className="w-full pl-10 pr-4 py-2.5 lg:py-3 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              required
            />
          </div>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="w-full pl-10 pr-4 py-2.5 lg:py-3 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <motion.button
        type="submit"
        disabled={isLoading || !departure.trim() || !destination.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 lg:py-4 px-6 text-sm lg:text-base rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Find Available Buses</span>
            <ArrowRight className="w-5 h-5 hidden sm:block" />
          </>
        )}
      </motion.button>
    </form>
  )
}