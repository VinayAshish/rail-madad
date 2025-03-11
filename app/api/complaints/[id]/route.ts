import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import Complaint from "@/models/complaint.model"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const complaint = await Complaint.findOne({
      complaintId: params.id,
    }).populate("userId", "phoneNumber name")

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    // Check if user has access to this complaint
    if (user.role !== "admin" && complaint.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(complaint)
  } catch (error) {
    console.error("Error in complaints/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch complaint" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status, resolution, feedback } = await req.json()

    const complaint = await Complaint.findOne({
      complaintId: params.id,
    })

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    // Check permissions
    if (user.role !== "admin" && complaint.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update status
    if (status && user.role === "admin") {
      complaint.status = status
      complaint.timeline.push({
        status,
        description: `Status updated to ${status}`,
      })
    }

    // Update resolution
    if (resolution && user.role === "admin") {
      complaint.resolution = {
        ...complaint.resolution,
        ...resolution,
        resolvedBy: user._id,
        resolvedAt: new Date(),
      }
    }

    // Update feedback
    if (feedback && complaint.userId.toString() === user._id.toString()) {
      complaint.resolution = {
        ...complaint.resolution,
        feedback,
      }
    }

    await complaint.save()

    return NextResponse.json(complaint)
  } catch (error) {
    console.error("Error in complaints/[id]:", error)
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 })
  }
}

