"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Minimize, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatbotProps {
  onComplaintSubmit?: (data: any) => void
  onTrackRequest?: (id: string) => void
}

export function RailMadadChatbot({ onComplaintSubmit, onTrackRequest }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the Rail Madad AI assistant. How can I help you today? You can ask me about filing a complaint, tracking a complaint, or any other assistance related to Rail Madad.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInComplaintFlow, setIsInComplaintFlow] = useState(false)
  const [complaintData, setComplaintData] = useState({
    pnrNumber: "",
    description: "",
    category: "",
    contact: "",
    step: 0,
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // If in complaint flow, process the input accordingly
    if (isInComplaintFlow) {
      processComplaintInput(userMessage)
      return
    }

    // Check for specific intents
    if (userMessage.toLowerCase().includes("file") && userMessage.toLowerCase().includes("complaint")) {
      startComplaintFlow()
      return
    }

    if (userMessage.toLowerCase().includes("track") && userMessage.toLowerCase().includes("complaint")) {
      askForComplaintId()
      return
    }

    // Otherwise, simulate AI response
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response
      const responses = [
        "I can help you with filing a complaint or tracking an existing one. What would you like to do?",
        "You can submit a complaint through our form. Would you like me to guide you through the process?",
        "To track a complaint, you'll need your complaint ID. Do you have your complaint ID?",
        "Rail Madad is an AI-enhanced complaint management system for Indian Railways. How can I assist you today?",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having trouble responding right now. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const startComplaintFlow = () => {
    setIsInComplaintFlow(true)
    setComplaintData({ ...complaintData, step: 1 })
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "I'll help you file a complaint. First, please provide your PNR number.",
      },
    ])
  }

  const askForComplaintId = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Please provide your complaint ID (e.g., RM123456) to track your complaint.",
      },
    ])
  }

  const processComplaintInput = (input: string) => {
    const { step } = complaintData

    switch (step) {
      case 1: // PNR number
        setComplaintData({ ...complaintData, pnrNumber: input, step: 2 })
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Thank you. Now, please describe your complaint in detail.",
          },
        ])
        break

      case 2: // Description
        setComplaintData({ ...complaintData, description: input, step: 3 })
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thank you for the details. Please select a category for your complaint: 1) Cleanliness, 2) Food Quality, 3) Staff Behavior, 4) Technical Issues, 5) Other",
          },
        ])
        break

      case 3: // Category
        let category = ""
        if (input.includes("1") || input.toLowerCase().includes("clean")) {
          category = "Cleanliness"
        } else if (input.includes("2") || input.toLowerCase().includes("food")) {
          category = "Food Quality"
        } else if (input.includes("3") || input.toLowerCase().includes("staff")) {
          category = "Staff Behavior"
        } else if (input.includes("4") || input.toLowerCase().includes("tech")) {
          category = "Technical Issues"
        } else {
          category = "Other"
        }

        setComplaintData({ ...complaintData, category, step: 4 })
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Thank you. You've selected ${category}. Finally, please provide your contact email.`,
          },
        ])
        break

      case 4: // Contact email
        setComplaintData({ ...complaintData, contact: input, step: 5 })

        // Submit the complaint
        submitComplaint({
          pnrNumber: complaintData.pnrNumber,
          category: complaintData.category,
          description: complaintData.description,
          contact: input,
        })

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Thank you! I'm submitting your complaint now...",
          },
        ])
        break

      default:
        setIsInComplaintFlow(false)
        setComplaintData({
          pnrNumber: "",
          description: "",
          category: "",
          contact: "",
          step: 0,
        })
    }
  }

  const submitComplaint = async (data: any) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a random complaint ID
      const complaintId = "RM" + Math.floor(100000 + Math.random() * 900000)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Your complaint has been submitted successfully! Your complaint ID is ${complaintId}. You can use this ID to track the status of your complaint.`,
        },
      ])

      // Reset complaint flow
      setIsInComplaintFlow(false)
      setComplaintData({
        pnrNumber: "",
        description: "",
        category: "",
        contact: "",
        step: 0,
      })

      if (onComplaintSubmit) {
        onComplaintSubmit({ complaintId, ...data })
      }
    } catch (error) {
      console.error("Error submitting complaint:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, there was an error submitting your complaint. Please try again or use the complaint form on our website.",
        },
      ])
      setIsInComplaintFlow(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrackComplaint = async (complaintId: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const data = {
        id: complaintId,
        status: "IN_PROGRESS",
        category: "Cleanliness",
        createdAt: new Date().toISOString(),
      }

      // Format the complaint data for display
      const status = data.status.replace(/_/g, " ")
      const date = new Date(data.createdAt).toLocaleString()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Here's the status of your complaint ${complaintId}:

Status: ${status}
Submitted on: ${date}
Category: ${data.category}

Would you like to see more details?`,
        },
      ])

      if (onTrackRequest) {
        onTrackRequest(complaintId)
      }
    } catch (error) {
      console.error("Error tracking complaint:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't find that complaint. Please check the ID and try again, or you can use the tracking page on our website.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg">
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed right-4 bottom-4 w-80 shadow-lg transition-all duration-200",
        isMinimized ? "h-14" : "h-[500px]",
      )}
    >
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold text-sm">Rail Madad Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
            <Minimize className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground ml-auto",
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted w-max max-w-[80%] rounded-lg px-3 py-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          </ScrollArea>
          <CardContent className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  )
}

