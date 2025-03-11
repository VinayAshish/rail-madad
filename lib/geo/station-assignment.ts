import { Station } from "./station"
import { StaffMember } from "./staff-member"
import { autoEscalateComplaint } from "./complaint-escalation"

interface Station {
  id: string
  name: string
  location: {
    type: "Point"
    coordinates: [number, number] // [longitude, latitude]
  }
  workload: number
  staff: {
    available: number
    total: number
  }
}

interface StaffMember {
  id: string
  stationId: string
  skills: string[]
  currentWorkload: number
  performance: number
}

export async function findNearestStation(latitude: number, longitude: number, category: string): Promise<Station> {
  // Query MongoDB for nearest station using $near
  const station = await Station.findOne({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
    },
    "staff.available": { $gt: 0 },
  }).sort({ workload: 1 })

  return station
}

export async function assignComplaintToStaff(
  complaintId: string,
  stationId: string,
  category: string,
  priority: string,
): Promise<StaffMember> {
  // Find best matching staff based on skills and workload
  const staff = await StaffMember.findOne({
    stationId,
    skills: category,
    currentWorkload: { $lt: 5 }, // Max 5 complaints per staff
  }).sort({ performance: -1 })

  if (!staff) {
    // Auto-escalate if no suitable staff found
    await autoEscalateComplaint(complaintId)
  }

  return staff
}

export async function generateWorkloadHeatmap(): Promise<any> {
  const heatmapData = await Station.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [0, 0] },
        distanceField: "distance",
        spherical: true,
      },
    },
    {
      $project: {
        location: 1,
        workload: 1,
        weight: { $divide: ["$workload", "$staff.total"] },
      },
    },
  ])

  return heatmapData
}

