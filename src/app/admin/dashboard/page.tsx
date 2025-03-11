"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { ComplaintList } from "@/components/admin/complaint-list"
import { TrainSearch } from "@/components/admin/train-search"
import { ResourceAllocation } from "@/components/admin/resource-allocation"

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin/login")
      return
    }
    setLoading(false)
  }, [user, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage complaints and resource allocation</p>
        </div>
      </div>

      <Tabs defaultValue="complaints">
        <TabsList>
          <TabsTrigger value="complaints">Pending Complaints</TabsTrigger>
          <TabsTrigger value="trains">Train Status</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <ComplaintList />
        </TabsContent>

        <TabsContent value="trains">
          <TrainSearch />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceAllocation />
        </TabsContent>
      </Tabs>
    </div>
  )
}

