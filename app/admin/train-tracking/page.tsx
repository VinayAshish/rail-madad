"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, MapPin, Train } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

// Mock train locations
const MOCK_TRAINS = [
  {
    number: "12301",
    name: "Howrah Rajdhani",
    position: { lat: 22.5726, lng: 88.3639 }, // Howrah
    status: "On Time",
    lastUpdated: new Date().toISOString(),
  },
  {
    number: "12302",
    name: "Delhi Rajdhani",
    position: { lat: 28.6139, lng: 77.209 }, // Delhi
    status: "Delayed by 15 minutes",
    lastUpdated: new Date().toISOString(),
  },
  {
    number: "12309",
    name: "Rajendra Nagar Patna Rajdhani",
    position: { lat: 25.6117, lng: 85.1446 }, // Patna
    status: "On Time",
    lastUpdated: new Date().toISOString(),
  },
  {
    number: "12951",
    name: "Mumbai Rajdhani",
    position: { lat: 19.076, lng: 72.8777 }, // Mumbai
    status: "On Time",
    lastUpdated: new Date().toISOString(),
  },
  {
    number: "12303",
    name: "Poorva Express",
    position: { lat: 25.3176, lng: 82.9739 }, // Varanasi
    status: "Delayed by 30 minutes",
    lastUpdated: new Date().toISOString(),
  },
]

export default function TrainTrackingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [trains, setTrains] = useState(MOCK_TRAINS)
  const [trainNumber, setTrainNumber] = useState("")
  const [selectedTrain, setSelectedTrain] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { toast } = useToast()

  // Redirect if not admin or worker
  useEffect(() => {
    if (user && !["admin", "worker"].includes(user.role) && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access train tracking.",
        variant: "destructive",
      })
      router.push("/dashboard")
    } else if (!user && !isLoading) {
      router.push("/login")
    } else {
      // In a real app, you would fetch train locations from API
      setTimeout(() => {
        setIsLoading(false)
        setMapLoaded(true)
      }, 1500)
    }
  }, [user, router, isLoading, toast])

  const handleTrackTrain = () => {
    if (!trainNumber) {
      toast({
        title: "Train Number Required",
        description: "Please enter a train number to track.",
        variant: "destructive",
      })
      return
    }

    const train = trains.find((t) => t.number === trainNumber)

    if (train) {
      setSelectedTrain(train)
      toast({
        title: "Train Located",
        description: `${train.name} (${train.number}) has been located.`,
      })
    } else {
      toast({
        title: "Train Not Found",
        description: "Could not find train with this number. Please check and try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading train tracking system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Train Location Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Track Train</CardTitle>
            <CardDescription>Enter a train number to see its current location.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trainNumber">Train Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="trainNumber"
                    placeholder="e.g., 12301"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                  />
                  <Button onClick={handleTrackTrain}>Track</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Trains (Demo)</Label>
                <div className="text-sm text-gray-500 space-y-1">
                  {trains.map((train) => (
                    <div
                      key={train.number}
                      className="flex items-center cursor-pointer hover:text-blue-600"
                      onClick={() => {
                        setTrainNumber(train.number)
                        setSelectedTrain(train)
                      }}
                    >
                      <Train className="h-4 w-4 mr-2" />
                      {train.number} - {train.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Location Map</CardTitle>
            <CardDescription>Real-time location of trains across India.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {mapLoaded ? (
              <div className="relative h-[400px] bg-gray-100 rounded-md overflow-hidden">
                {/* In a real app, this would be a Google Maps or Mapbox component */}
                <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/india-map-jUfV0KiT8F1P4rr4Pz0lsOVTCE5QVW.jpeg')] bg-contain bg-center bg-no-repeat">
                  {/* Map markers for trains */}
                  {trains.map((train) => (
                    <div
                      key={train.number}
                      className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer ${selectedTrain?.number === train.number ? "text-red-600 animate-pulse" : "text-blue-600"}`}
                      style={{
                        left: `${((train.position.lng - 68) / (97 - 68)) * 100}%`,
                        top: `${((8 - train.position.lat) / (8 - 37)) * 100}%`,
                      }}
                      onClick={() => {
                        setTrainNumber(train.number)
                        setSelectedTrain(train)
                      }}
                    >
                      <MapPin className="h-6 w-6" />
                    </div>
                  ))}
                </div>

                {selectedTrain && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{selectedTrain.name}</h3>
                        <p className="text-sm text-gray-500">Train Number: {selectedTrain.number}</p>
                        <p className="text-sm">Status: {selectedTrain.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Coordinates: {selectedTrain.position.lat.toFixed(4)}, {selectedTrain.position.lng.toFixed(4)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last Updated: {new Date(selectedTrain.lastUpdated).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

