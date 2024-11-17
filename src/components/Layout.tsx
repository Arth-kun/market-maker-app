import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      <nav className="bg-white shadow-sm flex-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Market Maker</h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link 
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Map
                </Link>
                <Link
                  to="/calendar"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Calendar
                </Link>
                <Link
                  to="/markets"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Markets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}






