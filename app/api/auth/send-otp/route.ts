import { NextResponse } from "next/server"
import User from "@/models/user.model"
import { generateOTP, sendOTP } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Generate OTP
    const verificationCode = await generateOTP()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Find or create user
    let user = await User.findOne({ phoneNumber })

    if (!user) {
      user = new User({
        phoneNumber,
        role: "user", // Default role
        verificationCode,
        verificationCodeExpires,
      })
    } else {
      user.verificationCode = verificationCode
      user.verificationCodeExpires = verificationCodeExpires
    }

    await user.save()

    // For development, log the OTP to console
    console.log(`OTP for ${phoneNumber}: ${verificationCode}`)

    // Send OTP
    try {
      await sendOTP(phoneNumber, verificationCode)
    } catch (error) {
      console.error("Error sending OTP:", error)
      // Continue even if SMS fails, since we're logging the OTP to console for development
    }

    return NextResponse.json({
      message: "Verification code sent successfully",
      phoneNumber,
      // Include the OTP in the response for development purposes
      otp: process.env.NODE_ENV === "development" ? verificationCode : undefined,
    })
  } catch (error) {
    console.error("Error in send-otp:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}

