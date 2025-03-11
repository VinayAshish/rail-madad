import jwt from "jsonwebtoken"
import User from "@/backend/models/user.model"
import twilio from "twilio"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null

export async function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOTP(phoneNumber: string, code: string) {
  if (!twilioClient) {
    console.log("SMS would be sent to", phoneNumber, "with code", code)
    return
  }

  try {
    await twilioClient.messages.create({
      body: `Your Rail Madad verification code is: ${code}`,
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER,
    })
  } catch (error) {
    console.error("Error sending SMS:", error)
    throw new Error("Failed to send verification code")
  }
}

export function generateToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function authenticateUser(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new Error("No token provided")
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      throw new Error("Invalid token")
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth(
  req: Request,
  handler: (req: Request, user: any) => Promise<Response>,
): Promise<Response> {
  const user = await authenticateUser(req)

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  return handler(req, user)
}

export async function requireRole(
  req: Request,
  role: string | string[],
  handler: (req: Request, user: any) => Promise<Response>,
): Promise<Response> {
  const user = await authenticateUser(req)

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const roles = Array.isArray(role) ? role : [role]
  if (!roles.includes(user.role)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  return handler(req, user)
}

