'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

interface WeatherMapProps {
  lat: number
  lng: number
  location: string
}

// Map styles for modern theme
const mapStyles = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#e9e9e9" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 29 },
      { "weight": 0.2 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 18 }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 16 }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 21 }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#dedede" },
      { "lightness": 21 }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 16 }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#444444" }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f2f2f2" },
      { "lightness": 19 }
    ]
  }
];

// Dark mode map styles
const darkMapStyles = [
  {
    "elementType": "geometry",
    "stylers": [
      { "color": "#242f3e" }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#242f3e" }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#746855" }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#d59563" }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#d59563" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#263c3f" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#6b9a76" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "color": "#38414e" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#212a37" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#9ca5b3" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "color": "#746855" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#1f2835" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#f3d19c" }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      { "color": "#2f3948" }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#d59563" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#17263c" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#515c6d" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#17263c" }
    ]
  }
];

// Satellite/aerial view options
const aerialMapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeId: 'satellite'
}

// Options object outside component to prevent re-creation
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  // No custom styles for light mode - use the default Google Maps style
  styles: []
}

// Dark mode map options
const darkMapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: darkMapStyles
}

// Custom marker icon
const markerIcon = {
  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  scaledSize: { width: 35, height: 35 },
  origin: { x: 0, y: 0 },
  anchor: { x: 15, y: 35 }
}

// Define the different map configurations
const mapConfigurations = [
  { zoom: 14, title: "City View", offset: { lat: 0, lng: 0 } },
  { zoom: 10, title: "Area View", offset: { lat: 0, lng: 0 } },
  { zoom: 6, title: "Region View", offset: { lat: 0, lng: 0 } },
  { zoom: 4, title: "Country View", offset: { lat: 0, lng: 0 } }
];

const WeatherMap = ({ lat, lng, location }: WeatherMapProps) => {
  // For forcing re-render when location changes
  const [locationKey, setLocationKey] = useState<string>(`${lat}-${lng}-${location}`);
  
  // Update location key when props change
  useEffect(() => {
    setLocationKey(`${lat}-${lng}-${location}`);
  }, [lat, lng, location]);
  
  console.log('WeatherMap render with:', { lat, lng, location });
  
  // Get the Google Maps API key
  const apiKey = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    console.log('API Key:', key ? 'Key exists' : 'No key found');
    return key;
  }, []);
  
  // Check if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for dark mode
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      
      // Listen for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, []);
  
  // Load the Google Maps script with location key to force reload
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"]
  });

  console.log('Google Maps script status:', { isLoaded, hasLoadError: !!loadError });

  // Maps grid component, memoized to prevent unnecessary re-renders
  const MapsGrid = useCallback(() => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mapConfigurations.map((config, index) => (
            <MapComponent
              key={`${locationKey}-${config.title}-${index}`}
              zoom={config.zoom}
              title={config.title}
              lat={lat + config.offset.lat}
              lng={lng + config.offset.lng}
              location={location}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
        <div className="text-center mt-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
          Maps showing {location} at different scale levels
        </div>
          
        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Aerial View</h3>
        <MapComponent
          key={`aerial-${locationKey}`}
          zoom={14}
          title="Aerial View"
          lat={lat}
          lng={lng}
          location={location}
          mapType="aerial"
          isDarkMode={isDarkMode}
        />
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          Satellite imagery of {location}
        </div>
      </>
    );
  }, [lat, lng, location, locationKey, isDarkMode]);

  // Render map placeholder during loading
  const MapPlaceholder = ({ title }: { title: string }) => (
    <div className="relative">
      <div className="w-full h-[200px] bg-gray-100 dark:bg-dark-800 rounded-md flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 dark:border-primary-400 border-t-transparent rounded-full"></div>
      </div>
      <div className="border border-gray-200 dark:border-dark-700 rounded-md absolute inset-0 pointer-events-none"></div>
      <div className="absolute top-2 left-2 text-xs font-bold bg-white/80 dark:bg-dark-800/80 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
        {title}
      </div>
    </div>
  );

  // Handle API loading errors
  if (loadError) {
    console.error('Error loading Google Maps API:', loadError);
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-red-200 dark:border-red-700 p-4 text-red-700 dark:text-red-400">
        <p>Error loading Google Maps. Please try refreshing the page.</p>
      </div>
    );
  }

  // Show loading placeholders while the script is loading
  if (!isLoaded) {
    console.log('Google Maps script is still loading, showing placeholders');
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mapConfigurations.map((config, index) => (
          <MapPlaceholder key={index} title={config.title} />
        ))}
      </div>
    );
  }

  console.log('Google Maps script loaded, showing maps with coordinates', { lat, lng });
  return <MapsGrid />;
};

// Separated map component to handle individual maps
const MapComponent = ({ 
  zoom, 
  title, 
  lat,
  lng,
  location,
  mapType = 'standard',
  isDarkMode
}: { 
  zoom: number;
  title: string;
  lat: number;
  lng: number;
  location: string;
  mapType?: 'standard' | 'aerial';
  isDarkMode: boolean;
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  console.log(`Rendering ${title} map for: ${location} at [${lat}, ${lng}]`);

  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: mapType === 'aerial' ? '700px' : '200px', // Increased height for aerial view
    borderRadius: '0.375rem'
  }), [mapType]);

  const center = useMemo(() => ({
    lat, 
    lng
  }), [lat, lng]);
  
  const options = useMemo(() => {
    if (mapType === 'aerial') return aerialMapOptions;
    return isDarkMode ? darkMapOptions : mapOptions;
  }, [mapType, isDarkMode]);
  
  // Update map center when props change
  useEffect(() => {
    if (map) {
      console.log(`Updating ${title} map center to:`, { lat, lng });
      map.panTo({ lat, lng });
    }
  }, [map, lat, lng, title]);

  // Special handling for marker icon
  const getMarkerIcon = useCallback(() => {
    if (typeof window === 'undefined' || !window.google) return null;
    
    return {
      ...markerIcon,
      scaledSize: new window.google.maps.Size(35, 35)
    };
  }, []);

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={options}
        onLoad={setMap}
      >
        {map && (
          <Marker 
            position={{ lat, lng }}
            title={location}
            // @ts-ignore - Google Maps types issue with custom icon
            icon={mapType === 'standard' ? getMarkerIcon() : null}
          />
        )}
      </GoogleMap>
      <div className="border border-gray-200 dark:border-dark-700 rounded-md absolute inset-0 pointer-events-none"></div>
      <div className="absolute top-2 left-2 text-xs font-bold bg-white/80 dark:bg-dark-800/80 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
        {title}
      </div>
    </div>
  );
};

export default WeatherMap; 