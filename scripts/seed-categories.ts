import mongoose from "mongoose"
import ComplaintCategory from "../models/complaint-category.model"
import { PriorityLevel } from "../lib/types"

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rail-madad"

const categories = [
  {
    name: "Health Issue or Accident",
    description: "Medical emergencies, injuries, or health-related issues during journey",
    priority: PriorityLevel.CRITICAL,
  },
  {
    name: "Theft or Robbery",
    description: "Incidents of theft, robbery, or loss of belongings during journey",
    priority: PriorityLevel.HIGH,
  },
  {
    name: "Ticketing and Reservations",
    description: "Issues related to ticket booking, confirmation, or cancellation",
    priority: PriorityLevel.HIGH,
  },
  {
    name: "Seat Reserved by Other Person",
    description: "Complaints about seat being occupied by unauthorized passengers",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "AC or Fan Issue",
    description: "Problems with air conditioning, fans, or temperature control in the coach",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Cleanliness",
    description: "Issues related to cleanliness of coaches, toilets, or stations",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Bed Roll",
    description: "Problems with bed rolls, blankets, pillows, or linen",
    priority: PriorityLevel.LOW,
  },
  {
    name: "Food Quality",
    description: "Complaints about food quality, hygiene, or service",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Staff Behavior",
    description: "Issues related to behavior of railway staff or service providers",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Delayed Train",
    description: "Complaints about train delays or schedule changes",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Water Availability",
    description: "Issues with water supply in coaches or at stations",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Electrical Issues",
    description: "Problems with electrical outlets, lights, or other electrical equipment",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Toilet Issues",
    description: "Problems with toilets, including cleanliness, functionality, or water supply",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Luggage Issues",
    description: "Problems with luggage storage, handling, or damage",
    priority: PriorityLevel.LOW,
  },
  {
    name: "Overcrowding",
    description: "Complaints about overcrowding in coaches or stations",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Accessibility Issues",
    description: "Problems faced by passengers with disabilities or special needs",
    priority: PriorityLevel.HIGH,
  },
  {
    name: "Harassment",
    description: "Incidents of harassment, discrimination, or inappropriate behavior",
    priority: PriorityLevel.HIGH,
  },
  {
    name: "Refund Issues",
    description: "Problems with refunds for cancelled or partially travelled journeys",
    priority: PriorityLevel.MEDIUM,
  },
  {
    name: "Other",
    description: "Other issues not covered by specific categories",
    priority: PriorityLevel.LOW,
  },
]

async function seedCategories() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing categories
    await ComplaintCategory.deleteMany({})
    console.log("Cleared existing categories")

    // Insert new categories
    await ComplaintCategory.insertMany(categories)
    console.log(`Inserted ${categories.length} categories`)

    console.log("Categories seeded successfully")
  } catch (error) {
    console.error("Error seeding categories:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

seedCategories()

