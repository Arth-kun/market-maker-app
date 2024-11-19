import { useQuery } from '@tanstack/react-query'
import { MarketEditionResponse, supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { useState } from 'react'
import { MarketDetailModal } from '../components/MarketDetailModal'

interface MarketListItem {
  id: string
  edition_name: string
  market_name: string
  description: string | null
  start_date: string
  end_date: string
  is_active: boolean
}

export function MarketList() {
    const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null)
    const { data: markets, isLoading } = useQuery<MarketListItem[]>({
      queryKey: ['markets-list'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('market_editions')
          .select(`
            id,
            name,
            start_date,
            end_date,
            is_active,
            market:markets (
              name,
              description
            )
          `)
          .eq('is_active', true)
          .returns<MarketEditionResponse[]>()

        if (error) throw error

        return data.map(edition => ({
          id: edition.id,
          edition_name: edition.name,
          market_name: edition.market?.name || 'Unknown Market',
          description: edition.market?.description || null,
          start_date: edition.start_date,
          end_date: edition.end_date,
          is_active: edition.is_active
        }))
      }
    })
  
    if (isLoading) {
      return <div>Loading...</div>
    }

    const today = new Date()
    const upcomingMarkets = markets?.filter(market => new Date(market.start_date) >= today) || []
    const pastMarkets = markets?.filter(market => new Date(market.start_date) < today) || []
  
    return (
      <div className="p-6 space-y-8 bg-gray-50">
        <MarketDetailModal
          marketId={selectedMarketId}
          onClose={() => setSelectedMarketId(null)}
        />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Upcoming Markets</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMarkets.length > 0 ? (
              upcomingMarkets.map((market) => (
                <MarketCard 
                  key={market.id} 
                  market={market} 
                  onSelect={setSelectedMarketId}
                />
              ))
            ) : (
              <p className="text-gray-500">No upcoming markets scheduled.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Past Markets</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastMarkets.length > 0 ? (
              pastMarkets.map((market) => (
                <MarketCard 
                  key={market.id} 
                  market={market} 
                  onSelect={setSelectedMarketId}
                />
              ))
            ) : (
              <p className="text-gray-500">No past markets found.</p>
            )}
          </div>
        </div>
      </div>
    )
}

// Separate component for the market card to reduce duplication
function MarketCard({ 
  market, 
  onSelect 
}: { 
  market: MarketListItem
  onSelect: (id: string) => void 
}) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(market.id)}
    >
      <h3 className="text-lg text-gray-900 font-semibold">{market.market_name}</h3>
      <p className="text-sm text-gray-500 mt-1">{market.edition_name}</p>
      {market.description && (
        <p className="text-gray-600 mt-2">{market.description}</p>
      )}
      <div className="mt-4 text-sm text-gray-500">
        <p>From: {format(new Date(market.start_date), 'PPP')}</p>
        <p>To: {format(new Date(market.end_date), 'PPP')}</p>
      </div>
    </div>
  )
}