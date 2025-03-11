"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { useToast } from "@/frontend/components/ui/use-toast"
import { useAuth } from "@/frontend/contexts/auth-context"
import { ComplaintWizard } from "@/frontend/components/forms/complaint-wizard"
import Link from "next/link"

export default function SubmitComplaint() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const [complaintId, setComplaintId] = useState("")

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit complaint")
      }

      const data = await response.json()
      setComplaintId(data.complaintId)
      setIsSuccess(true)

      toast({
        title: "Success",
        description: `Your complaint has been submitted successfully. Complaint ID: ${data.complaintId}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  if (isSuccess) {
    return (
      <div className="container py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Complaint Submitted Successfully</CardTitle>
              <CardDescription>Your complaint has been received and is being processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="font-medium">Complaint ID: {complaintId}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please save this ID for tracking your complaint status
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">What happens next?</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Our AI system is analyzing your complaint to categorize and prioritize it</li>
                  <li>Your complaint will be automatically routed to the appropriate department</li>
                  <li>You will receive real-time updates on the status of your complaint</li>
                  <li>You can track your complaint status using the Complaint ID provided</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button asChild>
                  <Link href={`/track?id=${complaintId}`}>Track Your Complaint</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Submit a Complaint</h1>
          <p className="text-muted-foreground mt-2">Fill in the details below to submit your complaint</p>
        </div>

        <ComplaintWizard
          onSubmit={handleSubmit}
          defaultValues={{
            contact: user?.phoneNumber || "",
          }}
        />
      </div>
    </div>
  )
}

