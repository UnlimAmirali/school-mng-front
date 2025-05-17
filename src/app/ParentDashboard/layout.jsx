'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  if(pathname == '/ParentDashboard/ParentLoginPage'){
    return(
      <>
        {children}
      </>
    )
  }else{
    return (
      <ThemeProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar navItems={[
              { name: 'داشبورد', href: '/', icon: HomeIcon },
              { name: 'ثبت نام ', href: '/ParentDashboard/registeredStudent', icon: UsersIcon },
            ]} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </div>
      </ThemeProvider>
    )
}
}