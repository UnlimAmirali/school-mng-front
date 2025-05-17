"use client"
import React, { useState, useEffect } from 'react';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 دقیقه به ثانیه
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    if (showOtpField && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, showOtpField]);

  const handleSendPhoneNumber = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number:phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در ارسال کد تأیید');
      }

      setShowOtpField(true);
      setCountdown(120);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/otp/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number:phoneNumber, code :otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در تأیید کد');
      }

      // ذخیره توکن JWT در localStorage یا state مدیریت وضعیت
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      // localStorage.setItem('')
      if(data.is_registered === false){
        window.location.href = '/ParentDashboard/registered/';
      }else{
         window.location.href = '/ParentDashboard/';
      }
    
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowOtpField(false);
    setOtp('');
    setError('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row dark:bg-gray-900 text-white bg-gray-50 text-gray-900`}>
      {/* سمت چپ - تصویر و متن */}

      {/* سمت راست - فرم ورود */}
      <div className={`md:w-1/2 bg-red flex items-center justify-center p-8 dark:bg-gray-800 bg-white`}>
        <div className="w-full max-w-md bg-red">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-black">ورود / ثبت‌نام</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!showOtpField ? (
            <div>
              <div className="mb-6">
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-black">
                  شماره تلفن همراه
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-50 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="09*********"
                />
              </div>

              <button
                onClick={handleSendPhoneNumber}
                disabled={!phoneNumber || loading}
                className={`w-full py-3 px-4 rounded-lg font-medium ${!phoneNumber || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'} text-white`}
              >
                {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <label htmlFor="otp" className="block mb-2 text-sm font-medium">
                  کد تأیید
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                  placeholder="کد 6 رقمی"
                  maxLength={6}
                />
                <div className={`mt-2 text-sm dark:text-gray-400 text-gray-500`}>
                  کد به شماره {phoneNumber} ارسال شد
                </div>
                <div className={`mt-1 text-sm ${countdown < 30 ? 'text-red-500' : 'dark:text-gray-400 text-gray-500'}`}>
                  زمان باقیمانده: {formatTime(countdown)}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className={`py-3 px-4 rounded-lg font-medium dark:bg-gray-700 hover:bg-gray-600 bg-gray-200 hover:bg-gray-300 flex-1 cursor-pointer`}
                >
                  بازگشت
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={!otp || otp.length < 5 || loading}
                  className={`py-3 px-4 rounded-lg font-medium ${(!otp || otp.length < 5 || loading)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex-1`}
                >
                  {loading ? 'در حال تأیید...' : 'تأیید'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="md:w-1/2 relative">
        <img 
          src="https://source.unsplash.com/random/800x600?login" 
          alt="Login Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cyan-800 bg-opacity-40 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">به پلتفرم ما خوش آمدید</h1>
            <p className="text-xl">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;