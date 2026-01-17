import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, User, Search, Bell, MessageCircle, Home, LayoutDashboard, Folder, BarChart3 } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  // Authentication context to get user data and logout function
  const { user, logout } = useAuth()
  const location = useLocation()
  
  // State to manage mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mobile navigation items
  const mobileNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: Folder, label: 'Projects' },
    { path: '/', icon: Home, label: 'Home' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <>
      {/* Main header with dark background and subtle border */}
      <header className="bg-[#151517] shadow-sm border-b border-gray-100 hidden md:block">
        {/* Container with max width and horizontal padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Flex container for header content with fixed height */}
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section - Left side of header */}
            <div className="flex items-center space-x-4">
              {/* Logo link to home page */}
              <Link to="/" className="flex items-center space-x-3">
                {/* Logo icon with gradient background */}
                <div className="w-10 h-10 bg-gradient-to-r from-navy-800 to-brown-800 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">SS</span>
                </div>
                {/* Company name text */}
                <span className="text-xl font-semibold text-navy-800 tracking-tight">SkillSync</span>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile, visible on medium+ screens */}
            <nav className="hidden md:flex items-center space-x-1 flex-1">
              {/* Conditional rendering based on user authentication status */}
              {user ? (
                // Authenticated user navigation
                <>
                  {/* Search Bar - GitHub inspired search functionality */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative max-w-md w-full">
                      {/* Search icon positioned absolutely inside input */}
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      {/* Search input field */}
                      <input
                        type="text"
                        placeholder="Search skills or people..."
                        className="pl-10 pr-4 py-3 w-full border border-blue-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-none focus:border-transparent text-sm bg-[#151517]"
                      />
                    </div>
                  </div>

                  {/* User Actions - Notification and messaging icons */}
                  <div className="flex items-center space-x-2">
                    {/* Messages button */}
                    <button className="p-2 text-gray-500 hover:text-navy-800 hover:bg-gray-50 rounded-lg transition-all duration-200">
                      <MessageCircle size={20} />
                    </button>
                    {/* Notifications button */}
                    <button className="p-2 text-gray-500 hover:text-navy-800 hover:bg-gray-50 rounded-lg transition-all duration-200">
                      <Bell size={20} />
                    </button>
                    
                    {/* User Profile Section - GitHub inspired user dropdown area */}
                    <div className="flex items-center space-x-3 ml-2 pl-3 ">
                      {/* User avatar and basic info */}
                      <div className="flex items-center space-x-3">
                        {/* User avatar with gradient background */}
                        <Link to="/profile" className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-navy-800 to-brown-800 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer">
                          {/* Display first letter of user's name or user icon */}
                          {user.profile?.name?.charAt(0) || <User size={16} />}
                        </div></Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Unauthenticated user navigation (Login/Register buttons)
                <div className="flex items-center space-x-4">
                  {/* Login link */}
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-navy-800 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  {/* Registration link with prominent styling */}
                  <Link 
                    to="/register" 
                    className="bg-navy-800 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    Join now
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button - Only visible on small screens */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {/* Toggle between menu and close icons */}
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation Menu - Slides down when mobile menu is open */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-gray-50 rounded-lg mt-2">
              {user ? (
                // Mobile menu for authenticated users
                <div className="space-y-3">
                  {/* User profile section in mobile menu */}
                  <div className="px-4 py-2">
                    <div className="flex items-center space-x-3 mb-4">
                      {/* User avatar */}
                      <div className="w-10 h-10 bg-gradient-to-r from-navy-800 to-brown-800 rounded-full flex items-center justify-center text-white font-medium">
                        {user.profile?.name?.charAt(0) || <User size={18} />}
                      </div>
                      {/* User info */}
                      <div>
                        <div className="font-medium text-gray-900">{user.profile?.name}</div>
                        <div className="text-sm text-gray-500">View profile</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile navigation links */}
                  <div className="space-y-1">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-3 text-gray-700 hover:text-navy-800 hover:bg-white rounded-lg transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/network" 
                      className="block px-4 py-3 text-gray-700 hover:text-navy-800 hover:bg-white rounded-lg transition-colors font-medium"
                    >
                      Network
                    </Link>
                    <Link 
                      to="/skills" 
                      className="block px-4 py-3 text-gray-700 hover:text-navy-800 hover:bg-white rounded-lg transition-colors font-medium"
                    >
                      Skills
                    </Link>
                  </div>
                  
                  {/* Logout button in mobile menu */}
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:text-navy-800 hover:bg-white rounded-lg transition-colors font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                // Mobile menu for unauthenticated users
                <div className="space-y-3">
                  {/* Login link */}
                  <Link 
                    to="/login" 
                    className="block px-4 py-3 text-gray-700 hover:text-navy-800 hover:bg-white rounded-lg transition-colors font-medium"
                  >
                    Sign in
                  </Link>
                  {/* Registration link */}
                  <Link 
                    to="/register" 
                    className="block px-4 py-3 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors font-medium text-center shadow-sm"
                  >
                    Join SkillSync
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation - Only visible on small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151517] border-t border-gray-700 z-50">
        <div className="flex justify-around items-center py-3">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-navy-800 bg-gray-200' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Top Bar - Only visible on small screens with app name centered */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#151517] border-b border-gray-700 z-40 py-3">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-navy-800 to-brown-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SS</span>
            </div>
            <span className="text-lg font-semibold text-navy-800">SkillSync</span>
          </div>
        </div>
      </div>

      {/* Padding for mobile bottom navigation */}
      <div className="md:hidden pb-16"></div>
    </>
  )
}

export default Header