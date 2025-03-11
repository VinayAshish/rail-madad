"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "worker"
  image?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
  checkUserRole: (email: string) => "admin" | "worker" | "user"
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  checkUserRole: () => "user",
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const checkUserRole = (email: string): "admin" | "worker" | "user" => {
    if (email.endsWith("@adminrmc.com")) {
      return "admin"
    } else if (email.endsWith("@staffrmc.com")) {
      return "worker"
    } else {
      return "user"
    }
  }

  const login = (userData: User) => {
    // Determine role based on email domain
    const role = checkUserRole(userData.email)

    // Update user data with correct role
    const updatedUserData = {
      ...userData,
      role,
    }

    setUser(updatedUserData)
    localStorage.setItem("user", JSON.stringify(updatedUserData))

    // Show welcome toast with role information
    toast({
      title: "Login Successful",
      description: `Welcome ${updatedUserData.name}! You are logged in as a ${role}.`,
    })

    // Redirect based on role
    if (role === "admin") {
      router.push("/admin")
    } else if (role === "worker") {
      router.push("/worker")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, checkUserRole }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

