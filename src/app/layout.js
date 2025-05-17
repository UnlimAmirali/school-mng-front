'use client' 
import ThemeProvider from "./theme/theme-provider";
import './globals.css'
import localFont from 'next/font/local'
const myFont = localFont({ src: './fonts/Yekan.woff' })
export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl"> 
      <body className={`${myFont.className}  font-sans   bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}