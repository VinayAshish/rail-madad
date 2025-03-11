"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateComplaintId } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { analyzeComplaintText } from "@/lib/ai-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

const formSchema = z.object({
  pnrNumber: z.string().min(10, {
    message: "PNR number must be at least 10 characters.",
  }),
  trainNumber: z.string().min(1, {
    message: "Train number is required.",
  }),
  coachNumber: z.string().min(1, {
    message: "Coach number is required.",
  }),
  seatNumber: z.string().min(1, {
    message: "Seat number is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  journeyStage: z.enum(["during", "post"], {
    required_error: "Please select when you're reporting this issue.",
  }),
})

// Updated categories with "Other" option
const CATEGORIES = [
  { id: "1", name: "Health Issue or Accident", priority: "CRITICAL", color: "text-red-600" },
  { id: "2", name: "Theft or Robbery", priority: "HIGH", color: "text-orange-600" },
  { id: "3", name: "Ticketing and Reservations", priority: "HIGH", color: "text-orange-600" },
  { id: "4", name: "Seat Reserved by Other Person", priority: "MEDIUM", color: "text-yellow-600" },
  { id: "5", name: "AC or Fan Issue", priority: "MEDIUM", color: "text-yellow-600" },
  { id: "6", name: "Cleanliness", priority: "MEDIUM", color: "text-yellow-600" },
  { id: "7", name: "Food Quality", priority: "MEDIUM", color: "text-yellow-600" },
  { id: "8", name: "Staff Behavior", priority: "MEDIUM", color: "text-yellow-600" },
  { id: "9", name: "Other", priority: "MEDIUM", color: "text-gray-600" },
]

export default function SubmitComplaintPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories] = useState(CATEGORIES)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeResults, setAnalyzeResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>("form")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pnrNumber: "",
      trainNumber: "",
      coachNumber: "",
      seatNumber: "",
      description: "",
      categoryId: "",
      contactEmail: "",
      journeyStage: "during",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      // Create a preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Process image with OCR
      processImageWithOCR(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const captureImage = async () => {
    // Using the device camera requires HTTPS in production
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // In a real app, you would show a video element and let the user take a picture
      // For simplicity, we'll just open the file picker
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera Access Failed",
        description: "Could not access your camera. Please use the file upload option instead.",
        variant: "destructive",
      })
      // Fall back to file picker
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
  }

  const processImageWithOCR = async (file: File) => {
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      // In a real app with backend, you would call the OCR API
      // For demo purposes, we'll simulate a response
      // const response = await fetch('/api/ocr', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()

      // Simulate OCR processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate OCR results
      const mockOcrResults = {
        success: true,
        text: "Indian Railways\nPNR: 1234567890\nTrain No: 12345\nCoach: S4\nSeat: 42\nFrom: Delhi\nTo: Mumbai",
        extractedInfo: {
          pnr: "1234567890",
          trainNumber: "12345",
          coach: "S4",
          seat: "42",
        },
      }

      // Update form with extracted information
      if (mockOcrResults.extractedInfo.pnr) {
        form.setValue("pnrNumber", mockOcrResults.extractedInfo.pnr)
      }
      if (mockOcrResults.extractedInfo.trainNumber) {
        form.setValue("trainNumber", mockOcrResults.extractedInfo.trainNumber)
      }
      if (mockOcrResults.extractedInfo.coach) {
        form.setValue("coachNumber", mockOcrResults.extractedInfo.coach)
      }
      if (mockOcrResults.extractedInfo.seat) {
        form.setValue("seatNumber", mockOcrResults.extractedInfo.seat)
      }

      toast({
        title: "Image Processed",
        description: "Information extracted from your ticket image has been added to the form.",
      })
    } catch (error) {
      console.error("OCR processing error:", error)
      toast({
        title: "Processing Failed",
        description: "Could not process the image. Please fill in the form manually.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeDescription = async (description: string) => {
    setIsAnalyzing(true)

    try {
      // Call the AI analysis function
      const analysis = await analyzeComplaintText(description)

      setAnalyzeResults(analysis)

      // Find the closest category
      const categoryMatch = categories.find(
        (cat) =>
          cat.name.toLowerCase().includes(analysis.category.toLowerCase()) ||
          analysis.category.toLowerCase().includes(cat.name.toLowerCase()),
      )

      if (categoryMatch) {
        form.setValue("categoryId", categoryMatch.id)
      }

      toast({
        title: "Analysis Complete",
        description: "Your complaint has been analyzed and categorized.",
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your complaint. Please select a category manually.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Analyze the description if not already analyzed
      let analysis = analyzeResults
      if (!analysis) {
        analysis = await analyzeComplaintText(values.description)
      }

      // Generate a unique complaint ID
      const complaintId = generateComplaintId()

      // Get complaints from localStorage
      const complaints = JSON.parse(localStorage.getItem("complaints") || "[]")

      // Get category name from ID
      const category = categories.find((c) => c.id === values.categoryId)?.name || "Unknown"

      // Create a FormData object if we have an image
      let imageUrl = null
      if (selectedImage) {
        // In a real app, you would upload the image to a storage service
        // For demo purposes, we'll save the data URL
        imageUrl = imagePreview
      }

      // Create complaint object
      const complaintData = {
        id: complaintId,
        ...values,
        category,
        status: "PENDING",
        priority:
          analysis.priority || (category.includes("Health") || category.includes("Theft") ? "CRITICAL" : "MEDIUM"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
        imageUrl,
        aiAnalysis: analysis,
        location: null, // Will be populated in a real app with geolocation
      }

      // Add to complaints array
      complaints.push(complaintData)

      // Save back to localStorage
      localStorage.setItem("complaints", JSON.stringify(complaints))

      // Success message
      toast({
        title: "Complaint Submitted",
        description: `Your complaint has been submitted successfully. Complaint ID: ${complaintId}`,
      })

      // Redirect to tracking page
      router.push(`/track?id=${complaintId}`)
    } catch (error) {
      console.error("Error submitting complaint:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Complaint</CardTitle>
          <CardDescription>
            Fill out the form below to submit your complaint. We'll process it as quickly as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="form" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="form">Complaint Form</TabsTrigger>
              <TabsTrigger value="image">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="image">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md mb-6">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={400}
                      height={300}
                      className="mx-auto rounded-md object-contain"
                    />
                    <Button variant="destructive" size="icon" className="absolute top-0 right-0" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold">Upload your ticket or complaint image</h3>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG or JPEG up to 10MB</p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <Button variant="outline" onClick={captureImage}>
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {isAnalyzing ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
                  <p>Processing image and extracting information...</p>
                </div>
              ) : imagePreview ? (
                <div className="flex justify-center">
                  <Button onClick={() => setActiveTab("form")}>Continue to Form</Button>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="form">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="journeyStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>When are you reporting this issue?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="during" />
                              </FormControl>
                              <FormLabel className="font-normal">During Journey</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="post" />
                              </FormControl>
                              <FormLabel className="font-normal">After Journey</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pnrNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PNR Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your 10-digit PNR number" {...field} />
                        </FormControl>
                        <FormDescription>Your 10-digit Passenger Name Record number from your ticket.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="trainNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Train Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coachNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coach Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., S4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seat Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 42" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Complaint Description</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => analyzeDescription(field.value)}
                            disabled={isAnalyzing || !field.value || field.value.length < 10}
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              "Analyze with AI"
                            )}
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your complaint in detail"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Provide as much detail as possible about your complaint.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {analyzeResults && (
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">AI Analysis Results</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Suggested Category:</span> {analyzeResults.category}
                          </div>
                          <div>
                            <span className="font-medium">Priority:</span> {analyzeResults.priority}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Summary:</span> {analyzeResults.summary}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Est. Resolution Time:</span>{" "}
                            {analyzeResults.estimatedResolutionTime}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Keywords:</span> {analyzeResults.keywords.join(", ")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complaint Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id} className={category.color}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the category that best describes your complaint.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email address" {...field} />
                        </FormControl>
                        <FormDescription>Your email address for updates on your complaint.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Complaint"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

