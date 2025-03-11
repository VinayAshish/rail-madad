"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login, checkUserRole } = useAuth()

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would redirect to Google OAuth
      // window.location.href = "/api/auth/signin/google"

      // For demo purposes, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate user data from Google
      const email =
        prompt("Enter your email for simulation (use @adminrmc.com for admin, @staffrmc.com for worker)") ||
        "user@example.com"
      const role = checkUserRole(email)

      login({
        id: "user123",
        email: email,
        name: email.split("@")[0],
        role: role,
        image: `https://ui-avatars.com/api/?name=${email.split("@")[0]}`,
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoAdminLogin = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      login({
        id: "admin123",
        email: "admin@adminrmc.com",
        name: "Demo Admin",
        role: "admin",
        image: "https://ui-avatars.com/api/?name=Demo+Admin",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "Failed to login as admin. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoWorkerLogin = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      login({
        id: "worker123",
        email: "worker@staffrmc.com",
        name: "Demo Worker",
        role: "worker",
        image: "https://ui-avatars.com/api/?name=Demo+Worker",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "Failed to login as worker. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Sign in to your Rail Madad account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            Sign in with Google
          </Button>

          <div className="flex items-center">
            <Separator className="flex-1" />
            <span className="mx-2 text-xs text-gray-500">DEMO ACCOUNTS</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleDemoAdminLogin}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Admin Login
            </Button>

            <Button
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleDemoWorkerLogin}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Worker Login
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            For demonstration purposes only. In a production environment, secure authentication would be implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

