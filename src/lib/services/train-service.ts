const RAILWAY_API_BASE = "https://indian-railway-api.cyclic.app/api/v1"

export interface TrainInfo {
  trainNumber: string
  trainName: string
  from: string
  to: string
  schedule: TrainSchedule[]
}

export interface TrainSchedule {
  stationCode: string
  stationName: string
  arrivalTime: string
  departureTime: string
  distance: number
  platformNumber: string
}

export interface LiveStatus {
  trainNumber: string
  currentStation: string
  lastUpdated: string
  expectedDelay: number
  nextStations: string[]
}

export async function getTrainInfo(trainNumber: string): Promise<TrainInfo> {
  const response = await fetch(`${RAILWAY_API_BASE}/trains/${trainNumber}`)
  if (!response.ok) {
    throw new Error("Failed to fetch train information")
  }
  return response.json()
}

export async function getLiveStatus(trainNumber: string): Promise<LiveStatus> {
  const response = await fetch(`${RAILWAY_API_BASE}/trains/${trainNumber}/live`)
  if (!response.ok) {
    throw new Error("Failed to fetch live status")
  }
  return response.json()
}

export async function searchTrains(query: string): Promise<TrainInfo[]> {
  const response = await fetch(`${RAILWAY_API_BASE}/trains/search?q=${query}`)
  if (!response.ok) {
    throw new Error("Failed to search trains")
  }
  return response.json()
}

