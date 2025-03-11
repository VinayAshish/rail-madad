import mongoose from "mongoose"
import { PriorityLevel } from "@/lib/types"

const complaintCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: Object.values(PriorityLevel),
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
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

const ComplaintCategory =
  mongoose.models.ComplaintCategory || mongoose.model("ComplaintCategory", complaintCategorySchema)

export default ComplaintCategory

