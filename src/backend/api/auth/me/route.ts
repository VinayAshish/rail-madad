import { NextResponse } from "next/server"
import { authenticateUser } from "@/backend/lib/auth"

export async function GET(req: Request) {
  try {
    const user = await authenticateUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      station: user.station,
      department: user.department,
    })
  } catch (error) {
    console.error("Error in auth/me:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

