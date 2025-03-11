import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import Complaint from "@/models/complaint.model"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status, notes } = await req.json()
    const complaint = await Complaint.findByIdAndUpdate(
      params.id,
      {
        $set: { status },
        $push: {
          timeline: {
            status,
            description: notes || `Status updated to ${status}`,
            updatedBy: user._id,
          },
        },
      },
      { new: true },
    )

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json(complaint)
  } catch (error) {
    console.error("Error updating complaint:", error)
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 })
  }
}

