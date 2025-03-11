"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/frontend/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card"
import { Input } from "@/frontend/components/ui/input"
import { Label } from "@/frontend/components/ui/label"
import { Textarea } from "@/frontend/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/frontend/components/ui/radio-group"
import { useToast } from "@/frontend/components/ui/use-toast"
import { UploadArea } from "@/frontend/components/upload-area"
import { useAuth } from "@/frontend/contexts/auth-context"

export default function SubmitComplaint() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add status to indicate it needs admin review
      formData.append("status", "pending_review")

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pnr">PNR Number</Label>
              <Input id="pnr" name="pnrNumber" required placeholder="10-digit PNR number" />
            </div>

            <div className="space-y-2">
              <Label>Complaint Type</Label>
              <RadioGroup defaultValue="cleanliness" name="type" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="cleanliness" id="cleanliness" />
                  <Label htmlFor="cleanliness" className="cursor-pointer">
                    Cleanliness
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="food" id="food" />
                  <Label htmlFor="food" className="cursor-pointer">
                    Food & Catering
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff" className="cursor-pointer">
                    Staff Behavior
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="technical" id="technical" />
                  <Label htmlFor="technical" className="cursor-pointer">
                    Technical Issues
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Please describe your complaint in detail"
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <UploadArea name="files" />
              <p className="text-sm text-muted-foreground">Upload any relevant photos or documents (optional)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                defaultValue={user?.phoneNumber || ""}
                required
                placeholder="Your contact number"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

