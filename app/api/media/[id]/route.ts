import { NextResponse } from "next/server"
import { Media, MediaChunk } from "@/models/media.model"
import { requireAuth } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const media = await Media.findById(params.id)

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Get all chunks
    const chunks = await MediaChunk.find({
      files_id: media._id,
    }).sort("n")

    // Combine chunks
    const buffer = Buffer.concat(chunks.map((chunk) => chunk.data))

    // Return file with proper content type
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": media.contentType,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error in media/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}

