'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import { FiMapPin } from 'react-icons/fi'

interface WeatherMapProps {
  lat: number
  lng: number
  location: string
  country: string
  showPlaces: boolean
  selectedPlaceId: string | null
  onPlaceSelect: (placeId: string) => void
}

interface Place {
  id: string
  name: string
  type: string
  lat: number
  lng: number
  rating: number
  address: string
  icon: string
}

// Map styles for dark mode
const mapStyles = {
  dark: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  default: [] // Use default Google Maps style in light mode
}

// Get icon URL for place type
const getPlaceIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    'museum': '/icons/museum.svg',
    'park': '/icons/park.svg',
    'historic_site': '/icons/historic.svg',
    'shopping_mall': '/icons/shopping.svg',
    'art_gallery': '/icons/art.svg',
    'restaurant': '/icons/restaurant.svg',
  }
  
  return iconMap[type] || '/icons/place.svg'
}

// Get color for place type (same as PlacesDisplay)
const getPlaceColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'museum': '#3b82f6',      // Blue
    'park': '#10b981',        // Green
    'historic_site': '#f59e0b', // Amber
    'shopping_mall': '#8b5cf6', // Purple
    'art_gallery': '#6366f1',  // Indigo
    'restaurant': '#ef4444',   // Red
  }
  
  return colorMap[type] || '#6b7280' // Gray default
}

const WeatherMap = ({
  lat,
  lng,
  location,
  country,
  showPlaces,
  selectedPlaceId,
  onPlaceSelect
}: WeatherMapProps) => {
  const [places, setPlaces] = useState<Place[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mapZoom, setMapZoom] = useState(13)
  const [mapCenter, setMapCenter] = useState({ lat, lng })
  
  // Ref for map instance
  const aerialMapRef = useRef<google.maps.Map | null>(null)

  // Check for dark mode
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addEventListener('change', handleChange)

    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

  // Fetch places of interest
  const fetchPlacesOfInterest = useCallback(async () => {
    // In a real app, we'd fetch from Google Places API
    // For demo, generate sample places around the given coordinates
    const samplePlaces: Place[] = [
      {
        id: 'place1',
        name: `${location} Museum of Art`,
        type: 'museum',
        lat: lat + 0.01,
        lng: lng - 0.01,
        rating: 4.7,
        address: '123 Museum Avenue',
        icon: getPlaceIcon('museum')
      },
      {
        id: 'place2',
        name: `${location} Central Park`,
        type: 'park',
        lat: lat - 0.01,
        lng: lng + 0.01,
        rating: 4.8,
        address: 'Central District',
        icon: getPlaceIcon('park')
      },
      {
        id: 'place3',
        name: `Historic ${location} Cathedral`,
        type: 'historic_site',
        lat: lat + 0.015,
        lng: lng + 0.015,
        rating: 4.6,
        address: '45 Old Town Square',
        icon: getPlaceIcon('historic_site')
      },
      {
        id: 'place4',
        name: `${location} Luxury Shopping Mall`,
        type: 'shopping_mall',
        lat: lat - 0.015,
        lng: lng - 0.015,
        rating: 4.3,
        address: '789 Commerce Street',
        icon: getPlaceIcon('shopping_mall')
      },
      {
        id: 'place5',
        name: `${location} Science Museum`,
        type: 'museum',
        lat: lat + 0.008,
        lng: lng + 0.008,
        rating: 4.5,
        address: '567 Science Boulevard',
        icon: getPlaceIcon('museum')
      },
      {
        id: 'place6',
        name: `${location} Waterfront`,
        type: 'park',
        lat: lat - 0.008,
        lng: lng - 0.008,
        rating: 4.9,
        address: 'Waterfront District',
        icon: getPlaceIcon('park')
      },
      {
        id: 'place7',
        name: `${location} Gourmet Restaurant`,
        type: 'restaurant',
        lat: lat + 0.012,
        lng: lng - 0.012,
        rating: 4.6,
        address: '321 Culinary Avenue',
        icon: getPlaceIcon('restaurant')
      }
    ]

    setPlaces(samplePlaces)
  }, [location, lat, lng])

  useEffect(() => {
    if (showPlaces) {
      fetchPlacesOfInterest()
    }
  }, [showPlaces, fetchPlacesOfInterest])

  // Handle marker click and smooth zoom
  const handleMarkerClick = (placeId: string) => {
    const selectedPlace = places.find(p => p.id === placeId)
    if (selectedPlace && aerialMapRef.current) {
      onPlaceSelect(placeId)

      // Smooth zoom to the selected place
      const map = aerialMapRef.current
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng })
      map.setZoom(16)
      setMapCenter({ lat: selectedPlace.lat, lng: selectedPlace.lng })
      setMapZoom(16)
    }
  }

  // Reset map view when selection is cleared
  useEffect(() => {
    if (!selectedPlaceId && aerialMapRef.current) {
      aerialMapRef.current.panTo({ lat, lng })
      aerialMapRef.current.setZoom(13)
      setMapCenter({ lat, lng })
      setMapZoom(13)
    }
  }, [selectedPlaceId, lat, lng])

  // Update map view when selectedPlaceId changes
  useEffect(() => {
    if (selectedPlaceId && aerialMapRef.current) {
      const selectedPlace = places.find(p => p.id === selectedPlaceId)
      if (selectedPlace) {
        aerialMapRef.current.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng })
        aerialMapRef.current.setZoom(16)
        setMapCenter({ lat: selectedPlace.lat, lng: selectedPlace.lng })
        setMapZoom(16)
      }
    }
  }, [selectedPlaceId, places])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[700px] bg-gray-100 dark:bg-dark-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Map options
  const mapOptions = {
    disableDefaultUI: true,
    styles: isDarkMode ? mapStyles.dark : mapStyles.default,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* 4-Grid Map Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="h-[200px] w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="h-full relative">
            <div className="absolute top-2 left-2 z-10 bg-white dark:bg-dark-800 px-2 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              City View
            </div>
            <GoogleMap
              zoom={14}
              center={{ lat, lng }}
              mapContainerClassName="w-full h-full"
              options={{
                ...mapOptions,
                mapTypeId: 'roadmap',
              }}
            />
          </div>
        </div>
        <div className="h-[200px] w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="h-full relative">
            <div className="absolute top-2 left-2 z-10 bg-white dark:bg-dark-800 px-2 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              Area View
            </div>
            <GoogleMap
              zoom={12}
              center={{ lat, lng }}
              mapContainerClassName="w-full h-full"
              options={{
                ...mapOptions,
                mapTypeId: 'roadmap',
              }}
            />
          </div>
        </div>
        <div className="h-[200px] w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="h-full relative">
            <div className="absolute top-2 left-2 z-10 bg-white dark:bg-dark-800 px-2 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              Region View
            </div>
            <GoogleMap
              zoom={9}
              center={{ lat, lng }}
              mapContainerClassName="w-full h-full"
              options={{
                ...mapOptions,
                mapTypeId: 'roadmap',
              }}
            />
          </div>
        </div>
        <div className="h-[200px] w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="h-full relative">
            <div className="absolute top-2 left-2 z-10 bg-white dark:bg-dark-800 px-2 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              Country View
            </div>
            <GoogleMap
              zoom={6}
              center={{ lat, lng }}
              mapContainerClassName="w-full h-full"
              options={{
                ...mapOptions,
                mapTypeId: 'roadmap',
              }}
            />
          </div>
        </div>
      </div>

      {/* Aerial View with Markers */}
      <div className="w-full h-[700px] rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="relative h-full w-full">
          <div className="absolute top-2 left-2 z-10 bg-white dark:bg-dark-800 px-2 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
            Aerial View
          </div>
          <GoogleMap
            zoom={mapZoom}
            center={mapCenter}
            mapContainerClassName="w-full h-full"
            options={{
              ...mapOptions,
              mapTypeId: 'satellite',
            }}
            onLoad={(map) => {
              aerialMapRef.current = map
            }}
          >
            {/* Place markers */}
            {showPlaces && places.map((place) => (
              <MarkerF
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                onClick={() => handleMarkerClick(place.id)}
                icon={{
                  url: place.icon,
                  scaledSize: new google.maps.Size(32, 32),
                  fillColor: getPlaceColor(place.type),
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: '#FFFFFF',
                }}
              />
            ))}
          </GoogleMap>
        </div>
      </div>
    </div>
  )
}

export default WeatherMap 