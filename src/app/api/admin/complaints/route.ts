import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import Complaint from "@/models/complaint.model"

export async function GET(req: Request) {
  try {
    const user = await requireAdmin(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(100).lean()

    return NextResponse.json({ complaints })
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 })
  }
}

