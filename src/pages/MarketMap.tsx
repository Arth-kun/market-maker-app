// src/pages/MarketMap.tsx
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet'
import { useQuery } from '@tanstack/react-query'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { MarketEditionResponse, supabase } from '../lib/supabase'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MarketDetailModal } from '../components/MarketDetailModal'
import { addDays } from 'date-fns'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Add this near the top of your file, after imports
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.7.1/dist/images/";

// Create custom icon
const defaultIcon = L.icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

// Montreal downtown coordinates [latitude, longitude]
const DEFAULT_CENTER: [number, number] = [45.5017, -73.5673]

interface MapMarker {
    id: string
    name: string
    market_name: string
    description: string | null
    location: [number, number]
    start_date: string
    end_date: string
}

function MarketMarkers({ 
  markets,
  onSelectMarket 
}: { 
  markets: MapMarker[]
  onSelectMarket: (id: string) => void
}) {
    const map = useMap();

    return (
        <>
            {markets.map((market) => (
                <Marker
                    key={market.id}
                    position={market.location}
                    icon={defaultIcon}
                    eventHandlers={{
                        click: () => {
                            map.setView(market.location, map.getZoom(), {
                                animate: true,
                                duration: 0.5
                            });
                        },
                    }}
                >
                    <Popup autoPan={false}>
                        <Card className="min-w-[250px] border-none shadow-none">
                            <CardHeader className="p-3 pb-2">
                                <CardTitle className="text-base">{market.market_name}</CardTitle>
                                <CardDescription className="text-sm">
                                    {market.name}
                                </CardDescription>
                            </CardHeader>
                            {market.description && (
                                <CardContent className="p-3 pt-0 pb-2">
                                    <p className="text-sm text-muted-foreground">
                                        {market.description}
                                    </p>
                                </CardContent>
                            )}
                            <CardContent className="p-3 pt-0 pb-2 flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                    {new Date(market.start_date).toLocaleDateString()}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {new Date(market.end_date).toLocaleDateString()}
                                </Badge>
                            </CardContent>
                            <CardFooter className="p-3 pt-0">
                                <Button 
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectMarket(market.id);
                                    }}
                                >
                                    See details
                                </Button>
                            </CardFooter>
                        </Card>
                    </Popup>
                </Marker>
            ))}
        </>
    )
}

export function MarketMap() {
    const [map, setMap] = useState<L.Map | null>(null)
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30))
    const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null)

    const { data: markets, isLoading } = useQuery<MapMarker[]>({
        queryKey: ['markets', startDate.toISOString(), endDate.toISOString()],
        queryFn: async () => {
            const { data: places, error: placesError } = await supabase
                .from('places')
                .select('*')
                .eq('is_active', true)

            if (placesError) throw placesError

            const { data: marketEditions, error: marketsError } = await supabase
                .from('market_editions')
                .select(`
                    id,
                    name,
                    start_date,
                    end_date,
                    place_id,
                    market:markets!market_id (
                        name,
                        description
                    )
                `)
                .eq('is_active', true)
                .gte('start_date', startDate.toISOString().split('T')[0])
                .lte('start_date', endDate.toISOString().split('T')[0])
                .returns<MarketEditionResponse[]>()

            if (marketsError) throw marketsError

            const markers = marketEditions
                .map((edition: MarketEditionResponse) => {
                    const place = places?.find(p => p.id === edition.place_id)

                    if (!place?.latitude || !place?.longitude) {
                        return null
                    }

                    return {
                        id: edition.id,
                        name: edition.name,
                        market_name: edition.market?.name || 'Unknown Market',
                        description: edition.market?.description || null,
                        location: [place.latitude, place.longitude] as [number, number],
                        start_date: edition.start_date,
                        end_date: edition.end_date
                    }
                })
                .filter((marker: unknown): marker is MapMarker => marker !== null)

            return markers
        }
    })

    if (isLoading) {
        return <div className="absolute inset-0 flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="absolute inset-0 overflow-hidden">
            <MarketDetailModal
                marketId={selectedMarketId}
                onClose={() => setSelectedMarketId(null)}
            />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[40] bg-white p-4 rounded-lg shadow-md">
                <div className="flex gap-4 items-end">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[200px] justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date: Date | undefined) => date && setStartDate(date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[200px] justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date: Date | undefined) => date && setEndDate(date)}
                                    initialFocus
                                    disabled={(date) => date < startDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={12}
                className="h-full w-full"
                scrollWheelZoom={true}
                ref={setMap}
                whenReady={() => {
                    if (map) {
                        map.invalidateSize()
                    }
                }}
                zoomControl={false}
                maxBounds={[
                    [45.3, -74.0],
                    [45.7, -73.0]
                ]}
                minZoom={11}
            >
                <ZoomControl position="topright" />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    maxNativeZoom={19}
                />
                {markets && (
                    <MarketMarkers 
                        markets={markets} 
                        onSelectMarket={setSelectedMarketId} 
                    />
                )}
            </MapContainer>
        </div>
    )
}
