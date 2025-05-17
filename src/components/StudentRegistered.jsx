'use client'

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DatePicker from '@/components/Datepicker'
import EducationalLevelSelect from '@/components/EducationalLevelSelect';

const StudentRegistered = () => {
  const [date, setDate] = useState({
    year: 1400,
    month: 1,
    day: 1
  })

  const [formData, setFormData] = useState({
    nationId: '',
    phone_number:'',
    address:'',
    name:'',
    family:'',
  });

  const [uploadProgress, setUploadProgress] = useState({
    singleFile: 0,
    multipleFiles: {}
  });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const fileInputRef = useRef(null);
  const multiFileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        checkboxOptions: checked 
          ? [...prev.checkboxOptions, value]
          : prev.checkboxOptions.filter(opt => opt !== value)
      }));
    } else if(type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'radio' ? value : value
      }));
    }else{
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
    console.log('مقطع انتخاب شده:', levelId);
    // می‌توانید اینجا درخواست‌های دیگر را انجام دهید
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const refreshToken = localStorage.getItem('refresh_token');
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/token/refresh/`, {
        refresh: refreshToken,
      });
      const { access } = response.data;
    
      localStorage.setItem('access_token', access);
    } catch (error) {
      if (error.response) {
        // خطاهایی که پاسخ از سرور دارند
        console.error('HTTP Status:', error.response.status);
        console.error('Error Data:', error.response.data);
      } else if (error.request) {
        // خطاهایی که درخواست فرستاده شده ولی پاسخی دریافت نشده
        console.error('Request Error:', error.request);
      } else {
        // سایر خطاها
        console.error('Error Message:', error.message);
      }
      throw error;
    }
    
    const accessToken = localStorage.getItem('access_token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('family', formData.family);
      data.append('national_id',formData.nationId)
      data.append('address', formData.address)
      data.append('phone_number', formData.phone_number)

    try {
      setSubmitSuccess(false);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/parents/`,data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      setSubmitSuccess(true);
    } catch (error) {
      if (error.response) {
        
        // خطاهایی که پاسخ از سرور دارند
        // console.error('HTTP Status:', error.response.status);
        // console.error('Error Data:', error.response.data);
        const errorMessages = error.response.data;
        let errorMessageString = "";
        for (const field in errorMessages) {
          if (errorMessages.hasOwnProperty(field)) {
            // console.error(`Error in ${field}: ${errorMessages[field].join(', ')}`);
            if(!errorMessages.detail){
              errorMessageString += ` خطا ${field}: ${errorMessages[field].join(', ')}\n`;
            }else{
               errorMessageString = errorMessages.detail
            }
            
            // toast.warn('Error Data! \n'+` ${field}: ${errorMessages[field].join(', ')}\n`, toastConfig);
            setSubmitError( errorMessageString || 'Failed to submit form');
          }
        }
        // toast('Error Data! \n'+errorMessageString, toastConfig);
      } else if (error.request) {
        // خطاهایی که درخواست فرستاده شده ولی پاسخی دریافت نشده
        // console.error('Request Error:', error.request);
        // toast('Request Error! \n'+error.request, toastConfig);
      } else {
        // سایر خطاها
        // toast('Error Message! \n'+error.message, toastConfig);
        // console.error('Error Message:', error.message);
      }
    }
  };

 
  const handleReset = () => {
    setFormData({
      textInput: '',
      radioOption: 'option1',
      checkboxOptions: [],
      singleFile: null,
      multipleFiles: []
    });
    setUploadProgress({
      singleFile: 0,
      multipleFiles: {}
    });
    setSubmitError('');
    setSubmitSuccess(false);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (multiFileInputRef.current) multiFileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <h4 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">ثبت نام</h4>
      
      <form onSubmit={handleSubmit} className="space-y-6">
       
        <div>
          <label htmlFor="textInput1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          نام
          </label>
          <input
            type="text"
            id="textInput1"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder=""
          />
        </div>

        <div>
          <label htmlFor="textInput2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            نام خانوادگی
          </label>
          <input
            type="text"
            id="familyID"
            name="family"
            value={formData.family}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder=""
          />
        </div>

        <div>
          <label htmlFor="textInput2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
           کدملی
          </label>
          <input
            type="text"
            id="nationIdID"
            name="nationId"
            value={formData.nationId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder=""
          />
        </div> 

        <div>
          <label htmlFor="textInput2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
         تاریخ تولد
          </label>


          <DatePicker 
            onChange={setDate}
            initialDate={{ year: 1400, month: 5, day: 15 }}
          />
          <br/>
          <input
            type="text"
            id="AddressID"
            name="address"
            readOnly
            value={` ${date.day}-${date.month}-${date.year}`}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder=""
          />
        </div> 

        <div>
          <label htmlFor="textInput2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          شماره تماس
          </label>
          <input
            type="text"
            id="phone_numberID"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder=""
          />
        </div> 


        <div>

      <EducationalLevelSelect 
        onSelect={handleLevelChange} 
        selectedValue={selectedLevel}
      />
      {selectedLevel && (
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مقطع انتخاب شده: {selectedLevel}</p>
      )}
          {/* <input
            type="text"
            id="phone_numberID"
            name="phone_number"
            value={selectedLevel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder=""
          /> */}
        </div> 
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {/* <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
          >
            Reset Form
          </button> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 disabled:opacity-50"
          >
            {isSubmitting ? 'درحال ارسال...' : 'ارسال'}
          </button>
        </div>
        
        {/* Status Messages */}
        {submitError && (
          <div className="p-4 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="p-4 text-sm text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-md">
           در خواست ثبت نام ایجاد شد
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentRegistered;