import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Calendar, Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const navItems = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/bookings', label: 'Bookings', icon: Calendar },
  { href: '/logo', label: 'Home', icon: null }, // Placeholder for logo
  { href: '/notifications', label: 'Alerts', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
]

export const BottomNav: React.FC = () => {
  const location = useLocation()

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-border md:hidden z-40"
    >
      <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
        {navItems.map((item) => {
          if (item.href === '/logo') {
            return (
              <Link to="/search" key={item.href} className="flex flex-col items-center justify-center w-1/5 h-full relative -mt-10">
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-glow-primary border-4 border-background"
                >
                  <span className="text-primary-foreground font-bold text-2xl">LTP</span>
                </motion.div>
              </Link>
            )
          }

          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link to={item.href} key={item.href} className="flex flex-col items-center justify-center w-1/5 h-full relative">
              <div className="relative">
                <item.icon
                  className={cn('w-7 h-7 transition-all duration-300', isActive ? 'text-primary' : 'text-muted-foreground/70')}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active-dot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-primary rounded-full"
                  />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
