"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { WorkGuide } from "@/components/worker/work-guide"

interface Assignment {
  id: string
  complaintId: string
  status: string
  priority: string
  description: string
  location: string
  assignedAt: string
}

export default function WorkerDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "worker") {
      router.push("/login")
      return
    }
    fetchAssignments()
  }, [user, router])

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/worker/assignments")
      const data = await response.json()
      setAssignments(data.assignments)
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (assignmentId: string, status: string) => {
    try {
      await fetch(`/api/worker/assignments/${assignmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchAssignments()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Worker Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="guide">Work Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-4">
            {assignments
              .filter((a) => a.status !== "completed")
              .map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Complaint #{assignment.complaintId}</h3>
                          <Badge
                            variant={
                              assignment.priority === "high"
                                ? "destructive"
                                : assignment.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {assignment.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        <p className="text-sm">Location: {assignment.location}</p>
                        <p className="text-sm text-muted-foreground">
                          Assigned: {new Date(assignment.assignedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => updateStatus(assignment.id, "in_progress")}
                          disabled={assignment.status === "in_progress"}
                        >
                          Start Work
                        </Button>
                        <Button
                          onClick={() => updateStatus(assignment.id, "completed")}
                          disabled={assignment.status !== "in_progress"}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4">
            {assignments
              .filter((a) => a.status === "completed")
              .map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-medium">Complaint #{assignment.complaintId}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        <Badge variant="success">Completed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="guide">
          <WorkGuide />
        </TabsContent>
      </Tabs>
    </div>
  )
}

