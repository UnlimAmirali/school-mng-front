'use client'
import { useState, useEffect, useMemo } from 'react'
import { ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function AdvancedTable({
  columns,
  data,
  itemsPerPage = 10,
  searchable = true
}) {
  // State مدیریت
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // تشخیص دستگاه موبایل
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // فیلتر و مرتب‌سازی داده‌ها
  const processedData = useMemo(() => {
    let filteredData = [...data]

    // اعمال جستجو
    if (searchTerm && searchable) {
      filteredData = filteredData.filter(item =>
        columns.some(column => {
          const value = item[column.key]?.toString().toLowerCase() || ''
          return value.includes(searchTerm.toLowerCase())
        })
      )
    }

    // اعمال مرتب‌سازی
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || ''
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || ''
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filteredData
  }, [data, searchTerm, sortConfig, columns, searchable])

  // صفحه‌بندی
  const totalPages = Math.ceil(processedData.length / itemsPerPage)
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // تغییر مرتب‌سازی
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1) // بازگشت به صفحه اول پس از مرتب‌سازی
  }

  return (
    <div className="overflow-x-auto pt-2 pr-1">
      {/* نوار جستجو */}
      {searchable && (
        <div className="mb-4 relative max-w-xs">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="جستجو..."
            className="block w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // بازگشت به صفحه اول پس از جستجو
            }}
          />
        </div>
      )}

      {/* جدول */}
      <table className="text-center min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-black rounded-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              !(isMobile && column.isMobileHide) && (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center justify-center text-right">
                    {column.title}
                    {sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? (
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 mr-1" />
                      )
                    )}
                  </div>
                </th>
              )
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                {columns.map((column) => (
                  !(isMobile && column.isMobileHide) && (
                    <td key={`${index}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  )
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                موردی یافت نشد
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0">
          {/* <div className="text-sm text-gray-700 dark:text-gray-300">
            نمایش {paginatedData.length} از {processedData.length} مورد
          </div> */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              قبلی
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === pageNum
                        ? 'border-primary-500 bg-primary-500 text-black dark:text-white cursor-pointer'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              بعدی
            </button>
          </div>
        </div>
      )}
    </div>
  )
}