export default function DashboardPage() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          به داشبورد خوش آمدید
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* کارت‌های داشبورد */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >

<div className="bg-red-500 text-white p-4 rounded-lg">
  تست Tailwind - اگر این متن با پس‌زمینه قرمز دیده می‌شود، Tailwind کار می‌کند
</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                کارت نمونه {item}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                این یک کارت نمونه برای نمایش در داشبورد است.
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }