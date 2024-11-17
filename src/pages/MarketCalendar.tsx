import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { MarketDetailModal } from '../components/MarketDetailModal'
import './MarketCalendar.css'

interface CalendarMarket {
  id: string
  title: string
  start: string
  end: string
  extendedProps: {
    edition_name: string
    market_name: string
    description: string | null
  }
}

export function MarketCalendar() {
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null)

  const { data: events, isLoading } = useQuery<CalendarMarket[]>({
    queryKey: ['calendar-markets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_editions')
        .select(`
          id,
          name,
          start_date,
          end_date,
          market:market_id (
            name,
            description
          )
        `)
        .eq('is_active', true)

      if (error) throw error

      return data.map(edition => ({
        id: edition.id.toString(),
        title: `${edition.market[0]?.name || 'Unknown Market'} - ${edition.name}`,
        start: edition.start_date,
        end: edition.end_date,
        extendedProps: {
          edition_name: edition.name,
          market_name: edition.market[0]?.name || 'Unknown Market',
          description: edition.market[0]?.description || null
        }
      }))
    }
  })

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="p-6 h-full bg-white">
      <MarketDetailModal
        marketId={selectedMarketId}
        onClose={() => setSelectedMarketId(null)}
      />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          setSelectedMarketId(parseInt(info.event.id))
        }}
        height="100%"
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
            <div className="text-xs text-gray-600 truncate">
              {eventInfo.event.extendedProps.edition_name}
            </div>
          </div>
        )}
        eventClassNames="cursor-pointer hover:bg-blue-50"
      />
    </div>
  )
} 