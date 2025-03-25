'use client'

import { useState, FormEvent, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchProps {
  onSearch: (location: string) => void
  initialValue?: string
}

const Search = ({ onSearch, initialValue = '' }: SearchProps) => {
  const [location, setLocation] = useState(initialValue)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!location.trim()) return
    onSearch(location)
  }

  useEffect(() => {
    setLocation(initialValue)
  }, [initialValue])

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location..."
          className="w-full md:w-80 px-4 py-2 pr-10 border border-gray-200 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

export default Search 