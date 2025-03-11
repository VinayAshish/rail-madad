"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Input } from "@/frontend/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/frontend/components/ui/select"
import { useToast } from "@/frontend/components/ui/use-toast"

interface Complaint {
  id: string
  complaintId: string
  type: string
  status: string
  description: string
  createdAt: string
  priority: string
}

export function ComplaintList() {
  const router = useRouter()
  const { toast } = useToast()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending_review")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchComplaints()
  }, []) // Removed statusFilter from dependencies

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`/api/admin/complaints?status=${statusFilter}`)
      if (!response.ok) throw new Error("Failed to fetch complaints")

      const data = await response.json()
      setComplaints(data.complaints)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch complaints",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update complaint")

      toast({
        title: "Success",
        description: "Complaint status updated successfully",
      })

      fetchComplaints()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      })
    }
  }

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.complaintId.includes(searchQuery) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return <div>Loading complaints...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search complaints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredComplaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Complaint #{complaint.complaintId}</h3>
                      <Badge
                        variant={
                          complaint.priority === "high"
                            ? "destructive"
                            : complaint.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {complaint.priority || "Unassigned"}
                      </Badge>
                      <Badge
                        variant={
                          complaint.status === "pending_review"
                            ? "outline"
                            : complaint.status === "approved"
                              ? "secondary"
                              : complaint.status === "in_progress"
                                ? "default"
                                : "success"
                        }
                      >
                        {complaint.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm">Type: {complaint.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.description.substring(0, 150)}
                      {complaint.description.length > 150 ? "..." : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(complaint.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {complaint.status === "pending_review" && (
                      <>
                        <Button onClick={() => updateComplaintStatus(complaint.id, "approved")}>Approve</Button>
                        <Button variant="outline" onClick={() => updateComplaintStatus(complaint.id, "rejected")}>
                          Reject
                        </Button>
                      </>
                    )}
                    <Button variant="outline" onClick={() => router.push(`/admin/complaints/${complaint.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

