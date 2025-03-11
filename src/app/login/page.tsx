"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (role: "admin" | "worker", formData: FormData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
          role,
        }),
      })

      if (!response.ok) throw new Error("Invalid credentials")

      const { token, user } = await response.json()
      login(token)

      // Redirect based on role
      router.push(role === "admin" ? "/admin/dashboard" : "/worker/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Choose your role and enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="worker" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="worker">Worker</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="worker">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleLogin("worker", new FormData(e.currentTarget))
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="worker-username">Username</Label>
                  <Input id="worker-username" name="username" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="worker-password">Password</Label>
                  <Input id="worker-password" name="password" type="password" required disabled={loading} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login as Worker"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleLogin("admin", new FormData(e.currentTarget))
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input id="admin-username" name="username" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" name="password" type="password" required disabled={loading} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login as Admin"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

