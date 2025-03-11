import mongoose from "mongoose"

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
  type: {
    type: String,
    enum: ["cleanliness", "food", "staff", "technical", "other"],
    required: true,
  },
  category: {
    type: String,
    required: false, // Will be set by AI
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: false, // Will be set by AI
  },
  status: {
    type: String,
    enum: ["pending_review", "approved", "in_progress", "resolved", "closed", "rejected"],
    default: "pending_review",
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
    required: false, // Will be set by AI or admin
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

