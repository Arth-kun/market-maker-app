// src/pages/MarketMap.tsx
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet'
import { useQuery } from '@tanstack/react-query'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { addDays } from 'date-fns'
import { MarketDetailModal } from '../components/MarketDetailModal'

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
    id: number
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
  onSelectMarket: (id: number) => void
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
                        <div className="min-w-[200px]">
                            <h3 className="font-semibold text-gray-900">{market.market_name}</h3>
                            <p className="text-sm text-gray-600">{market.name}</p>
                            {market.description && (
                                <p className="text-sm text-gray-600 mt-1">{market.description}</p>
                            )}
                            <div className="mt-2 text-sm text-gray-500">
                                <p>From: {new Date(market.start_date).toLocaleDateString()}</p>
                                <p>To: {new Date(market.end_date).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectMarket(market.id);
                                }}
                                className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                                See details
                            </button>
                        </div>
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
    const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null)

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
                    market:market_id (
                        name,
                        description
                    )
                `)
                .eq('is_active', true)
                .gte('start_date', startDate.toISOString().split('T')[0])
                .lte('start_date', endDate.toISOString().split('T')[0])

            if (marketsError) throw marketsError

            const markers = marketEditions
                .map(edition => {
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
                .filter((marker): marker is MapMarker => marker !== null)

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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white p-4 rounded-lg shadow-md">
                <div className="flex gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => date && setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => date && setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="p-2 border rounded"
                        />
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
