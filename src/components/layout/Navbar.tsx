import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, User, LogOut } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getUnreadCount } from '../../services/notificationService'
import { useAuth } from '../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

export const Navbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    enabled: !!user,
    refetchInterval: 30000,
  })

  const navigation = [
    { name: 'Search', href: '/search' },
    { name: 'My Bookings', href: '/bookings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsProfileOpen(false)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-bold text-primary-foreground text-xl shadow-glow-primary"
              >
                LTP
              </motion.div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Lets Turf Play</span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative px-4 py-2 text-base font-medium transition-colors text-foreground/70 hover:text-foreground rounded-lg"
                  >
                    {item.name}
                    {isActive &&
                      <motion.span 
                        layoutId="nav-underline"
                        className="absolute bottom-1 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    }
                  </Link>
                )
              })}

              <div className="w-px h-6 bg-border mx-4" />

              <Link
                to="/notifications"
                className="relative p-3 text-foreground/70 hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <Bell className="w-6 h-6" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-1 right-1 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-full transition-colors",
                    isProfileOpen ? "bg-muted" : "hover:bg-muted"
                  )}
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center border-2 border-border">
                      <User className="w-5 h-5 text-foreground/60" />
                    </div>
                  )}
                  <span className="text-base font-medium hidden lg:block">{user.name}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-card rounded-xl shadow-lifted border border-border z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email || user.phone}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
