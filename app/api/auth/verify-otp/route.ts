import { NextResponse } from "next/server"
import User from "@/models/user.model"
import { generateToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { phoneNumber, code } = await req.json()

    if (!phoneNumber || !code) {
      return NextResponse.json({ error: "Phone number and verification code are required" }, { status: 400 })
    }

    const user = await User.findOne({
      phoneNumber,
      verificationCodeExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // For development, allow any code to work if it matches the stored code
    let isValid = false
    if (process.env.NODE_ENV === "development") {
      isValid = code === user.verificationCode || code === "123456" // Allow test code
    } else {
      isValid = await user.verifyOTP(code)
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Update user
    user.isVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpires = undefined
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id, user.role)

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error in verify-otp:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}

