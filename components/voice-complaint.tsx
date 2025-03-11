"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VoiceComplaintProps {
  onTranscription: (text: string) => void
  language?: string
}

export function VoiceComplaint({ onTranscription, language = "en" }: VoiceComplaintProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
        await processAudio(audioBlob)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setProcessing(true)
    try {
      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = reader.result as string

        // Send to API for transcription
        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audio: base64Audio,
            language,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to transcribe audio")
        }

        const { text } = await response.json()
        onTranscription(text)
      }
    } catch (error) {
      console.error("Error processing audio:", error)
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="lg"
        className="w-16 h-16 rounded-full"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={processing}
      >
        {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      <p className="text-sm text-muted-foreground">
        {processing ? "Processing audio..." : isRecording ? "Recording... Click to stop" : "Click to start recording"}
      </p>
    </div>
  )
}

