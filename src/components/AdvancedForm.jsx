'use client'

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AdvancedForm = () => {
  const [formData, setFormData] = useState({
    textInput: '',
    radioOption: 'option1',
    checkboxOptions: [],
    singleFile: null,
    multipleFiles: []
  });

  const [uploadProgress, setUploadProgress] = useState({
    singleFile: 0,
    multipleFiles: {}
  });
  
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'radio' ? value : value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      singleFile: file
    }));
    setUploadProgress(prev => ({
      ...prev,
      singleFile: 0
    }));
  };

  const handleMultiFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      multipleFiles: files
    }));
    
    const newProgress = {};
    files.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(prev => ({
      ...prev,
      multipleFiles: newProgress
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // Get JWT token (you might have this in cookies/localStorage)
      const token = localStorage.getItem('jwtToken') || '';
      
      // Create FormData for file uploads
      const data = new FormData();
      data.append('textInput', formData.textInput);
      data.append('radioOption', formData.radioOption);
      formData.checkboxOptions.forEach(opt => data.append('checkboxOptions', opt));
      
      if (formData.singleFile) {
        data.append('singleFile', formData.singleFile);
      }
      
      formData.multipleFiles.forEach(file => {
        data.append('multipleFiles', file);
      });
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (formData.singleFile && !formData.multipleFiles.length) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              singleFile: progress
            }));
          } else if (formData.multipleFiles.length) {
            // This is a simplified approach - in a real app you'd track each file separately
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const newProgress = {};
            formData.multipleFiles.forEach(file => {
              newProgress[file.name] = progress;
            });
            setUploadProgress(prev => ({
              ...prev,
              multipleFiles: newProgress
            }));
          }
        }
      };
      
      const response = await axios.post('/api/submit-form', data, config);
      
      setSubmitSuccess(true);
      // Reset form after successful submission if needed
      // handleReset();
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Advanced Form</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div>
          <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Input
          </label>
          <input
            type="text"
            id="textInput"
            name="textInput"
            value={formData.textInput}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            placeholder="Enter some text"
          />
        </div>
        
        {/* Radio Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Radio Options
          </label>
          <div className="space-y-2">
            {['option1', 'option2', 'option3'].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={option}
                  name="radioOption"
                  value={option}
                  checked={formData.radioOption === option}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={option} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Checkbox Options
          </label>
          <div className="space-y-2">
            {['check1', 'check2', 'check3'].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`checkbox-${option}`}
                  name="checkboxOptions"
                  value={option}
                  checked={formData.checkboxOptions.includes(option)}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                />
                <label htmlFor={`checkbox-${option}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Single File Upload */}
        <div>
          <label htmlFor="singleFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Single File Upload
          </label>
          <input
            type="file"
            id="singleFile"
            name="singleFile"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-100
              hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
          />
          {formData.singleFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected: {formData.singleFile.name}
              </p>
              {uploadProgress.singleFile > 0 && uploadProgress.singleFile < 100 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress.singleFile}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                    {uploadProgress.singleFile}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Multiple File Upload */}
        <div>
          <label htmlFor="multipleFiles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Multiple File Upload
          </label>
          <input
            type="file"
            id="multipleFiles"
            name="multipleFiles"
            onChange={handleMultiFileChange}
            multiple
            ref={multiFileInputRef}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-100
              hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
          />
          {formData.multipleFiles.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected {formData.multipleFiles.length} file(s):
              </p>
              <ul className="space-y-2">
                {formData.multipleFiles.map((file) => (
                  <li key={file.name} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">{file.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {uploadProgress.multipleFiles[file.name] || 0}%
                      </span>
                    </div>
                    {uploadProgress.multipleFiles[file.name] > 0 && 
                     uploadProgress.multipleFiles[file.name] < 100 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress.multipleFiles[file.name]}%` }}
                        ></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
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
            Form submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedForm;