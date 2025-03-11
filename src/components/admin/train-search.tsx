"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { searchTrains, getLiveStatus } from "@/lib/services/train-service"
import type { TrainInfo, LiveStatus } from "@/lib/services/train-service"

export function TrainSearch() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [trains, setTrains] = useState<TrainInfo[]>([])
  const [selectedTrain, setSelectedTrain] = useState<TrainInfo | null>(null)
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const results = await searchTrains(searchQuery)
      setTrains(results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search trains",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTrainSelect = async (train: TrainInfo) => {
    setSelectedTrain(train)
    try {
      const status = await getLiveStatus(train.trainNumber)
      setLiveStatus(status)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch live status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search by train number or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-medium">Search Results</h3>
          {trains.map((train) => (
            <Card
              key={train.trainNumber}
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleTrainSelect(train)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{train.trainName}</p>
                    <p className="text-sm text-muted-foreground">{train.trainNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {train.from} → {train.to}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTrain && (
          <div>
            <h3 className="font-medium mb-4">Train Details</h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium">{selectedTrain.trainName}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTrain.trainNumber}</p>
                </div>

                {liveStatus && (
                  <div className="space-y-2">
                    <p>Current Station: {liveStatus.currentStation}</p>
                    <p>Last Updated: {liveStatus.lastUpdated}</p>
                    <p>Expected Delay: {liveStatus.expectedDelay} minutes</p>
                    <div>
                      <p className="font-medium">Upcoming Stations:</p>
                      <ul className="text-sm">
                        {liveStatus.nextStations.map((station) => (
                          <li key={station}>{station}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-medium">Schedule:</p>
                  <div className="max-h-60 overflow-y-auto">
                    {selectedTrain.schedule.map((stop) => (
                      <div key={stop.stationCode} className="py-2 border-b last:border-0">
                        <p className="font-medium">{stop.stationName}</p>
                        <p className="text-sm">
                          Arr: {stop.arrivalTime} | Dep: {stop.departureTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

