'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import axios from 'axios'

import Search from '@/components/Search'
import WeatherDisplay from '@/components/WeatherDisplay'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { WeatherData } from '@/types/weather'

// Dynamically import the WeatherMap to avoid SSR issues with Google Maps
const WeatherMapComponent = dynamic(() => import('@/components/WeatherMap').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow animate-pulse h-[400px]"></div>
  ),
})

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const location = searchParams.get('location')
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  const fetchWeatherData = async (searchLocation: string) => {
    if (!searchLocation.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const res = await axios.get('/api/weather', {
        params: { location: searchLocation }
      })
      
      setWeatherData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch weather data')
      console.error('Error fetching weather data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch default location on initial load
  useEffect(() => {
    if (location) {
      fetchWeatherData(location)
    } else {
      fetchWeatherData('London')
    }
  }, [location])
  
  return (
    <div className="bg-white dark:bg-dark-900 min-h-screen">
      <div className="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
                WeatherVista
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Search onSearch={fetchWeatherData} />
              <ThemeToggle />
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {/* Weather Content */}
          {weatherData && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weather Stats - Left Column (smaller) */}
              <div className="lg:col-span-4">
                <WeatherDisplay weatherData={weatherData} />
              </div>
              
              {/* Maps - Right Column (larger) */}
              <div className="lg:col-span-8">
                <WeatherMapComponent
                  lat={weatherData.coord.lat}
                  lng={weatherData.coord.lon}
                  location={weatherData.name}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 