"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form } from "@/components/forms/complaint-form"
import { useToast } from "@/components/ui/use-toast"

export default function SubmitComplaint() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit complaint")
      }

      const data = await response.json()
      toast({
        title: "Complaint Submitted",
        description: `Your complaint ID is ${data.complaintId}. Please save this for tracking.`,
      })
      router.push(`/track?id=${data.complaintId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Complaint</CardTitle>
          <CardDescription>
            Please provide details about your complaint. An admin will review it shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  )
}

