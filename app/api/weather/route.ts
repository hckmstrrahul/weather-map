import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_WEATHERMAP_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Weather API key is not configured' },
        { status: 500 }
      )
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}`
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Weather API error:', error.response?.data || error.message)
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
} 