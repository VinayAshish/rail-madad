"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface Staff {
  id: string
  name: string
  station: string
  department: string
  available: boolean
}

interface Assignment {
  complaintId: string
  staffId: string
  status: string
}

export function ResourceAllocation() {
  const { toast } = useToast()
  const [staff, setStaff] = useState<Staff[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaffAndAssignments()
  }, [])

  const fetchStaffAndAssignments = async () => {
    try {
      const [staffRes, assignmentsRes] = await Promise.all([fetch("/api/admin/staff"), fetch("/api/admin/assignments")])

      const staffData = await staffRes.json()
      const assignmentsData = await assignmentsRes.json()

      setStaff(staffData)
      setAssignments(assignmentsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch resource data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const assignStaff = async (complaintId: string, staffId: string) => {
    try {
      const response = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaintId, staffId }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign staff")
      }

      fetchStaffAndAssignments()
      toast({
        title: "Success",
        description: "Staff assigned successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign staff",
        variant: "destructive",
      })
    }
  }

  const updateAssignmentStatus = async (complaintId: string, status: string) => {
    try {
      await fetch(`/api/admin/assignments/${complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      fetchStaffAndAssignments()
      toast({ title: "Success", description: "Assignment status updated" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-medium mb-4">Available Staff</h3>
          <div className="space-y-4">
            {staff
              .filter((s) => s.available)
              .map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {s.department} - {s.station}
                        </p>
                      </div>
                      <Button size="sm">Assign</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Current Assignments</h3>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.complaintId}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Complaint #{assignment.complaintId}</p>
                      <p className="text-sm text-muted-foreground">
                        Assigned to: {staff.find((s) => s.id === assignment.staffId)?.name}
                      </p>
                    </div>
                    <Select
                      value={assignment.status}
                      onValueChange={(value) => updateAssignmentStatus(assignment.complaintId, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

