import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createWorkerClient } from "@tensorflow/tfjs"

interface AIAnalysisResult {
  category: string
  priority: string
  station: string
  department: string
  estimatedResolutionTime: number
  keywords: string[]
  entities: {
    locations: string[]
    times: string[]
    people: string[]
  }
  sentiment: number
  urgency: number
}

export async function analyzeComplaint(text: string, images: Buffer[], audio?: Buffer): Promise<AIAnalysisResult> {
  // Process text with OpenAI
  const textAnalysis = await generateText({
    model: openai("gpt-4"),
    prompt: `Analyze this railway complaint: ${text}
    Provide a JSON response with:
    - category (Cleanliness/Safety/Service/Technical)
    - priority (High/Medium/Low)
    - department
    - keywords
    - entities (locations, times, people)
    - sentiment (-1 to 1)
    - urgency (1-10)`,
  })

  // Process images with TensorFlow.js
  const imageAnalyses = await Promise.all(
    images.map(async (image) => {
      const worker = await createWorkerClient()
      const result = await worker.detect(image)
      return result
    }),
  )

  // Process audio if provided
  let audioTranscript = ""
  if (audio) {
    const { text } = await generateText({
      model: openai("whisper"),
      prompt: audio.toString("base64"),
    })
    audioTranscript = text
  }

  // Combine all analyses
  const combinedAnalysis = {
    ...JSON.parse(textAnalysis.text),
    imageObjects: imageAnalyses.flat(),
    audioTranscript,
  }

  return combinedAnalysis
}

