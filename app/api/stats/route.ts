import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import Complaint from "@/models/complaint.model"

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") || "7d"

    // Calculate date range
    const now = new Date()
    const rangeMap: { [key: string]: number } = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    }
    const startDate = new Date(now.getTime() - rangeMap[range])

    // Build query based on user role
    const query: any = {
      createdAt: { $gte: startDate },
    }
    if (user.role !== "admin") {
      query.userId = user._id
    }

    // Fetch complaints statistics
    const [total, resolved, resolutionTimes, aiAnalysis] = await Promise.all([
      Complaint.countDocuments(query),
      Complaint.countDocuments({ ...query, status: "resolved" }),
      Complaint.find({
        ...query,
        status: "resolved",
        "resolution.resolvedAt": { $exists: true },
      }).select("createdAt resolution.resolvedAt"),
      Complaint.find(query).select("aiAnalysis.confidence"),
    ])

    // Calculate resolution rate
    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0

    // Calculate average resolution time
    const avgResolutionTime =
      resolutionTimes.reduce((acc, complaint) => {
        const resolutionTime = complaint.resolution.resolvedAt.getTime() - complaint.createdAt.getTime()
        return acc + resolutionTime / (1000 * 60 * 60) // Convert to hours
      }, 0) / (resolutionTimes.length || 1)

    // Calculate AI accuracy
    const aiAccuracy =
      (aiAnalysis.reduce((acc, complaint) => {
        return acc + (complaint.aiAnalysis?.confidence || 0)
      }, 0) /
        (aiAnalysis.length || 1)) *
      100

    return NextResponse.json({
      total,
      resolutionRate,
      avgResolutionTime,
      aiAccuracy,
    })
  } catch (error) {
    console.error("Error in stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}

