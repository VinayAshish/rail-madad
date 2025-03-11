import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function generateComplaintId(): string {
  return "RM" + Math.floor(100000 + Math.random() * 900000)
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-500 hover:bg-red-600"
    case "HIGH":
      return "bg-orange-500 hover:bg-orange-600"
    case "MEDIUM":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "LOW":
      return "bg-green-500 hover:bg-green-600"
    default:
      return "bg-blue-500 hover:bg-blue-600"
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "RESOLVED":
      return "bg-green-100 text-green-800"
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

