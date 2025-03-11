"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs"
import { useAuth } from "@/frontend/contexts/auth-context"
import { WorkGuide } from "@/frontend/components/worker/work-guide"
import { useToast } from "@/frontend/components/ui/use-toast"

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
  const { toast } = useToast()
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
      if (!response.ok) throw new Error("Failed to fetch assignments")

      const data = await response.json()
      setAssignments(data.assignments)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (assignmentId: string, status: string) => {
    try {
      const response = await fetch(`/api/worker/assignments/${assignmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast({
        title: "Success",
        description: "Assignment status updated successfully",
      })

      fetchAssignments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Worker Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || user?.phoneNumber}</p>
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

            {assignments.filter((a) => a.status !== "completed").length === 0 && (
              <p>No active tasks assigned to you.</p>
            )}
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

            {assignments.filter((a) => a.status === "completed").length === 0 && <p>No completed tasks yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="guide">
          <WorkGuide />
        </TabsContent>
      </Tabs>
    </div>
  )
}

