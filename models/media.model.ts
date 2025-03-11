import mongoose from "mongoose"

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  chunks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaChunk",
    },
  ],
})

const mediaChunkSchema = new mongoose.Schema({
  files_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
  },
  n: Number,
  data: Buffer,
})

export const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema)
export const MediaChunk = mongoose.models.MediaChunk || mongoose.model("MediaChunk", mediaChunkSchema)

