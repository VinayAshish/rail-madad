import mongoose from "mongoose"
import { PriorityLevel, ComplaintStatus } from "@/lib/types"

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pnrNumber: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ComplaintCategory",
    required: false, // Make it optional to support legacy data
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: Object.values(PriorityLevel),
    default: PriorityLevel.MEDIUM,
  },
  status: {
    type: String,
    enum: Object.values(ComplaintStatus),
    default: ComplaintStatus.PENDING_REVIEW,
  },
  mediaFiles: [
    {
      type: {
        type: String,
        enum: ["image", "video", "audio"],
      },
      fileId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      url: String,
      aiAnalysis: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
  ],
  trainInfo: {
    trainNumber: String,
    trainName: String,
    currentStation: String,
    nextStation: String,
    expectedArrival: Date,
  },
  department: {
    type: String,
    required: false,
  },
  timeline: [
    {
      status: String,
      description: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  aiAnalysis: {
    category: String,
    priority: String,
    sentiment: String,
    confidence: Number,
    tags: [String],
  },
  assignment: {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: Date,
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
  },
  resolution: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: Date,
    feedback: {
      rating: Number,
      comment: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Generate complaint ID before saving
complaintSchema.pre("save", async function (next) {
  if (!this.complaintId) {
    const count = await mongoose.models.Complaint.countDocuments()
    this.complaintId = "RM" + (count + 1).toString().padStart(6, "0")
  }
  this.updatedAt = new Date()
  next()
})

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema)

export default Complaint

