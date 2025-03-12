"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CheckCircle, Eye, Wifi, WifiOff, Train } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getStatusColor, getPriorityColor } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"

// Mock train data
const TRAINS = [
  { number: "12301", name: "Howrah Rajdhani" },
  { number: "12302", name: "Delhi Rajdhani" },
  { number: "12309", name: "Rajendra Nagar Patna Rajdhani" },
  { number: "12951", name: "Mumbai Rajdhani" },
  { number: "12303", name: "Poorva Express" },
]

export default function WorkerDashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    assigned: 0,
    completed: 0,
  })
  const [isOnline, setIsOnline] = useState(true)
  const [currentTrain, setCurrentTrain] = useState("")
  const [complaintDetails, setComplaintDetails] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
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

      // Get worker status from localStorage
      const workerStatus = JSON.parse(
        localStorage.getItem(`worker_status_${user?.id}`) || '{"isOnline": true, "currentTrain": ""}',
      )
      setIsOnline(workerStatus.isOnline)
      setCurrentTrain(workerStatus.currentTrain)

      setIsLoading(false)
    }
  }, [user, router, isLoading, toast])

  // Update worker status in localStorage
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`worker_status_${user.id}`, JSON.stringify({ isOnline, currentTrain }))

      // Update workers list
      const workers = JSON.parse(localStorage.getItem("workers") || "[]")
      const workerIndex = workers.findIndex((w: any) => w.id === user.id)

      if (workerIndex >= 0) {
        workers[workerIndex] = {
          ...workers[workerIndex],
          isOnline,
          currentTrain,
          lastActive: new Date().toISOString(),
        }
      } else {
        workers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          department: "General",
          isOnline,
          currentTrain,
          lastActive: new Date().toISOString(),
        })
      }

      localStorage.setItem("workers", JSON.stringify(workers))
    }
  }, [isOnline, currentTrain, user, isLoading])

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
            completedBy: user.id,
            completedAt: new Date().toISOString(),
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
              completedBy: user.id,
              completedAt: new Date().toISOString(),
            }
          : complaint,
      ),
    )

    // Update stats
    setStats({
      assigned: stats.assigned - 1,
      completed: stats.completed + 1,
    })

    // Send notification to user (simulated)
    const complaint = allComplaints.find((c: any) => c.id === id)
    if (complaint) {
      console.log(`SMS notification would be sent to user for complaint ${id}: Your complaint has been resolved.`)
      console.log(`Email notification would be sent to ${complaint.contactEmail} for complaint ${id}`)
    }

    toast({
      title: "Task Completed",
      description: `Complaint ${id} has been marked as resolved.`,
    })
  }

  const handleStatusChange = (value: boolean) => {
    setIsOnline(value)
    toast({
      title: value ? "You are now online" : "You are now offline",
      description: value
        ? "You can now receive new task assignments."
        : "You will not receive new task assignments while offline.",
    })
  }

  const handleTrainChange = (value: string) => {
    setCurrentTrain(value)
    toast({
      title: "Train Updated",
      description: `You are now assigned to train ${value}.`,
    })
  }

  const viewComplaintDetails = (complaint: any) => {
    setComplaintDetails(complaint)
    setShowDetailsDialog(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-10"
    >
      <h1 className="text-3xl font-bold mb-6">Worker Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
                <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
              </div>
              <Switch checked={isOnline} onCheckedChange={handleStatusChange} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Assignment</CardTitle>
          <CardDescription>Select the train you are currently working on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="train">Train Number</Label>
              <Select value={currentTrain} onValueChange={handleTrainChange}>
                <SelectTrigger id="train">
                  <SelectValue placeholder="Select a train" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOT_ASSIGNED">Not assigned to a train</SelectItem>
                  {TRAINS.map((train) => (
                    <SelectItem key={train.number} value={train.number}>
                      {train.number} - {train.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              {currentTrain && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Train className="h-5 w-5" />
                  <span>
                    Currently assigned to: {currentTrain} - {TRAINS.find((t) => t.number === currentTrain)?.name || ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
                <motion.div
                  key={complaint.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <WorkerTaskCard
                    complaint={complaint}
                    onComplete={handleCompleteTask}
                    onViewDetails={viewComplaintDetails}
                  />
                </motion.div>
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
                <motion.div
                  key={complaint.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <WorkerTaskCard
                    complaint={complaint}
                    onComplete={handleCompleteTask}
                    onViewDetails={viewComplaintDetails}
                  />
                </motion.div>
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

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>Detailed information about complaint {complaintDetails?.id}</DialogDescription>
          </DialogHeader>

          {complaintDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant="outline" className={getStatusColor(complaintDetails.status)}>
                    {complaintDetails.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <Badge className={getPriorityColor(complaintDetails.priority)}>{complaintDetails.priority}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{complaintDetails.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium">{new Date(complaintDetails.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Train Number</p>
                  <p className="font-medium">{complaintDetails.trainNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coach & Seat</p>
                  <p className="font-medium">
                    {complaintDetails.coachNumber} - {complaintDetails.seatNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{complaintDetails.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Journey Stage</p>
                  <p className="font-medium capitalize">{complaintDetails.journeyStage} Journey</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{complaintDetails.description}</p>
              </div>

              {complaintDetails.aiAnalysis && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="font-medium text-blue-700 mb-1">AI Analysis</p>
                  <p className="text-sm">{complaintDetails.aiAnalysis.summary}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {complaintDetails.aiAnalysis.keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-100">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {complaintDetails?.status === "IN_PROGRESS" && (
              <Button
                onClick={() => {
                  handleCompleteTask(complaintDetails.id)
                  setShowDetailsDialog(false)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Complete
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function WorkerTaskCard({
  complaint,
  onComplete,
  onViewDetails,
}: {
  complaint: any
  onComplete: (id: string) => void
  onViewDetails: (complaint: any) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
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
            <p className="text-sm text-gray-500">Train Number</p>
            <p className="font-medium">{complaint.trainNumber}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Description</p>
          <p className="mt-1 line-clamp-2">{complaint.description}</p>
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
              Completed on {new Date(complaint.updatedAt).toLocaleDateString()}
            </Button>
          )}

          <Button variant="outline" className="flex-1" onClick={() => onViewDetails(complaint)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

