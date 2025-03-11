"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CheckCircle, X, UserCheck, Train } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getStatusColor, getPriorityColor } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Mock workers data
const WORKERS = [
  { id: "W001", name: "John Smith", email: "john@staffrmc.com", department: "Cleanliness", available: true },
  { id: "W002", name: "Jane Doe", email: "jane@staffrmc.com", department: "Food Services", available: true },
  { id: "W003", name: "Bob Johnson", email: "bob@staffrmc.com", department: "Technical", available: true },
  { id: "W004", name: "Alice Brown", email: "alice@staffrmc.com", department: "Customer Service", available: true },
]

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  })
  const { toast } = useToast()
  const [workers] = useState(WORKERS)

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin" && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      })
      router.push("/dashboard")
    } else if (!user && !isLoading) {
      router.push("/login")
    } else {
      // Get complaints from localStorage
      const storedComplaints = JSON.parse(localStorage.getItem("complaints") || "[]")
      setComplaints(storedComplaints)

      // Calculate stats
      const total = storedComplaints.length
      const pending = storedComplaints.filter((c: any) => c.status === "PENDING").length
      const inProgress = storedComplaints.filter((c: any) => c.status === "IN_PROGRESS").length
      const resolved = storedComplaints.filter((c: any) => c.status === "RESOLVED").length
      const rejected = storedComplaints.filter((c: any) => c.status === "REJECTED").length

      setStats({
        total,
        pending,
        inProgress,
        resolved,
        rejected,
      })

      setIsLoading(false)
    }
  }, [user, router, isLoading, toast])

  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const handleApprove = (id: string) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === id
        ? {
            ...complaint,
            status: "IN_PROGRESS",
            updatedAt: new Date().toISOString(),
          }
        : complaint,
    )

    setComplaints(updatedComplaints)
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints))

    // Update stats
    setStats({
      ...stats,
      pending: stats.pending - 1,
      inProgress: stats.inProgress + 1,
    })

    toast({
      title: "Complaint Approved",
      description: `Complaint ${id} has been approved and is now in progress.`,
    })
  }

  const handleResolve = (id: string) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === id
        ? {
            ...complaint,
            status: "RESOLVED",
            updatedAt: new Date().toISOString(),
          }
        : complaint,
    )

    setComplaints(updatedComplaints)
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints))

    // Update stats
    setStats({
      ...stats,
      inProgress: stats.inProgress - 1,
      resolved: stats.resolved + 1,
    })

    toast({
      title: "Complaint Resolved",
      description: `Complaint ${id} has been marked as resolved.`,
    })
  }

  const handleReject = (id: string) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === id
        ? {
            ...complaint,
            status: "REJECTED",
            updatedAt: new Date().toISOString(),
          }
        : complaint,
    )

    setComplaints(updatedComplaints)
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints))

    // Update stats
    setStats({
      ...stats,
      pending: stats.pending - 1,
      rejected: stats.rejected + 1,
    })

    toast({
      title: "Complaint Rejected",
      description: `Complaint ${id} has been rejected.`,
      variant: "destructive",
    })
  }

  const handleAssignWorker = (complaintId: string, workerId: string) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            assignedTo: workerId,
            updatedAt: new Date().toISOString(),
          }
        : complaint,
    )

    setComplaints(updatedComplaints)
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints))

    const worker = workers.find((w) => w.id === workerId)

    toast({
      title: "Worker Assigned",
      description: `Complaint ${complaintId} has been assigned to ${worker?.name}.`,
    })
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href="/admin/train-tracking">
              <Train className="mr-2 h-4 w-4" />
              Track Trains
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <AdminComplaintCard
                key={complaint.id}
                complaint={complaint}
                onApprove={handleApprove}
                onResolve={handleResolve}
                onReject={handleReject}
                onAssignWorker={handleAssignWorker}
                workers={workers}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No complaints have been submitted yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {complaints.filter((c) => c.status === "PENDING").length > 0 ? (
            complaints
              .filter((c) => c.status === "PENDING")
              .map((complaint) => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onApprove={handleApprove}
                  onResolve={handleResolve}
                  onReject={handleReject}
                  onAssignWorker={handleAssignWorker}
                  workers={workers}
                />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No pending complaints.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {complaints.filter((c) => c.status === "IN_PROGRESS").length > 0 ? (
            complaints
              .filter((c) => c.status === "IN_PROGRESS")
              .map((complaint) => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onApprove={handleApprove}
                  onResolve={handleResolve}
                  onReject={handleReject}
                  onAssignWorker={handleAssignWorker}
                  workers={workers}
                />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No complaints in progress.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {complaints.filter((c) => c.status === "RESOLVED").length > 0 ? (
            complaints
              .filter((c) => c.status === "RESOLVED")
              .map((complaint) => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onApprove={handleApprove}
                  onResolve={handleResolve}
                  onReject={handleReject}
                  onAssignWorker={handleAssignWorker}
                  workers={workers}
                />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No resolved complaints.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {complaints.filter((c) => c.status === "REJECTED").length > 0 ? (
            complaints
              .filter((c) => c.status === "REJECTED")
              .map((complaint) => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onApprove={handleApprove}
                  onResolve={handleResolve}
                  onReject={handleReject}
                  onAssignWorker={handleAssignWorker}
                  workers={workers}
                />
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No rejected complaints.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AdminComplaintCard({
  complaint,
  onApprove,
  onResolve,
  onReject,
  onAssignWorker,
  workers,
}: {
  complaint: any
  onApprove: (id: string) => void
  onResolve: (id: string) => void
  onReject: (id: string) => void
  onAssignWorker: (complaintId: string, workerId: string) => void
  workers: any[]
}) {
  const [selectedWorker, setSelectedWorker] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Complaint {complaint.id}</CardTitle>
          <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
        </div>
        <CardDescription>Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src="/image.jpg"></img>
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
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <p className="font-medium">{complaint.assignedTo || "Not assigned"}</p>
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
          {complaint.status === "PENDING" && (
            <>
              <Button
                variant="default"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => onApprove(complaint.id)}
              >
                Approve
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => onReject(complaint.id)}>
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}

          {complaint.status === "IN_PROGRESS" && (
            <>
              <Button
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => onResolve(complaint.id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Resolved
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Assign Worker
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Worker</DialogTitle>
                    <DialogDescription>Select a worker to assign to this complaint.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="worker">Select Worker</Label>
                    <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                      <SelectTrigger id="worker">
                        <SelectValue placeholder="Select a worker" />
                      </SelectTrigger>
                      <SelectContent>
                        {workers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {worker.name} - {worker.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedWorker) {
                          onAssignWorker(complaint.id, selectedWorker)
                          setDialogOpen(false)
                        }
                      }}
                      disabled={!selectedWorker}
                    >
                      Assign
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {(complaint.status === "RESOLVED" || complaint.status === "REJECTED") && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => (window.location.href = `/track?id=${complaint.id}`)}
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

