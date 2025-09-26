'use client'

import { motion } from 'framer-motion'
import { Clock, X } from 'lucide-react'

interface RecentSearchesProps {
  searches: string[]
  onSelect: (search: string) => void
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  const clearSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = searches.filter(s => s !== searchToRemove)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    window.location.reload() // Simple refresh to update state
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Searches
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <motion.button
            key={search}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => onSelect(search)}
            className="group relative bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <span>{search}</span>
            <button
              onClick={(e) => clearSearch(search, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-1"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          </motion.button>
        ))}
      </div>
    </div>
  )
}