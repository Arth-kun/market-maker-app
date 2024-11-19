// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export interface Market {
  id: string
  name: string
  description: string | null
}

export interface Maker {
  id: string
  name: string
  description: string | null
  website: string | null
  social_media: string | null
}

export interface MarketEdition {
  id: string
  name: string
  start_date: string
  end_date: string
  is_active: boolean
  market: Market
  markets?: Market
  market_edition_makers?: {
    maker: Maker
  }[]
}

// Add Database response types
export interface MarketEditionResponse {
  id: string
  name: string
  start_date: string
  end_date: string
  is_active: boolean
  place_id: string
  market: {
    name: string
    description: string | null
  } | null
}

// Helper function to extract coordinates from location string
export function parseLocation(location: string): [number, number] | null {
  try {
    // Assuming location is stored as "latitude,longitude"
    const [lat, lng] = location.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng]
    }
    return null
  } catch {
    return null
  }
}