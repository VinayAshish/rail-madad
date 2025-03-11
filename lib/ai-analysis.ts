import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function analyzeComplaintText(text: string): Promise<{
  category: string
  priority: string
  keywords: string[]
  summary: string
  estimatedResolutionTime: string
}> {
  try {
    const prompt = `
      Analyze the following railway complaint and extract key information:
      
      "${text}"
      
      Return a JSON object with the following properties:
      1. category: The most appropriate category for this complaint (Health Issue, Theft, Cleanliness, Food Quality, Staff Behavior, Technical Issue, or Other)
      2. priority: The priority level based on urgency (CRITICAL, HIGH, MEDIUM, or LOW)
      3. keywords: Up to 5 keywords that represent the main issues in the complaint
      4. summary: A brief 1-2 sentence summary of the complaint
      5. estimatedResolutionTime: An estimate of how long this type of issue typically takes to resolve (e.g., "1-2 hours", "24-48 hours", "3-5 days")
      
      Only provide the JSON object, no other text.
    `

    const { text: analysisText } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0,
    })

    // Parse the response as JSON
    const analysis = JSON.parse(analysisText)

    return {
      category: analysis.category || "Other",
      priority: analysis.priority || "MEDIUM",
      keywords: analysis.keywords || [],
      summary: analysis.summary || "No summary available",
      estimatedResolutionTime: analysis.estimatedResolutionTime || "Unknown",
    }
  } catch (error) {
    console.error("AI analysis error:", error)
    return {
      category: "Other",
      priority: "MEDIUM",
      keywords: [],
      summary: "Failed to analyze complaint",
      estimatedResolutionTime: "Unknown",
    }
  }
}

