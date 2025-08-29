import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import { AuthContext, useAuthState } from './hooks/useAuth'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AnimatedLoader } from './components/ui/AnimatedLoader'

// Pages
import { LoginPage } from './pages/LoginPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { SearchPage } from './pages/SearchPage'
import { TurfDetailPage } from './pages/TurfDetailPage'
import { BookingPage } from './pages/BookingPage'
import { BookingSuccessPage } from './pages/BookingSuccessPage'
import { BookingsPage } from './pages/BookingsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { PageShell } from './components/ui/PageShell'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<PageShell><LoginPage /></PageShell>} />
        <Route path="/onboarding" element={<PageShell><OnboardingPage /></PageShell>} />
        
        {/* Protected Routes */}
        <Route path="/search" element={<ProtectedRoute><PageShell><SearchPage /></PageShell></ProtectedRoute>} />
        <Route path="/turf/:id" element={<ProtectedRoute><PageShell><TurfDetailPage /></PageShell></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><PageShell><BookingPage /></PageShell></ProtectedRoute>} />
        <Route path="/booking-success" element={<ProtectedRoute><PageShell><BookingSuccessPage /></PageShell></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><PageShell><BookingsPage /></PageShell></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><PageShell><NotificationsPage /></PageShell></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageShell><ProfilePage /></PageShell></ProtectedRoute>} />
        
        {/* Default Redirects */}
        <Route path="/*" element={<ProtectedRoute><PageShell><SearchPage /></PageShell></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

const AppContent: React.FC = () => {
  const authState = useAuthState()

  return (
    <AuthContext.Provider value={authState}>
      {authState.isLoading ? (
        <AnimatedLoader />
      ) : (
        <Router>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            {authState.isAuthenticated && <Navbar />}
            
            <main className="flex-grow pt-16 md:pt-20">
              <AnimatedRoutes />
            </main>
            
            {authState.isAuthenticated && <BottomNav />}
          </div>
        </Router>
      )}
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation}>
        <AppContent />
      </LazyMotion>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
