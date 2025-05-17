import { useState, useEffect } from 'react';
import axios from 'axios';

function EducationalLevelSelect({ onSelect, selectedValue }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/Educational-levels/`);
        setLevels(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching educational levels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  if (loading) return (
    <div className="p-2 text-gray-500">
      در حال بارگیری مقاطع تحصیلی...
    </div>
  );

  if (error) return (
    <div className="p-2 text-red-500">
      خطا در دریافت داده‌ها: {error}
    </div>
  );

  return (
    <div className="mb-4">
      <label htmlFor="edu-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        مقطع تحصیلی
      </label>
      <select
        id="edu-level"
        value={selectedValue || ''}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- لطفا مقطع را انتخاب کنید --</option>
        {levels.filter(level => level.status === 'active').map(level => (
          <option key={level.id} value={level.id}>
            {level.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EducationalLevelSelect;