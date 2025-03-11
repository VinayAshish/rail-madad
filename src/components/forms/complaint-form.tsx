"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadArea } from "@/components/upload-area"

const COMPLAINT_TYPES = [
  { value: "cleanliness", label: "Cleanliness" },
  { value: "food", label: "Food & Catering" },
  { value: "staff", label: "Staff Behavior" },
  { value: "technical", label: "Technical Issues" },
  { value: "other", label: "Other" },
]

interface FormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isSubmitting: boolean
}

export function Form({ onSubmit, isSubmitting }: FormProps) {
  const [type, setType] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("status", "pending_review") // Initial status requiring admin review
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pnr">PNR Number</Label>
        <Input id="pnr" name="pnr" required placeholder="10-digit PNR number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Complaint Type</Label>
        <Select name="type" value={type} onValueChange={setType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select type of complaint" />
          </SelectTrigger>
          <SelectContent>
            {COMPLAINT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <UploadArea />
        <p className="text-sm text-muted-foreground">Upload any relevant photos or documents (optional)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contact Number</Label>
        <Input id="contact" name="contact" type="tel" required placeholder="Your contact number" />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Complaint"}
      </Button>
    </form>
  )
}

