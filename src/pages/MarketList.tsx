import { useQuery } from '@tanstack/react-query'
import { MarketEditionResponse, supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { useState } from 'react'
import { MarketDetailModal } from '../components/MarketDetailModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"

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
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )
    }

    const today = new Date()
    const upcomingMarkets = markets?.filter(market => new Date(market.start_date) >= today) || []
    const pastMarkets = markets?.filter(market => new Date(market.start_date) < today) || []
  
    return (
      <div className="container mx-auto py-8 px-4">
        <MarketDetailModal
          marketId={selectedMarketId}
          onClose={() => setSelectedMarketId(null)}
        />
        
        <Tabs defaultValue="upcoming" className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Markets</h1>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="space-y-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {upcomingMarkets.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingMarkets.map((market) => (
                    <MarketCard 
                      key={market.id} 
                      market={market} 
                      onSelect={setSelectedMarketId}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground">No upcoming markets scheduled.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {pastMarkets.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastMarkets.map((market) => (
                    <MarketCard 
                      key={market.id} 
                      market={market} 
                      onSelect={setSelectedMarketId}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground">No past markets found.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    )
}

function MarketCard({ 
  market, 
  onSelect 
}: { 
  market: MarketListItem
  onSelect: (id: string) => void 
}) {
  return (
    <Card 
      className="hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => onSelect(market.id)}
    >
      <CardHeader className="pb-3">
        <CardTitle>{market.market_name}</CardTitle>
        <CardDescription>{market.edition_name}</CardDescription>
      </CardHeader>
      {market.description && (
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">
            {market.description}
          </p>
        </CardContent>
      )}
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <div className="flex gap-2">
            <Badge variant="outline">
              {format(new Date(market.start_date), 'PPP')}
            </Badge>
            <span>→</span>
            <Badge variant="outline">
              {format(new Date(market.end_date), 'PPP')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}