// src/hooks/useMarkets.ts
import { useQuery } from '@tanstack/react-query'
import { supabase, parseLocation } from '../lib/supabase'
//import { supabase, Market, MarketEdition, parseLocation } from '../lib/supabase'

export function useActiveMarketEditions() {
  return useQuery({
    queryKey: ['marketEditions', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_editions')
        .select(`
          *,
          market:markets(name, description)
        `)
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true })

      if (error) throw error

      return data.map(edition => ({
        ...edition,
        coordinates: parseLocation(edition.location)
      })).filter(edition => edition.coordinates !== null)
    }
  })
}

export function useMarketEdition(id: string) {
  return useQuery({
    queryKey: ['marketEdition', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_editions')
        .select(`
          *,
          market:markets(name, description)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    }
  })
}