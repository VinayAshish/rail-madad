import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/user.model"
import Station from "../models/station.model"

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rail-madad"

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Station.deleteMany({})

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    await User.create({
      username: "admin",
      password: adminPassword,
      name: "Admin User",
      role: "admin",
      email: "admin@railmadad.com",
      isVerified: true,
    })
    console.log("Admin user created")

    // Create worker users
    const workerPassword = await bcrypt.hash("worker123", 10)
    await User.create([
      {
        username: "worker1",
        password: workerPassword,
        name: "Worker 1",
        role: "worker",
        email: "worker1@railmadad.com",
        station: "NDLS",
        department: "Cleanliness",
        skills: ["cleanliness", "technical"],
        isVerified: true,
      },
      {
        username: "worker2",
        password: workerPassword,
        name: "Worker 2",
        role: "worker",
        email: "worker2@railmadad.com",
        station: "NDLS",
        department: "Food",
        skills: ["food"],
        isVerified: true,
      },
      {
        username: "worker3",
        password: workerPassword,
        name: "Worker 3",
        role: "worker",
        email: "worker3@railmadad.com",
        station: "CSTM",
        department: "Technical",
        skills: ["technical"],
        isVerified: true,
      },
    ])
    console.log("Worker users created")

    // Create stations
    await Station.create([
      {
        name: "New Delhi",
        code: "NDLS",
        location: {
          type: "Point",
          coordinates: [77.2197, 28.6448], // [longitude, latitude]
        },
        zone: "Northern",
        division: "Delhi",
        state: "Delhi",
        workload: 0,
        staff: {
          available: 5,
          total: 10,
        },
      },
      {
        name: "Mumbai CST",
        code: "CSTM",
        location: {
          type: "Point",
          coordinates: [72.8356, 18.9402],
        },
        zone: "Central",
        division: "Mumbai",
        state: "Maharashtra",
        workload: 0,
        staff: {
          available: 3,
          total: 8,
        },
      },
      {
        name: "Howrah Junction",
        code: "HWH",
        location: {
          type: "Point",
          coordinates: [88.3426, 22.5839],
        },
        zone: "Eastern",
        division: "Howrah",
        state: "West Bengal",
        workload: 0,
        staff: {
          available: 4,
          total: 7,
        },
      },
      {
        name: "Chennai Central",
        code: "MAS",
        location: {
          type: "Point",
          coordinates: [80.2707, 13.0827],
        },
        zone: "Southern",
        division: "Chennai",
        state: "Tamil Nadu",
        workload: 0,
        staff: {
          available: 3,
          total: 6,
        },
      },
    ])
    console.log("Stations created")

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

seedDatabase()

