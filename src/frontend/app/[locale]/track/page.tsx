"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Clock, FileText, Loader2, Search, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/frontend/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Input } from "@/frontend/components/ui/input"
import { Label } from "@/frontend/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs"
import { Badge } from "@/frontend/components/ui/badge"
import { Progress } from "@/frontend/components/ui/progress"
import { Skeleton } from "@/frontend/components/ui/skeleton"

interface ComplaintData {
  id: string
  complaintId: string
  status: string
  category: string
  priority: string
  submittedOn: string
  lastUpdated: string
  department: string
  progress: number
  timeline: {
    date: string
    status: string
    description: string
  }[]
}

export default function TrackComplaint() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""

  const [complaintId, setComplaintId] = useState(initialId)
  const [searchId, setSearchId] = useState(initialId)
  const [isLoading, setIsLoading] = useState(false)
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialId) {
      fetchComplaintData(initialId)
    }
  }, [initialId])

  const fetchComplaintData = async (id: string) => {
    if (!id) {
      setError("Please enter a complaint ID")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/complaints/${id}`)

      if (!response.ok) {
        throw new Error("Complaint not found")
      }

      const data = await response.json()
      setComplaintData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setComplaintData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchComplaintData(searchId)
    setComplaintId(searchId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge variant="outline">Pending Review</Badge>
      case "approved":
        return <Badge variant="secondary">Approved</Badge>
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>
      case "resolved":
        return <Badge variant="success">Resolved</Badge>
      case "closed":
        return <Badge variant="success">Closed</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "High"
      case "medium":
        return "Medium"
      case "low":
        return "Low"
      default:
        return priority
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Track Your Complaint</CardTitle>
            <CardDescription>Enter your complaint ID to track its status</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="complaint-id">Complaint ID</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="complaint-id"
                      placeholder="Enter your complaint ID"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </form>

            {isLoading ? (
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              </div>
            ) : complaintData ? (
              <div className="mt-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Complaint #{complaintData.complaintId}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {formatDate(complaintData.submittedOn)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(complaintData.status)}
                    <Badge
                      variant={
                        complaintData.priority === "high"
                          ? "destructive"
                          : complaintData.priority === "medium"
                            ? "default"
                            : "outline"
                      }
                    >
                      {getPriorityText(complaintData.priority)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{complaintData.progress}%</span>
                  </div>
                  <Progress value={complaintData.progress} className="h-2" />
                </div>

                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-sm">{complaintData.category}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Priority</p>
                        <p className="text-sm">{getPriorityText(complaintData.priority)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm">{complaintData.department}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm">{formatDate(complaintData.lastUpdated)}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="pt-4">
                    <div className="space-y-4">
                      {complaintData.timeline.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground">
                              {index === 0 ? (
                                <FileText className="h-4 w-4" />
                              ) : index === complaintData.timeline.length - 1 ? (
                                <Clock className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </div>
                            {index < complaintData.timeline.length - 1 && (
                              <div className="w-0.5 bg-muted h-full mt-1"></div>
                            )}
                          </div>
                          <div className="space-y-1 pb-4">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                            <p className="text-sm">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="ai-analysis" className="pt-4">
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-2">AI Categorization</h4>
                        <p className="text-sm">
                          Our AI system has categorized this complaint as "{complaintData.category.toLowerCase()}" with
                          a {getPriorityText(complaintData.priority).toLowerCase()} priority level.
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-2">Similar Issues</h4>
                        <p className="text-sm">
                          We've identified 5 similar complaints in the past month. This helps us identify recurring
                          issues and improve our services.
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-2">Estimated Resolution Time</h4>
                        <p className="text-sm">
                          Based on historical data, complaints of this type and priority are typically resolved within
                          3-5 days.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : null}
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

