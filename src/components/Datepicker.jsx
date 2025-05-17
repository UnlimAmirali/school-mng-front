'use client'

import { useState, useEffect } from 'react'

const DatePicker = ({ onChange, initialDate = {} }) => {
  // محدوده سال‌ها
  const startYear = 1300
  const endYear = 1440

  // حالت‌های داخلی
  const [year, setYear] = useState(initialDate.year || startYear)
  const [month, setMonth] = useState(initialDate.month || 1)
  const [day, setDay] = useState(initialDate.day || 1)

  // محاسبه تعداد روزهای ماه
  const getDaysInMonth = (year, month) => {
    if (month <= 6) return 31
    if (month <= 11) return 30
    // اسفند - سال کبیسه
    return (year % 4 === 3) ? 30 : 29
  }

  // روزهای ماه جاری
  const daysInMonth = getDaysInMonth(year, month)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // تنظیم روز در صورت تغییر سال یا ماه
  useEffect(() => {
    const newDaysInMonth = getDaysInMonth(year, month)
    if (day > newDaysInMonth) {
      setDay(newDaysInMonth)
    }
  }, [year, month, day])

  // اعمال تغییرات و ارسال به والد
  useEffect(() => {
    onChange({ year, month, day })
  }, [year, month, day, onChange])

  return (
    <div className="flex gap-2">
      {/* انتخاب سال */}
      <select 
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
        className="p-2 border rounded-md"
      >
        {Array.from({ length: endYear - startYear + 1 }, (_, i) => (
          <option key={i} value={startYear + i}>
            {startYear + i}
          </option>
        ))}
      </select>

      {/* انتخاب ماه */}
      <select
        value={month}
        onChange={(e) => setMonth(parseInt(e.target.value))}
        className="p-2 border rounded-md"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      {/* انتخاب روز */}
      <select
        value={day}
        onChange={(e) => setDay(parseInt(e.target.value))}
        className="p-2 border rounded-md"
      >
        {daysArray.map(d => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DatePicker