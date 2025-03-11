"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getStatusColor, getPriorityColor } from "@/lib/utils"

export default function WorkerDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    assigned: 0,
    completed: 0,
  })
  const { toast } = useToast()

  // Redirect if not worker
  useEffect(() => {
    if (user && user.role !== "worker" && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the worker dashboard.",
        variant: "destructive",
      })
      router.push("/dashboard")
    } else if (!user && !isLoading) {
      router.push("/login")
    } else {
      // Get complaints from localStorage
      const storedComplaints = JSON.parse(localStorage.getItem("complaints") || "[]")

      // Filter complaints assigned to this worker
      const workerComplaints = storedComplaints.filter((c: any) => c.assignedTo === user?.id)
      setComplaints(workerComplaints)

      // Calculate stats
      const assigned = workerComplaints.filter((c: any) => c.status === "IN_PROGRESS").length
      const completed = workerComplaints.filter((c: any) => c.status === "RESOLVED").length

      setStats({
        assigned,
        completed,
      })

      setIsLoading(false)
    }
  }, [user, router, isLoading, toast])

  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading worker dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "worker") {
    return null
  }

  const handleCompleteTask = (id: string) => {
    // Get all complaints
    const allComplaints = JSON.parse(localStorage.getItem("complaints") || "[]")

    // Update the specific complaint
    const updatedComplaints = allComplaints.map((complaint: any) =>
      complaint.id === id
        ? {
            ...complaint,
            status: "RESOLVED",
            updatedAt: new Date().toISOString(),
          }
        : complaint,
    )

    // Save back to localStorage
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints))

    // Update local state
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status: "RESOLVED",
              updatedAt: new Date().toISOString(),
            }
          : complaint,
      ),
    )

    // Update stats
    setStats({
      assigned: stats.assigned - 1,
      completed: stats.completed + 1,
    })

    toast({
      title: "Task Completed",
      description: `Complaint ${id} has been marked as resolved.`,
    })
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Worker Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="assigned">Assigned Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {complaints.filter((c) => c.status === "IN_PROGRESS").length > 0 ? (
            complaints
              .filter((c) => c.status === "IN_PROGRESS")
              .map((complaint) => (
                <WorkerTaskCard key={complaint.id} complaint={complaint} onComplete={handleCompleteTask} />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">You don't have any assigned tasks.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {complaints.filter((c) => c.status === "RESOLVED").length > 0 ? (
            complaints
              .filter((c) => c.status === "RESOLVED")
              .map((complaint) => (
                <WorkerTaskCard key={complaint.id} complaint={complaint} onComplete={handleCompleteTask} />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">You haven't completed any tasks yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WorkerTaskCard({
  complaint,
  onComplete,
}: {
  complaint: any
  onComplete: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Task: Complaint {complaint.id}</CardTitle>
          <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
        </div>
        <CardDescription>Assigned on {new Date(complaint.updatedAt).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge variant="outline" className={getStatusColor(complaint.status)}>
              {complaint.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{complaint.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{complaint.contactEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Train Number</p>
            <p className="font-medium">{complaint.trainNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Coach & Seat</p>
            <p className="font-medium">
              {complaint.coachNumber} - {complaint.seatNumber}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Description</p>
          <p className="mt-1">{complaint.description}</p>

          {complaint.aiAnalysis && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
              <p className="text-xs font-medium text-blue-700">AI Analysis</p>
              <p className="text-xs text-gray-600">{complaint.aiAnalysis.summary}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {complaint.aiAnalysis.keywords.map((keyword: string, index: number) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {complaint.status === "IN_PROGRESS" && (
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onComplete(complaint.id)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Complete
            </Button>
          )}

          {complaint.status === "RESOLVED" && (
            <Button variant="outline" className="flex-1" disabled>
              Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

