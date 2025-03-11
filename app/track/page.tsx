"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { getStatusColor, getPriorityColor } from "@/lib/utils"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  complaintId: z.string().min(6, {
    message: "Complaint ID must be at least 6 characters.",
  }),
})

export default function TrackComplaintPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [complaint, setComplaint] = useState<any>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const complaintId = searchParams.get("id")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complaintId: complaintId || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Get complaints from localStorage
      const complaints = JSON.parse(localStorage.getItem("complaints") || "[]")

      // Find the complaint with the given ID
      const foundComplaint = complaints.find((c: any) => c.id === values.complaintId)

      if (!foundComplaint) {
        throw new Error("Complaint not found")
      }

      setComplaint(foundComplaint)
    } catch (error) {
      console.error("Error tracking complaint:", error)
      toast({
        title: "Tracking Failed",
        description: "We couldn't find a complaint with that ID. Please check and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If complaint ID is provided in URL, fetch it automatically
  useEffect(() => {
    if (complaintId) {
      form.setValue("complaintId", complaintId)
      onSubmit({ complaintId })
    }
  }, [complaintId, form])

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Track Your Complaint</CardTitle>
          <CardDescription>Enter your complaint ID to check its current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="complaintId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complaint ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your complaint ID (e.g., RM123456)" {...field} />
                    </FormControl>
                    <FormDescription>The ID you received when you submitted your complaint.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  "Track Complaint"
                )}
              </Button>
            </form>
          </Form>

          {complaint && (
            <div className="mt-8 space-y-4 border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Complaint {complaint.id}</h3>
                <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  {complaint.aiAnalysis && <TabsTrigger value="analysis">AI Analysis</TabsTrigger>}
                </TabsList>

                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <p className="text-sm text-gray-500">Journey Stage</p>
                      <p className="font-medium capitalize">{complaint.journeyStage} Journey</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{complaint.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{new Date(complaint.updatedAt).toLocaleDateString()}</p>
                    </div>
                    {complaint.assignedTo && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="font-medium">Worker ID: {complaint.assignedTo}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{complaint.description}</p>
                  </div>

                  {complaint.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Attached Image</p>
                      <div className="rounded-md overflow-hidden max-w-sm">
                        <Image
                          src={complaint.imageUrl || "/placeholder.svg"}
                          alt="Complaint evidence"
                          width={400}
                          height={300}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                      <div>
                        <p className="font-medium">Complaint Received</p>
                        <p className="text-sm text-gray-500">{new Date(complaint.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {complaint.status !== "PENDING" && (
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                        <div>
                          <p className="font-medium">
                            {complaint.status === "IN_PROGRESS"
                              ? "Approved and In Progress"
                              : complaint.status === "RESOLVED"
                                ? "Complaint Resolved"
                                : "Complaint Rejected"}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(complaint.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {complaint.assignedTo && (
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                        <div>
                          <p className="font-medium">Assigned to Worker</p>
                          <p className="text-sm text-gray-500">Worker ID: {complaint.assignedTo}</p>
                        </div>
                      </div>
                    )}

                    {complaint.status === "RESOLVED" && (
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-600 mt-2"></div>
                        <div>
                          <p className="font-medium">Issue Resolved</p>
                          <p className="text-sm text-gray-500">{new Date(complaint.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {complaint.aiAnalysis && (
                  <TabsContent value="analysis">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Suggested Category</p>
                            <p className="font-medium">{complaint.aiAnalysis.category}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">AI Priority Rating</p>
                            <p className="font-medium">{complaint.aiAnalysis.priority}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Summary</p>
                            <p className="font-medium">{complaint.aiAnalysis.summary}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Estimated Resolution Time</p>
                            <p className="font-medium">{complaint.aiAnalysis.estimatedResolutionTime}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Keywords</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {complaint.aiAnalysis.keywords.map((keyword: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

