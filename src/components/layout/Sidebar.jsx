import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Folder, 
  BarChart3, 
  User,
  Code2,
  Users,
  Bell,
  MessageCircle,
  BookOpen,
  TrendingUp,
  Sparkles,
  Home,
  Hash,
  Bookmark,
  List,
  MoreHorizontal,
  LogOut
} from 'lucide-react'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) return null

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', href: '/explore', icon: Hash },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Lists', href: '/lists', icon: List },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Projects', href: '/projects', icon: Folder },
    { name: 'Skills', href: '/skills', icon: Code2 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="hidden lg:flex flex-col w-64 bg-zinc-950 h-screen sticky top-0 border-r border-zinc-800 overflow-hidden">
      {/* Logo Section */}
      <div className="p-4 flex-shrink-0">
        <Link to="/" className="flex items-center space-x-3 p-3 rounded-full hover:bg-zinc-900 transition-all duration-200 w-fit">
          <div className="w-8 h-8 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">SS</span>
          </div>
          <span className="text-xl font-bold text-white">SkillSync</span>
        </Link>
      </div>

      {/* Main Navigation - Fixed height with no scroll */}
      <nav className="flex-1 px-3 overflow-hidden">
        <div className="space-y-1 h-full flex flex-col">
          <div className="flex-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-full transition-all duration-200 group ${
                    isActive 
                      ? 'bg-zinc-900 text-white' 
                      : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon size={24} className="flex-shrink-0" />
                  <span className="text-xl font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

        </div>
      </nav>

      {/* User Profile & Logout Section - Fixed at bottom */}
      <div className="p-4 flex-shrink-0 space-y-2">
        {/* User Profile */}
        <div className="flex items-center justify-between p-3 rounded-full hover:bg-zinc-900 transition-all duration-200 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-full flex items-center justify-center">
              {user.profile?.avatar ? (
                <img 
                  src={user.profile.avatar} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="text-white" size={18} />
              )}
            </div>
            <div className="flex flex-col">
            </div>
          </div>
          <MoreHorizontal size={20} className="text-zinc-400" />
         <button
          onClick={handleLogout}
          className="flex items-center space-x-1 w-full px-4 py-3 rounded-full text-zinc-200"
        >
          <LogOut size={14} className="" />
          <span className="text-lg font-medium">Logout</span>
        </button>
        </div>

      </div>
    </div>
  )
}

export default Sidebar  