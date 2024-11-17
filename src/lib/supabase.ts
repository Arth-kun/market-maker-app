// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export interface Market {
  id: number
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MarketEdition {
  id: number
  market_id: number
  name: string
  start_date: string
  end_date: string
  location: string
  is_active: boolean
  created_at: string
  updated_at: string
  // We'll add these as custom fields from our query
  latitude?: number
  longitude?: number
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