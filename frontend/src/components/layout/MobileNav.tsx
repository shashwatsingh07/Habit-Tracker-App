import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Plus, User, TrendingUp } from 'lucide-react'

export function MobileNav() {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Create', href: '/create-habit', icon: Plus },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <nav className="flex justify-around">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon
                className={`h-6 w-6 mb-1 ${
                  isActive ? 'text-purple-600' : 'text-gray-400'
                }`}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}