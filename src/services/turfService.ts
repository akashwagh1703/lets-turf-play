import { Turf, SearchFilters, TimeSlot } from '../types'

// Haversine formula to calculate distance between two lat/lon points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371 // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

function generateTimeSlots(turfId: string, price: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = new Date()
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(today)
    date.setDate(today.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]
    
    for (let hour = 6; hour <= 21; hour++) {
      const isAvailable = Math.random() > 0.3
      slots.push({
        id: `${turfId}-${dateStr}-${hour}`,
        date: dateStr,
        startTime: hour,
        endTime: hour + 1,
        price: price,
        isAvailable
      })
    }
  }
  
  return slots
}

const mockTurfs: Turf[] = [
  {
    id: '1',
    name: 'Omkara Football Turf',
    location: 'Nashik Road',
    address: 'Siddhivinayak Society, Nashik Road, Nashik 422101',
    price: 1200,
    rating: 4.5,
    reviewCount: 128,
    amenities: ['Floodlights', 'Parking', 'Washroom', 'Drinking Water', 'First Aid'],
    images: [
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600'
    ],
    videos: [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ],
    tags: ['Popular'],
    description: 'Premium football turf with artificial grass and professional lighting. Perfect for matches and training sessions.',
    availability: generateTimeSlots('1', 1200),
    latitude: 19.9615,
    longitude: 73.7909
  },
  {
    id: '2',
    name: 'TDK Sports Complex',
    location: 'College Road',
    address: 'Near Engineering College, College Road, Nashik 422005',
    price: 1000,
    rating: 4.2,
    reviewCount: 89,
    amenities: ['Floodlights', 'Washroom', 'Seating Area', 'Equipment Rental'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600'
    ],
    tags: ['Best Value'],
    description: 'Well-maintained turf with modern facilities. Ideal for both casual games and competitive matches.',
    availability: generateTimeSlots('2', 1000),
    latitude: 19.9974,
    longitude: 73.7821
  },
  {
    id: '3',
    name: 'Goal Masters Arena',
    location: 'Panchavati',
    address: 'Panchavati Circle, Nashik 422003',
    price: 1500,
    rating: 4.7,
    reviewCount: 201,
    amenities: ['Floodlights', 'Parking', 'Washroom', 'Cafeteria', 'Changing Room', 'Equipment Rental'],
    images: [
      'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&h=600',
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600'
    ],
    videos: [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ],
    tags: ['Popular', 'New'],
    description: 'Premium sports facility with top-notch infrastructure. Features include professional-grade turf and complete amenities.',
    availability: generateTimeSlots('3', 1500),
    latitude: 20.0059,
    longitude: 73.7903
  },
  {
    id: '4',
    name: 'Champion Turf',
    location: 'Adgaon',
    address: 'MIDC Area, Adgaon, Nashik 422011',
    price: 800,
    rating: 4.0,
    reviewCount: 67,
    amenities: ['Floodlights', 'Parking', 'Washroom'],
    images: [
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600'
    ],
    tags: ['Best Value'],
    description: 'Affordable turf with basic amenities. Great for regular practice sessions and friendly matches.',
    availability: generateTimeSlots('4', 800),
    latitude: 20.0210,
    longitude: 73.8325
  },
  {
    id: '5',
    name: 'Urban Soccer 5',
    location: 'Indira Nagar',
    address: 'Wadala Pathardi Road, Indira Nagar, Nashik 422009',
    price: 1300,
    rating: 4.6,
    reviewCount: 150,
    amenities: ['Floodlights', 'Parking', 'Washroom', 'Wi-Fi', 'Seating Area'],
    images: ['https://images.unsplash.com/photo-1526232761621-c2d1844c126c?w=800&h=600'],
    tags: ['New'],
    description: 'State-of-the-art 5-a-side turf with high-quality artificial grass.',
    availability: generateTimeSlots('5', 1300),
    latitude: 19.956,
    longitude: 73.765
  },
  {
    id: '6',
    name: 'Greenfield Arena',
    location: 'Gangapur Road',
    address: 'Near Sula Vineyards, Gangapur, Nashik 422222',
    price: 1400,
    rating: 4.8,
    reviewCount: 180,
    amenities: ['Floodlights', 'Parking', 'Washroom', 'Cafeteria', 'Natural Grass'],
    images: ['https://images.unsplash.com/photo-1598426472982-f34dd5933431?w=800&h=600'],
    tags: ['Popular'],
    description: 'Lush natural grass pitch surrounded by scenic views. A premium playing experience.',
    availability: generateTimeSlots('6', 1400),
    latitude: 19.998,
    longitude: 73.715
  },
  {
    id: '7',
    name: 'Box Cricket Zone',
    location: 'Satpur',
    address: 'MIDC, Satpur Colony, Nashik 422007',
    price: 900,
    rating: 4.1,
    reviewCount: 75,
    amenities: ['Floodlights', 'Equipment Rental', 'Seating Area'],
    images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600'],
    description: 'Perfectly enclosed turf for intense box cricket matches.',
    availability: generateTimeSlots('7', 900),
    latitude: 19.98,
    longitude: 73.74
  },
  {
    id: '8',
    name: 'The Kick Off',
    location: 'Deolali Camp',
    address: 'Lam Road, Deolali Camp, Nashik 422401',
    price: 1100,
    rating: 4.3,
    reviewCount: 112,
    amenities: ['Floodlights', 'Parking', 'Washroom', 'Drinking Water'],
    images: ['https://images.unsplash.com/photo-1599330293288-e8ac52290f87?w=800&h=600'],
    description: 'A spacious and well-lit turf suitable for 7v7 matches.',
    availability: generateTimeSlots('8', 1100),
    latitude: 19.89,
    longitude: 73.83
  },
  {
    id: '9',
    name: 'Playmakers Hub',
    location: 'Pathardi Phata',
    address: 'Mumbai-Agra Highway, Pathardi Phata, Nashik 422010',
    price: 1250,
    rating: 4.4,
    reviewCount: 95,
    amenities: ['Floodlights', 'Parking', 'Changing Room', 'First Aid'],
    images: ['https://images.unsplash.com/photo-1628891883912-4c58b74b1243?w=800&h=600'],
    tags: ['Best Value'],
    description: 'Easily accessible turf right on the highway, perfect for a quick game.',
    availability: generateTimeSlots('9', 1250),
    latitude: 19.94,
    longitude: 73.77
  },
  {
    id: '10',
    name: 'Rooftop Reds',
    location: 'Canada Corner',
    address: 'Above Pinnacle Mall, Canada Corner, Nashik 422002',
    price: 1600,
    rating: 4.9,
    reviewCount: 250,
    amenities: ['Floodlights', 'Washroom', 'Cafeteria', 'Wi-Fi', 'Seating Area'],
    images: ['https://images.unsplash.com/photo-1542751371-6593c654997a?w=800&h=600'],
    tags: ['Popular'],
    description: 'Unique rooftop turf offering a stunning city view while you play.',
    availability: generateTimeSlots('10', 1600),
    latitude: 20.00,
    longitude: 73.78
  }
]

const PAGE_SIZE = 6;

export const getTurfs = async (filters?: SearchFilters): Promise<{ data: Turf[], nextPage?: number }> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  let filteredTurfs = [...mockTurfs]
  
  if (filters) {
    if (filters.location) {
      filteredTurfs = filteredTurfs.filter(turf => 
        turf.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
        turf.name.toLowerCase().includes(filters.location!.toLowerCase()) ||
        turf.address.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }
    
    if (filters.minPrice !== undefined) {
      filteredTurfs = filteredTurfs.filter(turf => turf.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filteredTurfs = filteredTurfs.filter(turf => turf.price <= filters.maxPrice!)
    }
    
    if (filters.rating !== undefined) {
      filteredTurfs = filteredTurfs.filter(turf => turf.rating >= filters.rating!)
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filteredTurfs = filteredTurfs.filter(turf =>
        filters.amenities!.every(amenity => turf.amenities.includes(amenity))
      )
    }
    
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'cheapest':
          filteredTurfs.sort((a, b) => a.price - b.price)
          break
        case 'rating':
          filteredTurfs.sort((a, b) => b.rating - a.rating)
          break
        case 'nearest':
          if (filters.latitude && filters.longitude) {
            filteredTurfs.sort((a, b) => {
              const distA = getDistance(filters.latitude!, filters.longitude!, a.latitude!, a.longitude!)
              const distB = getDistance(filters.latitude!, filters.longitude!, b.latitude!, b.longitude!)
              return distA - distB
            })
          }
          break
      }
    }
  }

  const page = filters?.pageParam || 0;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const paginatedData = filteredTurfs.slice(start, end);
  const nextPage = end < filteredTurfs.length ? page + 1 : undefined;
  
  return { data: paginatedData, nextPage };
}

export const getTurfById = async (id: string): Promise<Turf | null> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockTurfs.find(turf => turf.id === id) || null
}

export const getTurfAvailability = async (turfId: string, date: string): Promise<TimeSlot[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const turf = mockTurfs.find(t => t.id === turfId)
  if (!turf) return []
  return turf.availability.filter(slot => slot.date === date)
}

export const getAllAmenities = (): string[] => {
  const amenities = new Set<string>()
  mockTurfs.forEach(turf => {
    turf.amenities.forEach(amenity => amenities.add(amenity))
  })
  return Array.from(amenities).sort()
}
