'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'
import UserDropdown from './UserDropdown'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm overflow-visible">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="جستجو..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}