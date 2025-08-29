import React, { useState, useEffect, useMemo } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, Filter, X, Compass, Award, Tag, LocateFixed, LoaderCircle } from 'lucide-react'
import { getTurfs, getAllAmenities } from '../services/turfService'
import { SearchFilters } from '../types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { AmenityIcon } from '../components/ui/AmenityIcon'
import { useAuth } from '../hooks/useAuth'
import { useGeolocation } from '../hooks/useGeolocation'
import { TurfCard } from '../components/cards/TurfCard'
import { TurfCarousel } from '../components/ui/TurfCarousel'
import { StaggeredFadeIn } from '../components/ui/StaggeredFadeIn'

const PAGE_SIZE = 6;

export const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState<Omit<SearchFilters, 'pageParam'>>({})
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const { coordinates, isLoading: isGeoLoading, getLocation } = useGeolocation()
  const { ref, inView } = useInView({ threshold: 0.5 })

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading: isTurfsLoading,
  } = useInfiniteQuery({
    queryKey: ['turfs', filters],
    queryFn: ({ pageParam }) => getTurfs({ ...filters, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  })

  const allTurfs = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data])

  const { data: popularTurfs = [], isLoading: popularTurfsLoading } = useQuery({
    queryKey: ['turfs-popular'],
    queryFn: () => getTurfs({ sortBy: 'rating' }).then(res => res.data),
    staleTime: 1000 * 60 * 15
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage, isFetching])

  useEffect(() => {
    if (coordinates) {
      setFilters(prev => ({
        ...prev,
        sortBy: 'nearest',
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        location: undefined
      }))
      setSearchQuery('')
    }
  }, [coordinates])

  const amenities = getAllAmenities()

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleQuickFilter = (sortBy: 'nearest' | 'rating' | 'cheapest') => {
    if (sortBy === 'nearest') {
      getLocation()
    } else {
      setFilters({ sortBy })
    }
    setSearchQuery('')
  }

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = filters.amenities || []
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity]
    handleFilterChange('amenities', newAmenities)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const applySearch = () => {
    handleFilterChange('location', searchQuery.trim() || undefined)
  }
  
  const applyModalFilters = () => {
    applySearch();
    setIsFilterModalOpen(false);
  }

  const isSearching = useMemo(() => {
    return Object.values(filters).some(v => v !== undefined && (Array.isArray(v) ? v.length > 0 : true))
  }, [filters])

  if (error) return <div>Error loading turfs.</div>

  return (
    <>
      <header className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 md:pt-16 md:pb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {user ? `Welcome, ${user.name.split(' ')[0]}!` : 'Welcome!'}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg md:text-xl">Find & Book Your Perfect Turf</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 md:mt-8"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search by location or turf name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={20} />}
                  className="!pl-12 !pr-28 sm:!pr-32 !py-3.5 w-full !rounded-full !border-border focus:!ring-primary placeholder:text-muted-foreground"
                  onKeyPress={(e) => e.key === 'Enter' && applySearch()}
                />
                <Button 
                  onClick={applySearch} 
                  variant="primary"
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 !rounded-full !px-4 !py-2 text-sm"
                >
                  <span className="hidden sm:inline">Search</span>
                  <Search className="w-4 h-4 sm:hidden" />
                </Button>
              </div>
              <Button onClick={getLocation} className="!rounded-full !p-4" variant="outline" aria-label="Use my location" isLoading={isGeoLoading}>
                <LocateFixed className="w-5 h-5 text-secondary" />
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-12">
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => handleQuickFilter('nearest')} className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm hover:shadow-md transition-shadow border border-border text-sm font-medium text-muted-foreground hover:text-foreground">
                <Compass className="w-4 h-4 text-secondary" />
                <span>Nearest</span>
              </button>
              <button onClick={() => handleQuickFilter('rating')} className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm hover:shadow-md transition-shadow border border-border text-sm font-medium text-muted-foreground hover:text-foreground">
                <Award className="w-4 h-4 text-accent" />
                <span>Top Rated</span>
              </button>
              <button onClick={() => handleQuickFilter('cheapest')} className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm hover:shadow-md transition-shadow border border-border text-sm font-medium text-muted-foreground hover:text-foreground">
                <Tag className="w-4 h-4 text-primary" />
                <span>Best Value</span>
              </button>
              <button onClick={() => setIsFilterModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-card text-foreground rounded-full shadow-sm hover:shadow-md transition-shadow border border-border text-sm font-medium">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span>All Filters</span>
              </button>
            </div>
          </section>

          {!isSearching && (
            <section>
              {popularTurfsLoading ? (
                 <div className="h-96 bg-muted rounded-lg animate-pulse" />
              ) : (
                <TurfCarousel title="Popular Near You" turfs={popularTurfs.slice(0, 8)} />
              )}
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">
                {isSearching ? 'Search Results' : 'All Turfs'}
              </h2>
              {isSearching && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/80"
                >
                  <X size={14} /> Clear Search
                </Button>
              )}
            </div>
            
            {isTurfsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse h-96 bg-muted rounded-lg" />)}
              </div>
            ) : allTurfs.length > 0 ? (
              <>
                <StaggeredFadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allTurfs.map((turf) => <TurfCard key={turf.id} turf={turf} />)}
                </StaggeredFadeIn>
                <div ref={ref} className="h-10" />
                {isFetchingNextPage && (
                  <div className="flex justify-center items-center py-6">
                    <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
                {!hasNextPage && allTurfs.length > PAGE_SIZE && (
                  <div className="text-center py-6 text-muted-foreground">
                    You've reached the end of the list.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-card rounded-lg shadow-sm border border-border">
                <Search className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">No turfs found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or clearing filters.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filter Turfs" className="max-w-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Sort by</label>
            <select
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Default</option>
              <option value="nearest">Nearest</option>
              <option value="cheapest">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Min price" type="number" value={filters.minPrice || ''} onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)} />
              <Input placeholder="Max price" type="number" value={filters.maxPrice || ''} onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Minimum Rating</label>
            <select
              value={filters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-2 rounded-md border text-sm transition-colors flex items-center gap-2 ${
                    filters.amenities?.includes(amenity)
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border hover:border-border/70'
                  }`}
                >
                  <AmenityIcon amenity={amenity} className="w-4 h-4" />
                  {amenity}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={clearFilters} variant="outline" className="flex-1">Clear</Button>
            <Button onClick={applyModalFilters} variant="primary" className="flex-1">Apply Filters</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
