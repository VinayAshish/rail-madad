import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: false,
    sparse: true,
  },
  email: {
    type: String,
    required: false,
    sparse: true,
  },
  username: {
    type: String,
    required: false,
    sparse: true,
  },
  password: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "worker"],
    default: "user",
  },
  verificationCode: {
    type: String,
    required: false,
  },
  verificationCodeExpires: {
    type: Date,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    required: false,
  },
  station: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  skills: {
    type: [String],
    default: [],
  },
  available: {
    type: Boolean,
    default: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  currentTrain: {
    type: String,
    required: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  loginHistory: [
    {
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
    },
  ],
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  if (this.isModified("verificationCode") && this.verificationCode) {
    this.verificationCode = await bcrypt.hash(this.verificationCode, 10)
  }

  next()
})

// Method to verify password
userSchema.methods.verifyPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

// Method to verify OTP
userSchema.methods.verifyOTP = async function (code: string) {
  return await bcrypt.compare(code, this.verificationCode)
}

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User

