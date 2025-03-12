"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CheckCircle, X, UserCheck, Train, Search } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

// Mock trains data
const TRAINS = [
  { number: "12301", name: "Howrah Rajdhani" },
  { number: "12302", name: "Delhi Rajdhani" },
  { number: "12309", name: "Rajendra Nagar Patna Rajdhani" },
  { number: "12951", name: "Mumbai Rajdhani" },
  { number: "12303", name: "Poorva Express" },
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
  const [workers, setWorkers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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

      // Get workers from localStorage
      const storedWorkers = JSON.parse(localStorage.getItem("workers") || "[]")
      setWorkers(storedWorkers)

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

    // Send notification to user (simulated)
    const complaint = complaints.find((c) => c.id === id)
    if (complaint) {
      console.log(
        `SMS notification would be sent to user for complaint ${id}: Your complaint has been approved and is now in progress.`,
      )
      console.log(`Email notification would be sent to ${complaint.contactEmail} for complaint ${id}`)
    }

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

    // Send notification to user (simulated)
    const complaint = complaints.find((c) => c.id === id)
    if (complaint) {
      console.log(`SMS notification would be sent to user for complaint ${id}: Your complaint has been resolved.`)
      console.log(`Email notification would be sent to ${complaint.contactEmail} for complaint ${id}`)
    }

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

    // Send notification to user (simulated)
    const complaint = complaints.find((c) => c.id === id)
    if (complaint) {
      console.log(`SMS notification would be sent to user for complaint ${id}: Your complaint has been rejected.`)
      console.log(`Email notification would be sent to ${complaint.contactEmail} for complaint ${id}`)
    }

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

    // Send notification to worker (simulated)
    if (worker) {
      console.log(`SMS notification would be sent to worker ${worker.name}: A new complaint has been assigned to you.`)
      console.log(`Email notification would be sent to ${worker.email} for complaint ${complaintId}`)
    }

    toast({
      title: "Worker Assigned",
      description: `Complaint ${complaintId} has been assigned to ${worker?.name}.`,
    })
  }

  const getAvailableWorkers = (trainNumber: string) => {
    // Filter workers who are online and either not assigned to a train or assigned to the same train
    return workers.filter(
      (worker) => worker.isOnline && (worker.currentTrain === "" || worker.currentTrain === trainNumber),
    )
  }

  const filteredComplaints = searchTerm
    ? complaints.filter(
        (c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : complaints

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-10"
    >
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

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search complaints by ID, description, category, or train number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <motion.div
                key={complaint.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AdminComplaintCard
                  complaint={complaint}
                  onApprove={handleApprove}
                  onResolve={handleResolve}
                  onReject={handleReject}
                  onAssignWorker={handleAssignWorker}
                  workers={workers}
                  trains={TRAINS}
                  getAvailableWorkers={getAvailableWorkers}
                />
              </motion.div>
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
          {filteredComplaints.filter((c) => c.status === "PENDING").length > 0 ? (
            filteredComplaints
              .filter((c) => c.status === "PENDING")
              .map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminComplaintCard
                    complaint={complaint}
                    onApprove={handleApprove}
                    onResolve={handleResolve}
                    onReject={handleReject}
                    onAssignWorker={handleAssignWorker}
                    workers={workers}
                    trains={TRAINS}
                    getAvailableWorkers={getAvailableWorkers}
                  />
                </motion.div>
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
          {filteredComplaints.filter((c) => c.status === "IN_PROGRESS").length > 0 ? (
            filteredComplaints
              .filter((c) => c.status === "IN_PROGRESS")
              .map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminComplaintCard
                    complaint={complaint}
                    onApprove={handleApprove}
                    onResolve={handleResolve}
                    onReject={handleReject}
                    onAssignWorker={handleAssignWorker}
                    workers={workers}
                    trains={TRAINS}
                    getAvailableWorkers={getAvailableWorkers}
                  />
                </motion.div>
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
          {filteredComplaints.filter((c) => c.status === "RESOLVED").length > 0 ? (
            filteredComplaints
              .filter((c) => c.status === "RESOLVED")
              .map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminComplaintCard
                    complaint={complaint}
                    onApprove={handleApprove}
                    onResolve={handleResolve}
                    onReject={handleReject}
                    onAssignWorker={handleAssignWorker}
                    workers={workers}
                    trains={TRAINS}
                    getAvailableWorkers={getAvailableWorkers}
                  />
                </motion.div>
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
          {filteredComplaints.filter((c) => c.status === "REJECTED").length > 0 ? (
            filteredComplaints
              .filter((c) => c.status === "REJECTED")
              .map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminComplaintCard
                    complaint={complaint}
                    onApprove={handleApprove}
                    onResolve={handleResolve}
                    onReject={handleReject}
                    onAssignWorker={handleAssignWorker}
                    workers={workers}
                    trains={TRAINS}
                    getAvailableWorkers={getAvailableWorkers}
                  />
                </motion.div>
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
    </motion.div>
  )
}

function AdminComplaintCard({
  complaint,
  onApprove,
  onResolve,
  onReject,
  onAssignWorker,
  workers,
  trains,
  getAvailableWorkers,
}: {
  complaint: any
  onApprove: (id: string) => void
  onResolve: (id: string) => void
  onReject: (id: string) => void
  onAssignWorker: (complaintId: string, workerId: string) => void
  workers: any[]
  trains: any[]
  getAvailableWorkers: (trainNumber: string) => any[]
}) {
  const [selectedWorker, setSelectedWorker] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTrain, setSelectedTrain] = useState(complaint.trainNumber || "")
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([])

  useEffect(() => {
    if (selectedTrain) {
      setAvailableWorkers(getAvailableWorkers(selectedTrain))
    } else {
      setAvailableWorkers([])
    }
  }, [selectedTrain, getAvailableWorkers])

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Complaint {complaint.id}</CardTitle>
          <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
        </div>
        <CardDescription>Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</CardDescription>
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
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <p className="font-medium">
              {complaint.assignedTo
                ? workers.find((w) => w.id === complaint.assignedTo)?.name || complaint.assignedTo
                : "Not assigned"}
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
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="train">Train Number</Label>
                      <Select value={selectedTrain} onValueChange={setSelectedTrain}>
                        <SelectTrigger id="train">
                          <SelectValue placeholder="Select a train" />
                        </SelectTrigger>
                        <SelectContent>
                          {trains.map((train) => (
                            <SelectItem key={train.number} value={train.number}>
                              {train.number} - {train.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker">Select Worker</Label>
                      <Select value={selectedWorker} onValueChange={setSelectedWorker} disabled={!selectedTrain}>
                        <SelectTrigger id="worker">
                          <SelectValue placeholder={selectedTrain ? "Select a worker" : "Select a train first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableWorkers.length > 0 ? (
                            availableWorkers.map((worker) => (
                              <SelectItem key={worker.id} value={worker.id}>
                                {worker.name} {worker.isOnline ? "(Online)" : "(Offline)"}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No available workers for this train
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTrain && availableWorkers.length === 0 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                        No workers are currently available for train {selectedTrain}. Try selecting a different train or
                        check back later.
                      </div>
                    )}
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

