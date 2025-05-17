'use client'
import AdvancedTable from '@/components/AdvancedTable'

const columns = [
  {
    key: 'id',
    title: 'شناسه',
    isMobileHide: true
  },
  {
    key: 'name',
    title: 'نام کامل',
    render: (item) => <span className="font-medium">{item.name}</span>
  },
  {
    key: 'email',
    title: 'ایمیل'
  },
  {
    key: 'phone',
    title: 'تلفن',
    isMobileHide: true
  },
  {
    key: 'status',
    title: 'وضعیت',
    isMobileHide: true,
    render: (item) => item.status ==='active'? ( <span className="font-medium inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">فعال</span>):
    (<span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset">غیر فعال</span>)
  }
]

const sampleData = [
  { id: 1, name: 'علی محمدی', email: 'ali@example.com', phone: '09123456789', status:'active' },
  { id: 2, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' , status:'active'},
  { id: 3, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 4, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 5, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 6, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 7, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 8, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 9, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 10, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 11, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 12, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 13, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 14, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 15, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  { id: 16, name: 'رضا احمدی', email: 'reza@example.com', phone: '09129876543' },
  // ...
]

export default function UsersPage() {
  return (
    <div className="p-4 border rounded-md dark:border-gray-600 p-5">
      {/* <h1 className="text-xl font-bold mb-4">لیست کاربران</h1> */}
      <AdvancedTable 
        columns={columns} 
        data={sampleData} 
        itemsPerPage={5}
        searchable={true}
      />
    </div>
  )
}