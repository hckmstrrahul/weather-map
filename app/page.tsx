'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useTheme } from 'next-themes'

import Search from '@/components/Search'
import WeatherDisplay from '@/components/WeatherDisplay'
import PlacesDisplay from '@/components/PlacesDisplay'
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
  const [showPlacesOnMap, setShowPlacesOnMap] = useState<boolean>(true)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'
  
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
  
  // Handle toggling places on map
  const handleTogglePlaces = () => {
    setShowPlacesOnMap(prev => !prev);
  };

  // Handle selecting a place
  const handleSelectPlace = (placeId: string) => {
    setSelectedPlaceId(placeId);
  };
  
  // Fetch default location on initial load
  useEffect(() => {
    if (location) {
      fetchWeatherData(location)
    } else {
      fetchWeatherData('London')
    }
  }, [location])
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-[2000px] mx-auto">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header with product name and search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400 flex items-center">
              <span className="mr-2">🌤️</span>
              WeatherScape
            </h1>
            <div className="w-full sm:w-auto">
              <Search onSearch={fetchWeatherData} initialValue={location || ''} />
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
              {/* ... loading skeleton ... */}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Weather data display */}
          {weatherData && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
              {/* Weather Stats - Left Column */}
              <div className="lg:col-span-3 h-full overflow-auto hide-scrollbar">
                <WeatherDisplay weatherData={weatherData} isDarkMode={isDarkMode} />
              </div>
              
              {/* Maps - Middle Column (expands to fill space) */}
              <div className="lg:col-span-6 h-full overflow-auto">
                <WeatherMapComponent
                  lat={weatherData.coord.lat}
                  lng={weatherData.coord.lon}
                  location={weatherData.name}
                  country={weatherData.sys.country}
                  showPlaces={showPlacesOnMap}
                  selectedPlaceId={selectedPlaceId}
                  onPlaceSelect={handleSelectPlace}
                />
              </div>

              {/* Places to Visit - Right Column */}
              <div className="lg:col-span-3 h-full overflow-auto">
                <PlacesDisplay 
                  location={weatherData.name}
                  lat={weatherData.coord.lat}
                  lng={weatherData.coord.lon}
                  showPlacesOnMap={showPlacesOnMap}
                  onTogglePlaces={handleTogglePlaces}
                  onSelectPlace={handleSelectPlace}
                  selectedPlaceId={selectedPlaceId}
                />
              </div>
            </div>
          )}

          {/* Add global styles for hiding scrollbars */}
          <style jsx global>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  )
} 