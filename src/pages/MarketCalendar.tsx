import { useQuery } from '@tanstack/react-query'
import { MarketEditionResponse, supabase } from '../lib/supabase'
import { useState } from 'react'
import { MarketDetailModal } from '../components/MarketDetailModal'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Card, CardContent } from "@/components/ui/card"

interface MarketEvent {
  id: string
  name: string
  market_name: string
  description: string | null
  start_date: string
  end_date: string
}

export function MarketCalendar() {
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null)

  const { data: markets } = useQuery<MarketEvent[]>({
    queryKey: ['markets-calendar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_editions')
        .select(`
          id,
          name,
          start_date,
          end_date,
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
        name: edition.name,
        market_name: edition.market?.name || 'Unknown Market',
        description: edition.market?.description || null,
        start_date: edition.start_date,
        end_date: edition.end_date
      }))
    }
  })

  const events = markets?.map(market => ({
    id: market.id,
    title: market.name,
    start: market.start_date,
    end: market.end_date,
    extendedProps: {
      market_name: market.market_name,
      edition_name: market.name,
      description: market.description
    }
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <MarketDetailModal
        marketId={selectedMarketId}
        onClose={() => setSelectedMarketId(null)}
      />
      
      <Card>
        <CardContent className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={(info) => {
              setSelectedMarketId(info.event.id)
            }}
            height="calc(100vh - 10rem)"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week'
            }}
            eventContent={(eventInfo) => (
              <div className="p-1 text-sm overflow-hidden">
                <div className="font-medium truncate">
                  {eventInfo.event.extendedProps.market_name}
                </div>
                <div className="text-xs truncate">
                  {eventInfo.event.extendedProps.edition_name}
                </div>
              </div>
            )}
            eventClassNames="cursor-pointer hover:bg-primary"
          />
        </CardContent>
      </Card>
    </div>
  )
} 