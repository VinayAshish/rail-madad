"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/frontend/components/ui/button"
import { Card, CardContent } from "@/frontend/components/ui/card"
import { Input } from "@/frontend/components/ui/input"
import { Label } from "@/frontend/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/frontend/components/ui/radio-group"
import { Textarea } from "@/frontend/components/ui/textarea"
import { UploadArea } from "@/frontend/components/upload-area"
import { Progress } from "@/frontend/components/ui/progress"

interface ComplaintWizardProps {
  onSubmit: (formData: FormData) => Promise<void>
  defaultValues?: {
    pnrNumber?: string
    type?: string
    description?: string
    contact?: string
  }
}

export function ComplaintWizard({ onSubmit, defaultValues = {} }: ComplaintWizardProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    pnrNumber: defaultValues.pnrNumber || "",
    type: defaultValues.type || "cleanliness",
    description: defaultValues.description || "",
    contact: defaultValues.contact || "",
    files: [] as File[],
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append("pnrNumber", formData.pnrNumber)
      data.append("type", formData.type)
      data.append("description", formData.description)
      data.append("contact", formData.contact)
      data.append("status", "pending_review")

      formData.files.forEach((file) => {
        data.append("files", file)
      })

      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilesChange = (files: File[]) => {
    updateFormData("files", files)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>
            Step {step} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">PNR Information</h2>
                    <p className="text-muted-foreground">Enter your PNR number to begin the complaint process</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pnr">PNR Number</Label>
                      <Input
                        id="pnr"
                        value={formData.pnrNumber}
                        onChange={(e) => updateFormData("pnrNumber", e.target.value)}
                        placeholder="Enter your 10-digit PNR number"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleNext} disabled={!formData.pnrNumber} className="group">
                      Next
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Complaint Type</h2>
                    <p className="text-muted-foreground">Select the type of complaint you want to submit</p>
                  </div>

                  <div className="space-y-4">
                    <Label>Complaint Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => updateFormData("type", value)}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
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

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                    <Button onClick={handleNext} className="group">
                      Next
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Complaint Details</h2>
                    <p className="text-muted-foreground">Provide details about your complaint</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Complaint Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        placeholder="Describe your complaint in detail..."
                        className="min-h-[150px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Evidence (Optional)</Label>
                      <UploadArea onFilesChange={handleFilesChange} name="files" />
                      <p className="text-sm text-muted-foreground">
                        Upload photos, videos, or audio recordings related to your complaint
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                    <Button onClick={handleNext} disabled={!formData.description} className="group">
                      Next
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Contact Information</h2>
                    <p className="text-muted-foreground">Provide your contact details for updates</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => updateFormData("contact", e.target.value)}
                        placeholder="Enter your contact number"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll send updates about your complaint to this number
                      </p>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                      <h3 className="font-medium">Complaint Summary</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">PNR Number</div>
                        <div>{formData.pnrNumber}</div>

                        <div className="text-muted-foreground">Complaint Type</div>
                        <div>{formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}</div>

                        <div className="text-muted-foreground">Description</div>
                        <div className="truncate">{formData.description.substring(0, 50)}...</div>

                        <div className="text-muted-foreground">Attachments</div>
                        <div>{formData.files.length} files</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !formData.contact}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Submit Complaint
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

