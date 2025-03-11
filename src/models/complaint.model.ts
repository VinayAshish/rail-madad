import mongoose from "mongoose"

const complaintSchema = new mongoose.Schema({
  // ... existing fields ...
  trainInfo: {
    trainNumber: String,
    trainName: String,
    currentStation: String,
    nextStation: String,
    expectedArrival: Date,
  },
  assignment: {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    assignedAt: Date,
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
  },
})

// ... rest of the model ...

