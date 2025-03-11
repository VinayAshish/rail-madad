export enum PriorityLevel {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum ComplaintStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export interface ComplaintCategory {
  id: string
  name: string
  description: string
  priority: PriorityLevel
  color: string
  isActive: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "worker"
  image?: string
}

export interface Worker {
  id: string
  name: string
  email: string
  department: string
  available: boolean
}

export interface Complaint {
  id: string
  pnrNumber: string
  trainNumber: string
  coachNumber: string
  seatNumber: string
  description: string
  categoryId: string
  category?: string
  status: ComplaintStatus
  priority: PriorityLevel
  contactEmail: string
  createdAt: string
  updatedAt: string
  assignedTo?: string | null
}

export const CATEGORY_COLORS = {
  [PriorityLevel.CRITICAL]: "bg-red-500",
  [PriorityLevel.HIGH]: "bg-orange-500",
  [PriorityLevel.MEDIUM]: "bg-yellow-500",
  [PriorityLevel.LOW]: "bg-green-500",
}

export const CATEGORY_TEXT_COLORS = {
  [PriorityLevel.CRITICAL]: "text-red-600",
  [PriorityLevel.HIGH]: "text-orange-600",
  [PriorityLevel.MEDIUM]: "text-yellow-600",
  [PriorityLevel.LOW]: "text-green-600",
}

export const CATEGORY_BADGE_VARIANTS = {
  [PriorityLevel.CRITICAL]: "destructive",
  [PriorityLevel.HIGH]: "orange",
  [PriorityLevel.MEDIUM]: "yellow",
  [PriorityLevel.LOW]: "green",
}

