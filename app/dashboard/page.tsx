"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { getStatusColor, getPriorityColor } from "@/lib/utils"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
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
      const critical = storedComplaints.filter((c: any) => c.priority === "CRITICAL").length
      const high = storedComplaints.filter((c: any) => c.priority === "HIGH").length
      const medium = storedComplaints.filter((c: any) => c.priority === "MEDIUM").length
      const low = storedComplaints.filter((c: any) => c.priority === "LOW").length

      setStats({
        total,
        pending,
        inProgress,
        resolved,
        critical,
        high,
        medium,
        low,
      })

      setIsLoading(false)
    }
  }, [user, router, isLoading])

  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
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
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Complaint Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Pending</span>
                <div className="flex items-center">
                  <div className="w-40 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>In Progress</span>
                <div className="flex items-center">
                  <div className="w-40 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${stats.total ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{stats.total ? Math.round((stats.inProgress / stats.total) * 100) : 0}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Resolved</span>
                <div className="flex items-center">
                  <div className="w-40 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${stats.total ? (stats.resolved / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Complaint Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Critical
                </span>
                <span>{stats.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  High
                </span>
                <span>{stats.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Medium
                </span>
                <span>{stats.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Low
                </span>
                <span>{stats.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              AI Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Categorization Accuracy</span>
                <span>94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Priority Assignment</span>
                <span>91%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Resolution Time</span>
                <span>-15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Customer Satisfaction</span>
                <span>+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">You haven't submitted any complaints yet.</p>
                <Button asChild>
                  <a href="/submit">Submit a Complaint</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {complaints.filter((c) => c.status !== "RESOLVED").length > 0 ? (
            complaints
              .filter((c) => c.status !== "RESOLVED")
              .map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">You don't have any active complaints.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {complaints.filter((c) => c.status === "RESOLVED").length > 0 ? (
            complaints
              .filter((c) => c.status === "RESOLVED")
              .map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">You don't have any resolved complaints.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ComplaintCard({ complaint }: { complaint: any }) {
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
        <div className="grid grid-cols-2 gap-4 mb-4">
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
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => (window.location.href = `/track?id=${complaint.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

