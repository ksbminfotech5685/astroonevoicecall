export type Expert = {
  id: string
  name: string
  category: string
  categoryTitle: string
  languages: string[]
  experience: number
  rating: number
  totalReviews: number
  pricePerMinChat: number
  pricePerMinCall: number
  online: boolean
  photoUrl: string
  bio: string
}

import { getCategoryTitle } from "@/lib/categories"

const sampleExperts: Expert[] = [
  {
    id: "ex1",
    name: "Sumit Agarwal",
    category: "astrology",
    categoryTitle: "Astrology",
    languages: ["Hindi", "English"],
    experience: 15,
    rating: 4.7,
    totalReviews: 1200,
    pricePerMinChat: 20,
    pricePerMinCall: 30,
    online: true,
    photoUrl: "/expert-portrait.jpg",
    bio: "Expert in Vedic astrology and birth chart analysis. Guidance on career, relationships, and health.",
  },
  {
    id: "ex2",
    name: "Neha Gupta",
    category: "tarot",
    categoryTitle: "Tarot",
    languages: ["Hindi"],
    experience: 5,
    rating: 4.6,
    totalReviews: 800,
    pricePerMinChat: 18,
    pricePerMinCall: 25,
    online: false,
    photoUrl: "/expert-portrait.jpg",
    bio: "5+ years of tarot reading. Provides clarity and direction for key life decisions.",
  },
  {
    id: "ex3",
    name: "Rohit Verma",
    category: "vastu",
    categoryTitle: "Vastu",
    languages: ["Hindi", "English"],
    experience: 10,
    rating: 4.8,
    totalReviews: 950,
    pricePerMinChat: 22,
    pricePerMinCall: 32,
    online: true,
    photoUrl: "/expert-portrait.jpg",
    bio: "Vastu consultation for homes and offices. Puja room, entrances, and energy balancing.",
  },
  // You can add more experts here
]

function generateExpertsForCategory(category: string) {
  const title = getCategoryTitle(category)
  const namePool = [
    "Aarav Kapoor",
    "Diya Mehta",
    "Kabir Sharma",
    "Ishita Rao",
    "Vivaan Khanna",
    "Anaya Bansal",
    "Reyansh Malhotra",
    "Sara Narang",
    "Vihaan Desai",
    "Nisha Sethi",
    "Arjun Patel",
    "Riya Thakur",
    "Kunal Verma",
    "Mira Joshi",
    "Devansh Shah",
    "Aisha Ali",
    "Rohan Nair",
    "Neha Kulkarni",
    "Aditya Singh",
    "Sneha Ghosh",
    "Manav Tiwari",
    "Prisha Kaur",
    "Harsh Vardhan",
    "Jiya Arora",
    "Yuvraj Soni",
    "Kriti Jain",
    "Tanishq Dutta",
    "Aanya Bedi",
    "Parth Trivedi",
    "Mahika Kapoor",
  ]
  const langs = [
    ["Hindi", "English"],
    ["Hindi"],
    ["English"],
    ["Hindi", "Marathi"],
    ["Hindi", "English", "Punjabi"],
    ["Hindi", "Gujarati"],
  ]
  return Array.from({ length: 10 }).map((_, i) => {
    const name = namePool[i % namePool.length]
    const exp = 3 + ((i * 2) % 13) // 3..15
    const rating = 4.2 + (i % 8) * 0.1 // 4.2..4.9
    const reviews = 200 + i * 37
    const chat = 15 + (i % 6) * 3
    const call = chat + 8
    const online = i % 2 === 0
    return {
      id: `gen-${category}-${i + 1}`,
      name,
      category,
      categoryTitle: title,
      languages: langs[i % langs.length],
      experience: exp,
      rating: Number(rating.toFixed(1)),
      totalReviews: reviews,
      pricePerMinChat: chat,
      pricePerMinCall: call,
      online,
      // unique placeholder URLs for each expert
      photoUrl: `/placeholder.svg?height=96&width=96&query=${category}-consultant-${i + 1}`,
      bio: `${title} advisor helping with ${category} related queries. Experienced, empathetic, and practical guidance.`,
    } as Expert
  })
}

export function getExpertsByCategory(category: string) {
  const preset = sampleExperts.filter((e) => e.category === category)
  if (preset.length >= 10) return preset.slice(0, 10)
  const needed = 10 - preset.length
  const generated = generateExpertsForCategory(category).slice(0, needed)
  return [...preset, ...generated]
}

export function getExpertById(id: string) {
  return sampleExperts.find((e) => e.id === id)
}

export default sampleExperts
