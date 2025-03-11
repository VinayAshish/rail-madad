import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import Complaint from "@/models/complaint.model"
import ComplaintCategory from "@/models/complaint-category.model"
import { Media, MediaChunk } from "@/models/media.model"
import { processAIAnalysis } from "@/lib/ai-processing"
import { PriorityLevel, ComplaintStatus } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pnrNumber = formData.get("pnrNumber") as string
    const categoryId = formData.get("categoryId") as string
    const description = formData.get("description") as string
    const files = formData.getAll("files") as File[]

    // Validate required fields
    if (!pnrNumber || !description) {
      return NextResponse.json(
        {
          error: "Missing required fields: PNR number and description are required",
        },
        { status: 400 },
      )
    }

    // Create complaint with default values
    const complaint = new Complaint({
      userId: user._id,
      pnrNumber,
      description,
      priority: PriorityLevel.MEDIUM, // Default priority
      status: ComplaintStatus.PENDING_REVIEW,
      timeline: [
        {
          status: "Submitted",
          description: "Complaint received",
        },
      ],
    })

    // If category is provided, set it and update priority
    if (categoryId) {
      try {
        const category = await ComplaintCategory.findById(categoryId)
        if (category) {
          complaint.categoryId = category._id
          complaint.priority = category.priority
        }
      } catch (error) {
        console.error("Error fetching category:", error)
        // Continue without category if there's an error
      }
    }

    // Process media files
    if (files && files.length > 0) {
      const mediaPromises = files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())

        // Create media document
        const media = new Media({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        })

        // Create chunk
        const chunk = new MediaChunk({
          files_id: media._id,
          n: 0,
          data: buffer,
        })

        await chunk.save()
        media.chunks = [chunk._id]
        await media.save()

        // Process with AI
        const aiAnalysis = await processAIAnalysis(buffer, file.type)

        return {
          type: file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
              ? "video"
              : file.type.startsWith("audio/")
                ? "audio"
                : "unknown",
          fileId: media._id,
          url: `/api/media/${media._id}`,
          aiAnalysis,
        }
      })

      const mediaFiles = await Promise.all(mediaPromises)
      complaint.mediaFiles = mediaFiles

      // Aggregate AI analysis
      const aggregateAnalysis = mediaFiles.reduce((acc, file) => {
        // Combine and weight analysis from different media files
        return {
          ...acc,
          ...file.aiAnalysis,
          confidence: (acc.confidence || 0) + (file.aiAnalysis.confidence || 0) / mediaFiles.length,
        }
      }, {})

      complaint.aiAnalysis = aggregateAnalysis

      // Update timeline with AI processing
      complaint.timeline.push({
        status: "AI Processing",
        description: "AI analyzing media content",
      })
    }

    await complaint.save()

    return NextResponse.json({
      message: "Complaint submitted successfully",
      complaintId: complaint.complaintId,
    })
  } catch (error) {
    console.error("Error in complaints:", error)
    return NextResponse.json({ error: "Failed to submit complaint" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const query: any = {}

    // Apply filters based on user role
    if (user.role !== "admin") {
      query.userId = user._id
    }

    // Apply search filters
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    if (status && status !== "all") query.status = status
    if (categoryId && categoryId !== "all") query.categoryId = categoryId
    if (priority && priority !== "all") query.priority = priority
    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "phoneNumber name")
        .populate("categoryId", "name priority"),
      Complaint.countDocuments(query),
    ])

    return NextResponse.json({
      complaints,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error in complaints:", error)
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 })
  }
}

