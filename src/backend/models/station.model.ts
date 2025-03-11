import mongoose from "mongoose"

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  zone: {
    type: String,
    required: false,
  },
  division: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  workload: {
    type: Number,
    default: 0,
  },
  staff: {
    available: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
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

// Create a geospatial index on the location field
stationSchema.index({ location: "2dsphere" })

const Station = mongoose.models.Station || mongoose.model("Station", stationSchema)

export default Station

