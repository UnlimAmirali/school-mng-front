'use client'

import { useState, useRef, useEffect } from 'react'
import { UserCircleIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // بستن منو هنگام کلیک خارج از آن
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none p-2"
      >
        <div className="p-2  rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-700  cursor-pointer dark:bg-gray-600 flex items-center justify-center">
          <UserCircleIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <CogIcon className="h-6 w-6 ml-2" />
            تنظیمات
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 ml-2" />
            خروج
          </a>
        </div>
      )}
    </div>
  )
}