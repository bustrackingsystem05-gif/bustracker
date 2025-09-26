'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TrackingSidebar } from '@/components/tracking-sidebar'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorMessage } from '@/components/error-message'
import { useBusTracking } from '@/hooks/use-bus-tracking'

// Dynamically import map to avoid SSR issues
const TrackingMap = dynamic(() => import('@/components/tracking-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <LoadingSpinner />
    </div>
  )
})

export default function TrackingPage() {
  const params = useParams()
  const busId = params.id as string
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { busData, loading, error } = useBusTracking(busId)

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    )
  }

  if (!busData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚌</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Bus not found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Bus {busId} is not currently being tracked.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Map Container */}
      <div className="flex-1 relative">
        <TrackingMap
          busData={busData}
          className="w-full h-full"
        />
        
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '100%',
          opacity: sidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed lg:relative top-0 right-0 h-full w-full max-w-sm lg:max-w-none lg:w-96 
          bg-white dark:bg-gray-800 shadow-xl lg:shadow-none border-l border-gray-200 dark:border-gray-700
          z-20 lg:z-auto overflow-hidden
          ${sidebarOpen ? 'block' : 'hidden lg:block'}
        `}
      >
        <TrackingSidebar
          busData={busData}
          onClose={() => setSidebarOpen(false)}
        />
      </motion.div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}