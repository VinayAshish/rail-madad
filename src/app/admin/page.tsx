"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface Complaint {
  id: string
  type: string
  status: string
  description: string
  createdAt: string
  contact: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    fetchComplaints()
  }, [user, router])

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/admin/complaints")
      const data = await response.json()
      setComplaints(data.complaints)
    } catch (error) {
      console.error("Failed to fetch complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      fetchComplaints() // Refresh the list
    } catch (error) {
      console.error("Failed to update complaint:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complaint Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.id}</TableCell>
                  <TableCell>{complaint.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        complaint.status === "pending_review"
                          ? "secondary"
                          : complaint.status === "in_progress"
                            ? "default"
                            : "success"
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateComplaintStatus(complaint.id, "in_progress")}
                        disabled={complaint.status !== "pending_review"}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/complaints/${complaint.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

