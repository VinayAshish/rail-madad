import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/backend/models/user.model"
import ActivityLog from "@/backend/models/activity-log.model"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Find user by username or email or phone number
    const user = await User.findOne({
      $or: [{ username }, { email: username }, { phoneNumber: username }],
      role,
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValid = await user.verifyPassword(password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    user.lastLogin = new Date()

    // Log login activity
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown"
    const userAgent = req.headers.get("user-agent") || "unknown"

    user.loginHistory.push({
      timestamp: new Date(),
      ipAddress,
      userAgent,
    })

    await user.save()

    // Create activity log
    await ActivityLog.create({
      userId: user._id,
      action: "login",
      details: { role: user.role },
      ipAddress,
      userAgent,
    })

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error in login:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}

