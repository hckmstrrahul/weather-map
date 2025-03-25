'use client'

import { useState, useEffect, useRef } from 'react'
import { FiMapPin, FiMap, FiStar, FiClock, FiDollarSign, FiExternalLink, FiPhone, FiGlobe, FiImage, FiHome, FiShoppingBag, FiNavigation, FiCoffee, FiBookOpen } from 'react-icons/fi'

interface PlaceDisplayProps {
  location: string
  lat: number
  lng: number
  showPlacesOnMap: boolean
  onTogglePlaces: () => void
  onSelectPlace: (placeId: string) => void
  selectedPlaceId: string | null
}

interface Place {
  id: string
  name: string
  type: string
  description: string
  rating: number
  imageColor: string
  icon: string
  address?: string
  website?: string
  phone?: string
  hours?: string
  priceLevel?: number
}

// Get icon URL for place type - same function as in WeatherMap
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

// Get color for place type
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

// Get icon component for place type
const getPlaceTypeIcon = (type: string) => {
  const iconComponentMap: Record<string, React.ReactNode> = {
    'museum': <FiBookOpen size={24} />,
    'park': <FiNavigation size={24} />,
    'historic_site': <FiHome size={24} />,
    'shopping_mall': <FiShoppingBag size={24} />,
    'art_gallery': <FiImage size={24} />,
    'restaurant': <FiCoffee size={24} />,
  }
  
  return iconComponentMap[type] || <FiMapPin size={24} />
}

const PlacesDisplay = ({
  location,
  lat,
  lng,
  showPlacesOnMap,
  onTogglePlaces,
  onSelectPlace,
  selectedPlaceId
}: PlaceDisplayProps) => {
  const [loading, setLoading] = useState(false)
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const selectedItemRef = useRef<HTMLDivElement>(null)

  // Scroll selected item into view with a flash effect
  useEffect(() => {
    if (selectedPlaceId && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      selectedItemRef.current.classList.add('flash-highlight')
      
      // Remove flash effect after animation
      const timer = setTimeout(() => {
        if (selectedItemRef.current) {
          selectedItemRef.current.classList.remove('flash-highlight')
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [selectedPlaceId])

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Places' },
    { id: 'museum', name: 'Museums' },
    { id: 'park', name: 'Parks' },
    { id: 'historic_site', name: 'Historic Sites' },
    { id: 'restaurant', name: 'Restaurants' },
    { id: 'shopping_mall', name: 'Shopping' }
  ]

  // Fetch places data
  useEffect(() => {
    fetchPlaces()
  }, [location, lat, lng])

  const fetchPlaces = async () => {
    setLoading(true)

    try {
      // In a real app, we'd fetch from an API
      // For demo purposes, generate sample places
      const demoPlaces: Place[] = generateSamplePlaces(location)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setPlaces(demoPlaces)
    } catch (error) {
      console.error('Error fetching places:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSamplePlaces = (location: string): Place[] => {
    // Generate different places based on location
    return [
      {
        id: 'place1',
        name: `${location} Museum of Art`,
        type: 'museum',
        description: 'A world-class museum featuring both contemporary and classical art collections.',
        rating: 4.7,
        imageColor: '#3b82f6', // blue
        icon: getPlaceIcon('museum'),
        address: '123 Museum Avenue, Downtown',
        website: 'https://example.com/museum',
        hours: 'Open 9 AM - 5 PM',
        priceLevel: 2
      },
      {
        id: 'place2',
        name: `${location} Central Park`,
        type: 'park',
        description: 'A beautiful urban park with walking trails, gardens, and recreational facilities.',
        rating: 4.8,
        imageColor: '#10b981', // green
        icon: getPlaceIcon('park'),
        address: 'Central District',
        hours: 'Open 24 hours',
        priceLevel: 0
      },
      {
        id: 'place3',
        name: `Historic ${location} Cathedral`,
        type: 'historic_site',
        description: 'A magnificent cathedral dating back to the 16th century with stunning architecture.',
        rating: 4.6,
        imageColor: '#f59e0b', // amber
        icon: getPlaceIcon('historic_site'),
        address: '45 Old Town Square',
        hours: 'Open 10 AM - 4 PM',
        website: 'https://example.com/cathedral'
      },
      {
        id: 'place4',
        name: `${location} Luxury Shopping Mall`,
        type: 'shopping_mall',
        description: 'Premium shopping experience with international brands and local boutiques.',
        rating: 4.3,
        imageColor: '#8b5cf6', // purple
        icon: getPlaceIcon('shopping_mall'),
        address: '789 Commerce Street',
        hours: 'Open 10 AM - 9 PM',
        priceLevel: 3
      },
      {
        id: 'place5',
        name: `${location} Science Museum`,
        type: 'museum',
        description: 'Interactive exhibits showcasing scientific discoveries and innovations.',
        rating: 4.5,
        imageColor: '#3b82f6', // blue
        icon: getPlaceIcon('museum'),
        address: '567 Science Boulevard',
        website: 'https://example.com/science',
        hours: 'Open 9 AM - 6 PM',
        priceLevel: 1
      },
      {
        id: 'place6',
        name: `${location} Waterfront`,
        type: 'park',
        description: 'Scenic waterfront area with walking paths, cafes, and beautiful views.',
        rating: 4.9,
        imageColor: '#10b981', // green
        icon: getPlaceIcon('park'),
        address: 'Waterfront District',
        hours: 'Open 24 hours',
        priceLevel: 0
      },
      {
        id: 'place7',
        name: `${location} Gourmet Restaurant`,
        type: 'restaurant',
        description: 'Fine dining establishment serving locally-sourced cuisine with international influences.',
        rating: 4.6,
        imageColor: '#ef4444', // red
        icon: getPlaceIcon('restaurant'),
        address: '321 Culinary Avenue',
        hours: 'Open 5 PM - 11 PM',
        phone: '+1 123-456-7890',
        priceLevel: 4
      }
    ]
  }

  // Filter places by category
  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.type === selectedCategory)

  // Render price level
  const renderPriceLevel = (level?: number) => {
    if (level === undefined) return null
    
    const levels = ['Free', '$', '$$', '$$$', '$$$$']
    return (
      <span className="text-gray-600 dark:text-gray-400 text-sm">
        {levels[level]}
      </span>
    )
  }

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <FiStar className="text-yellow-500 mr-1" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Render image placeholder (now just the icon)
  const ImagePlaceholder = ({ color, type }: { color: string, type: string }) => {
    return (
      <div className="w-[72px] h-[72px] flex items-center justify-center">
        <div className="flex items-center justify-center" style={{ color }}>
          {getPlaceTypeIcon(type)}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="w-full p-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
          Places to Visit in {location}
        </h3>
        <button
          onClick={onTogglePlaces}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            showPlacesOnMap
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
          }`}
          title={showPlacesOnMap ? 'Hide places on map' : 'Show places on map'}
        >
          <FiMap className="w-5 h-5" />
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="w-full flex items-center justify-center py-20 flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Category filters */}
      <div className="w-full p-4 border-b border-gray-200 dark:border-dark-700 overflow-x-auto hide-scrollbar shrink-0">
        <div className="flex space-x-2 min-w-max">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Places list */}
      {!loading && places.length > 0 ? (
        <div className="w-full divide-y divide-gray-200 dark:divide-dark-700 overflow-y-auto flex-grow">
          {filteredPlaces.map(place => (
            <div 
              key={place.id}
              ref={place.id === selectedPlaceId ? selectedItemRef : null}
              className={`w-full p-4 flex items-start hover:bg-gray-50 dark:hover:bg-dark-700/50 cursor-pointer transition-all duration-300 ${
                place.id === selectedPlaceId ? 'bg-primary-50 dark:bg-primary-900/10' : ''
              }`}
              onClick={() => onSelectPlace(place.id)}
            >
              <ImagePlaceholder 
                color={getPlaceColor(place.type)}
                type={place.type}
              />
              <div className="ml-3 flex-grow min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {place.name}
                  </h4>
                  <div className="flex-shrink-0 ml-2">
                    {renderRating(place.rating)}
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span className="ml-1">
                    {place.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                  {place.priceLevel !== undefined && (
                    <span className="ml-2">{renderPriceLevel(place.priceLevel)}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                  {place.description}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  {place.hours && (
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{place.hours}</span>
                    </div>
                  )}
                  {place.address && (
                    <div className="flex items-center">
                      <FiMapPin className="mr-1" />
                      <span>{place.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="w-full p-8 text-center flex-grow">
          <p className="text-gray-500 dark:text-gray-400">No places found for this category.</p>
        </div>
      ) : null}

      {/* Add flash animation styles */}
      <style jsx global>{`
        @keyframes flash {
          0% { background-color: transparent; }
          50% { background-color: rgba(59, 130, 246, 0.1); }
          100% { background-color: transparent; }
        }
        
        .flash-highlight {
          animation: flash 1s ease-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          height: 0px;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
      `}</style>
    </div>
  )
}

export default PlacesDisplay 