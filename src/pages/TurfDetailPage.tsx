import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Clock, Users, ArrowLeft, Calendar, IndianRupee, Image as ImageIcon, Video, ChevronLeft, ChevronRight, Hourglass, MessageSquarePlus } from 'lucide-react'
import { getTurfById, getTurfAvailability } from '../services/turfService'
import { getReviewsByTurfId } from '../services/reviewService'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { formatCurrency, formatDate, formatTime } from '../lib/utils'
import { AmenityIcon } from '../components/ui/AmenityIcon'
import { TimeSlot, Turf } from '../types'

const BookingWidget: React.FC<{ turf: Turf }> = ({ turf }) => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([])

  const { data: availability = [], isLoading: availabilityLoading } = useQuery({
    queryKey: ['turf-availability', turf.id, selectedDate],
    queryFn: () => getTurfAvailability(turf.id!, selectedDate),
    enabled: !!turf.id && !!selectedDate,
    staleTime: 5 * 60 * 1000,
  })

  const nextSevenDays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  }), [])

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;

    const isSelected = selectedSlots.some(s => s.id === slot.id);
    if (isSelected) {
      // If the clicked slot is already selected, deselect it and all subsequent slots
      const clickedIndex = selectedSlots.findIndex(s => s.id === slot.id);
      setSelectedSlots(selectedSlots.slice(0, clickedIndex));
      return;
    }

    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    const sortedSlots = [...selectedSlots, slot].sort((a, b) => a.startTime - b.startTime);
    let isConsecutive = true;
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      if (sortedSlots[i].endTime !== sortedSlots[i+1].startTime) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive) {
      setSelectedSlots(sortedSlots);
    } else {
      // If the new slot is not consecutive, start a new selection
      setSelectedSlots([slot]);
    }
  };

  const bookingSummary = useMemo(() => {
    if (selectedSlots.length === 0) {
      return null;
    }
    const sorted = selectedSlots.sort((a, b) => a.startTime - b.startTime);
    const startTime = sorted[0].startTime;
    const endTime = sorted[sorted.length - 1].endTime;
    const totalPrice = sorted.reduce((acc, slot) => acc + slot.price, 0);

    return {
      timeRange: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      totalSlots: sorted.length,
      totalPrice: totalPrice
    };
  }, [selectedSlots]);

  const handleProceedToBooking = () => {
    if (!bookingSummary) return;

    const consolidatedSlot: TimeSlot = {
      id: selectedSlots.map(s => s.id).join(','),
      date: selectedDate,
      startTime: selectedSlots[0].startTime,
      endTime: selectedSlots[selectedSlots.length - 1].endTime,
      price: bookingSummary.totalPrice,
      isAvailable: true
    };

    navigate('/booking', { state: { turf, timeSlot: consolidatedSlot } });
  };
  
  return (
    <Card className="sticky top-24 shadow-xl border-gray-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b">
        <h3 className="text-xl font-bold text-dark flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Book Your Slot
        </h3>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-800 mb-3">Select Date</p>
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
            {nextSevenDays.map(date => {
              const dateString = date.toISOString().split('T')[0]
              const isSelected = dateString === selectedDate
              return (
                <button
                  key={dateString}
                  onClick={() => { setSelectedDate(dateString); setSelectedSlots([]); }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-lg transition-all duration-200 border-2 ${
                    isSelected ? 'bg-primary text-white border-primary shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-sm'
                  }`}
                >
                  <span className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-xl font-bold">{date.getDate()}</span>
                  <span className="text-xs font-medium">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-800">Select Time</p>
            <p className="text-xs text-gray-500">Consecutive slots only</p>
          </div>
          {availabilityLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-md animate-pulse" />)}
            </div>
          ) : availability.filter(s => s.isAvailable).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2">
              {availability.map((slot) => {
                const isSelected = selectedSlots.some(s => s.id === slot.id);
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    disabled={!slot.isAvailable}
                    className={`p-2 rounded-md text-sm font-medium transition-all duration-200 border text-center ${
                      slot.isAvailable
                        ? isSelected
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-primary/10 hover:border-primary'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 line-through'
                    }`}
                  >
                    {formatTime(slot.startTime)}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">No available slots for this date</p>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {bookingSummary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-6 pt-4 border-t border-gray-200 overflow-hidden"
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-600"><Clock size={14} /> Selected Time</span>
                  <span className="font-semibold text-dark">{bookingSummary.timeRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-600"><Hourglass size={14} /> Duration</span>
                  <span className="font-semibold text-dark">{bookingSummary.totalSlots} hour{bookingSummary.totalSlots > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-2 pt-2 border-t">
                  <span className="flex items-center gap-2 text-gray-600 font-medium"><IndianRupee size={16} /> Total</span>
                  <span className="font-bold text-primary">{formatCurrency(bookingSummary.totalPrice)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          onClick={handleProceedToBooking}
          disabled={!bookingSummary}
          className="w-full mt-6"
          size="lg"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
}

export const TurfDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')

  const { data: turf, isLoading: turfLoading } = useQuery({
    queryKey: ['turf', id],
    queryFn: () => getTurfById(id!),
    enabled: !!id
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['turf-reviews', id],
    queryFn: () => getReviewsByTurfId(id!),
    enabled: !!id
  })

  const currentMedia = mediaType === 'image' ? turf?.images : turf?.videos || []
  const handleMediaChange = (direction: 'next' | 'prev') => {
    if (!currentMedia || currentMedia.length === 0) return;
    const newIndex = direction === 'next'
      ? (selectedMediaIndex + 1) % currentMedia.length
      : (selectedMediaIndex - 1 + currentMedia.length) % currentMedia.length;
    setSelectedMediaIndex(newIndex);
  };

  if (turfLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-24 bg-gray-200 rounded-full mb-8 animate-pulse"></div>
          <div className="aspect-video w-full bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
          <div className="flex gap-2 mb-12">
            <div className="w-20 h-16 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-20 h-16 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!turf) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Turf Not Found</h2>
        <Button onClick={() => navigate('/search')}>Back to Search</Button>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-dark"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-dark shadow-2xl group">
            <AnimatePresence initial={false}>
              <motion.div
                key={`${mediaType}-${selectedMediaIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {currentMedia && currentMedia.length > 0 && (
                  mediaType === 'image' ? (
                    <img src={currentMedia[selectedMediaIndex]} alt={turf.name} className="w-full h-full object-cover" />
                  ) : (
                    <video src={currentMedia[selectedMediaIndex]} controls autoPlay muted loop className="w-full h-full object-cover" />
                  )
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button onClick={() => handleMediaChange('prev')} variant="ghost" className="!rounded-full !p-3 bg-black/40 text-white hover:bg-black/60"><ChevronLeft size={28} /></Button>
              <Button onClick={() => handleMediaChange('next')} variant="ghost" className="!rounded-full !p-3 bg-black/40 text-white hover:bg-black/60"><ChevronRight size={28} /></Button>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 flex-grow">
              {currentMedia && currentMedia.map((mediaUrl, index) => (
                <button
                  key={`${mediaType}-${index}`}
                  onClick={() => setSelectedMediaIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    selectedMediaIndex === index ? 'border-primary scale-105' : 'border-transparent'
                  }`}
                >
                  {mediaType === 'image' ? (
                    <img src={mediaUrl} alt={`${turf.name} ${index + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center"><Video className="w-6 h-6 text-white" /></div>
                  )}
                  {selectedMediaIndex !== index && <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant={mediaType === 'image' ? 'primary' : 'outline'} onClick={() => { setMediaType('image'); setSelectedMediaIndex(0); }}><ImageIcon size={16} /></Button>
              {turf.videos && turf.videos.length > 0 && (
                <Button size="sm" variant={mediaType === 'video' ? 'primary' : 'outline'} onClick={() => { setMediaType('video'); setSelectedMediaIndex(0); }}><Video size={16} /></Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <Card className="shadow-lg border-gray-200">
              <CardContent className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-dark mb-3">{turf.name}</h1>
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2 text-secondary" />
                  <span>{turf.address}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 text-lg">
                  <div className="flex items-center font-semibold"><Star className="w-6 h-6 text-accent fill-accent mr-2" />{turf.rating.toFixed(1)} <span className="text-sm text-gray-500 ml-2">({turf.reviewCount} reviews)</span></div>
                  <div className="flex items-center text-primary font-bold"><IndianRupee className="w-6 h-6 mr-1" />{turf.price}/hour</div>
                </div>
                <p className="text-foreground/90 leading-relaxed">{turf.description}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-200">
              <CardHeader><h3 className="text-xl font-bold text-dark">Amenities</h3></CardHeader>
              <CardContent className="p-6 md:p-8 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {turf.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><AmenityIcon amenity={amenity} className="w-5 h-5 text-primary" /></div>
                      <span className="font-medium text-dark capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-200">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-dark">Reviews ({reviews.length})</h3>
                <Button variant="outline" size="sm">
                  <MessageSquarePlus size={16} className="mr-2"/>
                  Write a Review
                </Button>
              </CardHeader>
              <CardContent className="p-6 md:p-8 pt-0">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          {review.userImage ? (
                            <img src={review.userImage} alt={review.userName} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-gray-500" /></div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-dark">{review.userName}</span>
                              <span className="text-xs text-gray-500">{formatDate(new Date(review.date))}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-gray-300'}`} />)}
                            </div>
                            <p className="text-foreground/80 text-sm">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {reviews.length > 3 && <Button variant="outline" className="w-full mt-4">View all reviews</Button>}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to share your experience!</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <BookingWidget turf={turf} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
