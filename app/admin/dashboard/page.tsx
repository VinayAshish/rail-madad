"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { PriorityLevel, ComplaintStatus } from "@/lib/types"

interface Category {
  _id: string
  name: string
  priority: PriorityLevel
}

interface Complaint {
  _id: string
  complaintId: string
  categoryId: Category | string
  status: ComplaintStatus
  priority: PriorityLevel
  description: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    fetchData()
  }, [user, router])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch categories
      const categoriesRes = await fetch("/api/categories")
      if (!categoriesRes.ok) throw new Error("Failed to fetch categories")
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData.categories || [])

      // Fetch complaints
      const complaintsRes = await fetch("/api/complaints?limit=50")
      if (!complaintsRes.ok) throw new Error("Failed to fetch complaints")
      const complaintsData = await complaintsRes.json()
      setComplaints(complaintsData.complaints || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update complaint")

      // Refresh complaints
      fetchData()

      toast({
        title: "Success",
        description: "Complaint status updated successfully",
      })
    } catch (error) {
      console.error("Error updating complaint:", error)
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      })
    }
  }

  const getCategoryName = (complaint: Complaint) => {
    if (!complaint.categoryId) return "Uncategorized"

    if (typeof complaint.categoryId === "string") {
      const category = categories.find((c) => c._id === complaint.categoryId)
      return category ? category.name : "Unknown"
    }

    return complaint.categoryId.name || "Unknown"
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter

    const matchesCategory =
      categoryFilter === "all" ||
      (typeof complaint.categoryId === "string"
        ? complaint.categoryId === categoryFilter
        : complaint.categoryId?._id === categoryFilter)

    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter

    const matchesSearch =
      !searchQuery ||
      complaint.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesCategory && matchesPriority && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ComplaintStatus.PENDING_REVIEW:
        return <Badge variant="outline">Pending Review</Badge>
      case ComplaintStatus.APPROVED:
        return <Badge variant="secondary">Approved</Badge>
      case ComplaintStatus.IN_PROGRESS:
        return <Badge variant="default">In Progress</Badge>
      case ComplaintStatus.RESOLVED:
        return <Badge variant="success">Resolved</Badge>
      case ComplaintStatus.CLOSED:
        return <Badge variant="success">Closed</Badge>
      case ComplaintStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.CRITICAL:
        return <Badge variant="destructive">Critical</Badge>
      case PriorityLevel.HIGH:
        return <Badge variant="destructive">High</Badge>
      case PriorityLevel.MEDIUM:
        return <Badge variant="secondary">Medium</Badge>
      case PriorityLevel.LOW:
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage complaints and monitor system performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchData}>Refresh Data</Button>
          <Button variant="outline" onClick={() => router.push("/admin/categories")}>
            Manage Categories
          </Button>
        </div>
      </div>

      <Tabs defaultValue="complaints">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={ComplaintStatus.PENDING_REVIEW}>Pending Review</SelectItem>
                      <SelectItem value={ComplaintStatus.APPROVED}>Approved</SelectItem>
                      <SelectItem value={ComplaintStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={ComplaintStatus.RESOLVED}>Resolved</SelectItem>
                      <SelectItem value={ComplaintStatus.CLOSED}>Closed</SelectItem>
                      <SelectItem value={ComplaintStatus.REJECTED}>Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value={PriorityLevel.CRITICAL}>Critical</SelectItem>
                      <SelectItem value={PriorityLevel.HIGH}>High</SelectItem>
                      <SelectItem value={PriorityLevel.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={PriorityLevel.LOW}>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Complaint ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No complaints found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredComplaints.map((complaint) => (
                        <TableRow key={complaint._id}>
                          <TableCell className="font-medium">{complaint.complaintId}</TableCell>
                          <TableCell>{getCategoryName(complaint)}</TableCell>
                          <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/complaints/${complaint._id}`)}
                            >
                              View
                            </Button>
                            {complaint.status === ComplaintStatus.PENDING_REVIEW && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateComplaintStatus(complaint._id, ComplaintStatus.APPROVED)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateComplaintStatus(complaint._id, ComplaintStatus.REJECTED)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Complaints by Category</h3>
                  <div className="h-80 border rounded-md p-4">
                    {/* Placeholder for chart */}
                    <div className="h-full flex items-center justify-center bg-muted/20">
                      <p className="text-muted-foreground">Category distribution chart</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Complaints by Priority</h3>
                  <div className="h-80 border rounded-md p-4">
                    {/* Placeholder for chart */}
                    <div className="h-full flex items-center justify-center bg-muted/20">
                      <p className="text-muted-foreground">Priority distribution chart</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Resolution Time by Category</h3>
                  <div className="h-80 border rounded-md p-4">
                    {/* Placeholder for chart */}
                    <div className="h-full flex items-center justify-center bg-muted/20">
                      <p className="text-muted-foreground">Resolution time chart</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Complaint Trend</h3>
                  <div className="h-80 border rounded-md p-4">
                    {/* Placeholder for chart */}
                    <div className="h-full flex items-center justify-center bg-muted/20">
                      <p className="text-muted-foreground">Complaint trend over time</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Category Management</h3>
                  <Button onClick={() => router.push("/admin/categories")}>Manage Complaint Categories</Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">User Management</h3>
                  <Button onClick={() => router.push("/admin/users")}>Manage Users</Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">System Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">AI Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure AI model settings for complaint analysis
                        </p>
                        <Button variant="outline">Configure AI</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Notification Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure SMS and email notification settings
                        </p>
                        <Button variant="outline">Configure Notifications</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

