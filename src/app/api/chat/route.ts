import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const SYSTEM_PROMPT = `You are a helpful assistant for the Rail Madad complaint management system. 
Help users with:
- How to submit complaints
- How to track complaints
- Understanding the complaint process
- Using the website features
- Finding relevant information

Be concise, friendly, and provide step-by-step guidance when needed.`

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: message,
      system: SYSTEM_PROMPT,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

