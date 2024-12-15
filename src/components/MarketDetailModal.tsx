import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

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

interface MarketDay {
  id: string
  date: string
  start_time: string
  end_time: string
  is_active: boolean
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
  market_days: MarketDay[]
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
        ),
        market_days!market_edition_id (
          id,
          date,
          start_time,
          end_time,
          is_active
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
    <Dialog open={!!marketId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">{market?.market_name}</DialogTitle>
          <DialogDescription className="text-lg font-medium text-foreground">
            {market?.edition_name}
          </DialogDescription>
          {market?.description && (
            <DialogDescription className="mt-2">
              {market.description}
            </DialogDescription>
          )}
          <div className="flex gap-2 mt-4">
            {/* Il faut ajout un system de tabs, et qu'au lieu d'avoir from to on mette chaque jour du marché sous forme de tab
            Dans le titre de chaque tab on met heure de début heure de fin (ou dans le détail à voir) puis on affiche les artisans pour chaque jour
             */}
            <Badge variant="outline">
              From: {market && format(new Date(market.start_date), 'PPP')}
            </Badge>
            <Badge variant="outline">
              To: {market && format(new Date(market.end_date), 'PPP')}
            </Badge>
          </div>
        </DialogHeader>
        
        <Separator />
        
        <ScrollArea className="p-6 max-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <p>Loading...</p>
            </div>
          ) : market?.makers && market.makers.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Makers</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {market.makers.map((maker) => (
                  <Card key={maker.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{maker.name}</CardTitle>
                      {maker.description && (
                        <CardDescription className="text-sm">
                          {maker.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    {(maker.website || maker.social_media) && (
                      <CardContent className="pt-2">
                        <div className="flex gap-2">
                          {maker.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8"
                            >
                              <a
                                href={maker.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Website
                              </a>
                            </Button>
                          )}
                          {maker.social_media && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8"
                            >
                              <a
                                href={`https://instagram.com/${maker.social_media.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Instagram
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No makers registered for this market yet.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 