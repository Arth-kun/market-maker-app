import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

interface Maker {
  id: string
  name: string
  description: string | null
  website: string | null
  social_media: string | null
}

interface MarketDetails {
  id: string
  edition_name: string
  market_name: string
  description: string | null
  start_date: string
  end_date: string
  makers: Maker[]
}

interface Props {
  marketId: string | null
  onClose: () => void
}

interface MarketEditionResponse {
  id: string
  name: string
  start_date: string
  end_date: string
  market: {
    name: string
    description: string | null
  } | null
  market_edition_makers: {
    maker: {
      id: string
      name: string
      description: string | null
      website: string | null
      social_media: string | null
    } | null
  }[]
}

export function MarketDetailModal({ marketId, onClose }: Props) {
  const { data: market, isLoading } = useQuery<MarketDetails>({
    queryKey: ['market-details', marketId],
    queryFn: async () => {
      if (!marketId) throw new Error('No market ID provided')
      
      const { data, error } = await supabase
        .from('market_editions')
        .select(`
          id,
          name,
          start_date,
          end_date,
          market:markets!market_id (
            name,
            description
          ),
          market_edition_makers!market_edition_id (
            maker:makers (
              id,
              name,
              description,
              website,
              social_media
            )
          )
        `)
        .eq('id', marketId)
        .single<MarketEditionResponse>()

      if (error) throw error

      return {
        id: data.id,
        edition_name: data.name,
        market_name: data.market?.name || 'Unknown Market',
        description: data.market?.description || null,
        start_date: data.start_date,
        end_date: data.end_date,
        makers: data.market_edition_makers.map((mem: any) => ({
          id: mem.maker?.id,
          name: mem.maker?.name,
          description: mem.maker?.description,
          website: mem.maker?.website,
          social_media: mem.maker?.social_media
        }))
      }
    },
    enabled: !!marketId
  })

  return (
    <Dialog
      open={!!marketId}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-lg">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {isLoading ? (
              <div className="h-96 flex items-center justify-center text-gray-900">
                <p>Loading...</p>
              </div>
            ) : market ? (
              <div className="p-6 max-h-[85vh] overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{market.market_name}</h2>
                  <p className="text-lg text-gray-600">{market.edition_name}</p>
                  {market.description && (
                    <p className="mt-2 text-gray-600">{market.description}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    <p>From: {format(new Date(market.start_date), 'PPP')}</p>
                    <p>To: {format(new Date(market.end_date), 'PPP')}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Makers</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {market.makers.length > 0 ? (
                      market.makers.map((maker) => (
                        <div key={maker.id} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900">{maker.name}</h4>
                          {maker.description && (
                            <p className="mt-1 text-sm text-gray-600">{maker.description}</p>
                          )}
                          <div className="mt-2 space-y-1">
                            {maker.website && (
                              <a
                                href={maker.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 block"
                              >
                                Website
                              </a>
                            )}
                            {maker.social_media && (
                              <a
                                href={`https://instagram.com/${maker.social_media.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 block"
                              >
                                {maker.social_media}
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 col-span-full">No makers registered for this market yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-900">
                <p>Market not found</p>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 