'use client'

import { useState, useEffect } from 'react'
import { WeatherData } from '@/types/weather'
import { 
  FiWind, FiDroplet, FiEye, FiThermometer, 
  FiSunrise, FiSunset, FiCompass, FiCloud,
  FiBarChart2, FiSun
} from 'react-icons/fi'
import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise as WiSunriseIcon, WiSunset as WiSunsetIcon } from 'react-icons/wi'
import { formatTime } from '@/utils/helpers'

interface WeatherDisplayProps {
  weatherData: WeatherData
  className?: string
  isDarkMode?: boolean
}

// Function to format time from timestamp
const formatTimeFromTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

// Calculate apparent temperature based on temperature and wind speed
const calculateFeelsLike = (temp: number, windSpeed: number, humidity: number): number => {
  // Using a simple formula for feels like temperature
  // For a more accurate calculation, consider using Heat Index and Wind Chill
  const adjustedTemp = temp - (windSpeed * 0.5) + (humidity / 100 * 0.2)
  return Math.round(adjustedTemp)
}

// Component to visualize min/max values with gradient colors
const RangeIndicator = ({ 
  value, 
  min, 
  max, 
  unit = "",
  lowText,
  mediumText,
  highText,
  colorGradient = ['#3b82f6', '#8b5cf6', '#ef4444'] 
}: { 
  value: number, 
  min: number, 
  max: number, 
  unit?: string,
  lowText: string,
  mediumText: string,
  highText: string,
  colorGradient?: string[]
}) => {
  const percentage = ((value - min) / (max - min)) * 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  
  const getStateText = () => {
    if (percentage < 33) return lowText
    if (percentage < 66) return mediumText
    return highText
  }
  
  const getGradientColor = () => {
    if (percentage < 33) return colorGradient[0]
    if (percentage < 66) return colorGradient[1]
    return colorGradient[2]
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{min}{unit}</span>
        <span className="font-medium" style={{ color: getGradientColor() }}>{getStateText()}</span>
        <span>{max}{unit}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{ 
            width: `${clampedPercentage}%`,
            backgroundColor: getGradientColor()
          }}
        />
      </div>
    </div>
  )
}

const WeatherDisplay = ({ weatherData, className = '', isDarkMode = false }: WeatherDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false)
  
  // Format data from the API
  const tempCelsius = Math.round(weatherData.main.temp - 273.15)
  const feelsLikeCelsius = Math.round(weatherData.main.feels_like - 273.15)
  const minTempCelsius = Math.round(weatherData.main.temp_min - 273.15)
  const maxTempCelsius = Math.round(weatherData.main.temp_max - 273.15)
  const humidity = weatherData.main.humidity
  const windSpeed = weatherData.wind.speed
  const windDirection = weatherData.wind.deg
  const visibility = (weatherData.visibility / 1000).toFixed(1) // Convert to km
  const cloudiness = weatherData.clouds.all
  const pressure = weatherData.main.pressure
  const sunrise = formatTimeFromTimestamp(weatherData.sys.sunrise)
  const sunset = formatTimeFromTimestamp(weatherData.sys.sunset)

  // Get weather condition from API
  const weatherCondition = weatherData.weather[0].main
  const weatherDescription = weatherData.weather[0].description
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Weather icon URL
  const iconUrl = (iconCode: string) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  // Get compass direction from wind degrees
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }
  
  // Mini landscape based on weather condition
  const MiniLandscape = () => {
    // Determine landscape elements based on weather
    const getSkyColor = () => {
      if (weatherCondition === 'Clear') return '#87CEEB' // Light blue for clear
      if (weatherCondition === 'Clouds') {
        if (cloudiness < 30) return '#A4CAED' // Light blue with a hint of clouds
        if (cloudiness < 70) return '#9EB6D0' // More cloudy blue
        return '#7C8C9F' // Dark cloudy
      }
      if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') return '#5A7CA3' // Rainy blue
      if (weatherCondition === 'Thunderstorm') return '#445A77' // Storm blue
      if (weatherCondition === 'Snow') return '#E3E8EF' // Snow sky
      if (weatherCondition === 'Mist' || weatherCondition === 'Fog') return '#B5BBB8' // Misty gray
      return '#87CEEB' // Default to clear sky
    }

    const getGroundColor = () => {
      if (weatherCondition === 'Snow') return '#FFFFFF' // Snow ground
      return '#3D7A42' // Default to grass green
    }

    const renderWeatherElements = () => {
      switch (weatherCondition) {
        case 'Clear':
          return (
            <circle cx="40" cy="15" r="8" fill="#FFD700" /> // Sun
          )
        case 'Clouds':
          return (
            <>
              {cloudiness > 30 && <ellipse cx="20" cy="15" rx="10" ry="6" fill="white" />}
              {cloudiness > 10 && <ellipse cx="40" cy="10" rx="12" ry="7" fill="white" />}
              {cloudiness > 50 && <ellipse cx="60" cy="15" rx="10" ry="6" fill="white" />}
            </>
          )
        case 'Rain':
          return (
            <>
              <ellipse cx="30" cy="15" rx="15" ry="8" fill="#95A5A6" />
              <ellipse cx="50" cy="12" rx="15" ry="8" fill="#7F8C8D" />
              <line x1="25" y1="23" x2="23" y2="30" stroke="#4AA3DF" strokeWidth="1" />
              <line x1="35" y1="23" x2="33" y2="32" stroke="#4AA3DF" strokeWidth="1" />
              <line x1="45" y1="20" x2="43" y2="30" stroke="#4AA3DF" strokeWidth="1" />
              <line x1="55" y1="20" x2="53" y2="28" stroke="#4AA3DF" strokeWidth="1" />
            </>
          )
        case 'Snow':
          return (
            <>
              <ellipse cx="30" cy="15" rx="15" ry="8" fill="#95A5A6" />
              <ellipse cx="50" cy="12" rx="15" ry="8" fill="#7F8C8D" />
              <circle cx="25" cy="25" r="1" fill="white" />
              <circle cx="35" cy="28" r="1" fill="white" />
              <circle cx="45" cy="23" r="1" fill="white" />
              <circle cx="55" cy="26" r="1" fill="white" />
            </>
          )
        case 'Thunderstorm':
          return (
            <>
              <ellipse cx="30" cy="15" rx="15" ry="8" fill="#34495E" />
              <ellipse cx="50" cy="12" rx="15" ry="8" fill="#2C3E50" />
              <path d="M40,20 L35,28 L40,26 L35,35" stroke="#F1C40F" strokeWidth="1.5" fill="none" />
            </>
          )
        case 'Mist':
        case 'Fog':
          return (
            <>
              <line x1="15" y1="15" x2="30" y2="15" stroke="white" strokeWidth="2" />
              <line x1="35" y1="20" x2="55" y2="20" stroke="white" strokeWidth="2" />
              <line x1="20" y1="25" x2="40" y2="25" stroke="white" strokeWidth="2" />
            </>
          )
        default:
          return null
      }
    }

    return (
      <svg width="80" height="45" viewBox="0 0 80 45" className="rounded overflow-hidden">
        {/* Sky background */}
        <rect x="0" y="0" width="80" height="35" fill={getSkyColor()} />
        
        {/* Ground */}
        <rect x="0" y="35" width="80" height="10" fill={getGroundColor()} />
        
        {/* Weather elements */}
        {renderWeatherElements()}
      </svg>
    )
  }

  // Delay showing details for a smoother UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDetails(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  // Calculate day progress percentage based on current time relative to sunrise and sunset
  const calculateDayProgress = () => {
    const now = new Date().getTime();
    const sunriseTime = weatherData.sys.sunrise * 1000;
    const sunsetTime = weatherData.sys.sunset * 1000;
    
    if (now < sunriseTime) return 0;
    if (now > sunsetTime) return 100;
    
    return ((now - sunriseTime) / (sunsetTime - sunriseTime)) * 100;
  };

  // Day progress for sun position indicator
  const dayProgress = calculateDayProgress();

  return (
    <div className={`transition-opacity duration-500 ${showDetails ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {/* Primary Weather Info */}
      <div className="mb-6 flex items-start gap-6">
        <div className="flex-shrink-0">
          <img 
            src={iconUrl(weatherData.weather[0].icon)} 
            alt={weatherData.weather[0].description}
            className="w-20 h-20"
          />
        </div>
        <div className="flex-grow min-w-0 pt-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
            {weatherData.name}
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
            {weatherDescription}
          </p>
        </div>
        <div className="flex-shrink-0 bg-white/70 dark:bg-dark-800/70 px-5 py-2 rounded-full border border-gray-200 dark:border-dark-700 shadow-sm pt-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tempCelsius}°C</span>
        </div>
      </div>
      
      {/* Weather Stats - Vertical Layout */}
      <div className="space-y-4">
        {/* Temperature Card */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-md mr-2">
                <FiThermometer className="text-red-500" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Temperature</h3>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xl font-bold">{tempCelsius}°C</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Feels like: {feelsLikeCelsius}°C</p>
            </div>
            <RangeIndicator 
              value={tempCelsius} 
              min={minTempCelsius} 
              max={maxTempCelsius} 
              unit="°C"
              lowText="Cold"
              mediumText="Comfortable"
              highText="Hot"
            />
          </div>
        </div>
        
        {/* Wind Card */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md mr-2">
                <FiWind className="text-blue-500" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Wind</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{windSpeed} m/s</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <FiCompass className="mr-1" size={12} />
              <span>{getWindDirection(windDirection)} ({windDirection}°)</span>
            </p>
            <RangeIndicator 
              value={windSpeed}
              min={0}
              max={20}
              unit=" m/s"
              lowText="Calm"
              mediumText="Breezy"
              highText="Strong"
              colorGradient={['#10b981', '#3b82f6', '#ef4444']} // Green to blue to red
            />
          </div>
        </div>
        
        {/* Humidity Card */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md mr-2">
                <FiDroplet className="text-blue-500" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Humidity</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{humidity}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {humidity < 30
                ? 'Dry'
                : humidity > 70
                ? 'Humid'
                : 'Comfortable'}
            </p>
            <RangeIndicator 
              value={humidity}
              min={0}
              max={100}
              unit="%"
              lowText="Dry"
              mediumText="Comfortable"
              highText="Humid"
              colorGradient={['#f59e0b', '#10b981', '#3b82f6']} // Amber to green to blue
            />
          </div>
        </div>
        
        {/* Clouds Card */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-gray-100 dark:bg-gray-700/30 rounded-md mr-2">
                <FiCloud className="text-gray-500" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Clouds</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{cloudiness}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {cloudiness < 20
                ? 'Clear skies'
                : cloudiness < 50
                ? 'Partly cloudy'
                : 'Overcast'}
            </p>
            <RangeIndicator 
              value={cloudiness}
              min={0}
              max={100}
              unit="%"
              lowText="Clear"
              mediumText="Partly Cloudy"
              highText="Overcast"
              colorGradient={['#60a5fa', '#93c5fd', '#6b7280']} // Blue to light blue to gray
            />
          </div>
        </div>

        {/* Visibility Card */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-md mr-2">
                <FiEye className="text-purple-500" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Visibility</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{visibility} km</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {Number(visibility) >= 10
                ? 'Excellent'
                : Number(visibility) >= 5
                ? 'Good'
                : 'Limited'}
            </p>
            <RangeIndicator 
              value={Number(visibility)}
              min={0}
              max={10}
              unit=" km"
              lowText="Poor"
              mediumText="Moderate"
              highText="Excellent"
              colorGradient={['#ef4444', '#f59e0b', '#10b981']} // Red to amber to green
            />
          </div>
        </div>

        {/* Pressure Card */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md mr-2">
                <FiBarChart2 className="text-blue-500" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Pressure</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{pressure} hPa</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {pressure < 1000
                ? 'Low'
                : pressure > 1020
                ? 'High'
                : 'Normal'}
            </p>
            <RangeIndicator 
              value={pressure}
              min={970}
              max={1050}
              unit=" hPa"
              lowText="Low"
              mediumText="Normal"
              highText="High"
              colorGradient={['#ef4444', '#10b981', '#3b82f6']} // Red to green to blue
            />
          </div>
        </div>

        {/* Sun Card with Improved Visualization */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-md mr-2">
                <FiSun className="text-amber-500" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sun</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sunrise</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{sunrise}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sunset</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{sunset}</p>
              </div>
            </div>
            
            {/* Improved sun position visualization */}
            <div className="mt-5 mb-3">
              {/* Day/night cycle visualization */}
              <div className="relative h-20 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-dark-900 dark:to-dark-800 rounded-lg overflow-hidden">
                {/* Sky gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-blue-400/10 to-indigo-500/10 dark:from-indigo-900/30 dark:via-blue-800/20 dark:to-indigo-900/30"></div>
                
                {/* Horizon line */}
                <div className="absolute bottom-0 w-full h-6 bg-gradient-to-r from-gray-300/80 via-gray-200/80 to-gray-300/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80"></div>
                
                {/* Time markers */}
                <div className="absolute top-0 left-0 h-full w-full flex items-end">
                  {/* Sunrise marker */}
                  <div className="absolute bottom-7 left-0 h-10 flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-gray-400 dark:bg-gray-500"></div>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">Sunrise</span>
                  </div>
                  
                  {/* Noon marker */}
                  <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 h-10 flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-gray-400 dark:bg-gray-500"></div>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">Noon</span>
                  </div>
                  
                  {/* Sunset marker */}
                  <div className="absolute bottom-7 right-0 h-10 flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-gray-400 dark:bg-gray-500"></div>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">Sunset</span>
                  </div>
                </div>
                
                {/* Sun position */}
                <div 
                  className="absolute flex items-center justify-center"
                  style={{ 
                    left: `${dayProgress}%`,
                    bottom: `${Math.sin(Math.PI * dayProgress / 100) * 60 + 15}%`,
                    transform: 'translate(-50%, 50%)'
                  }}
                >
                  {/* Sun glow effect */}
                  <div className="absolute w-10 h-10 bg-yellow-400/30 dark:bg-yellow-500/20 rounded-full blur-md"></div>
                  
                  {/* Sun icon */}
                  <div className="relative z-10 w-5 h-5 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    {/* Sun rays */}
                    <div className="absolute inset-0 w-full h-full animate-pulse">
                      <div className="absolute top-1/2 left-1/2 w-7 h-0.5 bg-yellow-300 dark:bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute top-1/2 left-1/2 w-7 h-0.5 bg-yellow-300 dark:bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                      <div className="absolute top-1/2 left-1/2 w-7 h-0.5 bg-yellow-300 dark:bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
                      <div className="absolute top-1/2 left-1/2 w-7 h-0.5 bg-yellow-300 dark:bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2 rotate-135"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Time indicators */}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">{sunrise}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{sunset}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay 