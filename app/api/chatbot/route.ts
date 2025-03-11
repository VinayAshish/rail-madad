import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const SYSTEM_PROMPT = `You are a helpful assistant for the Rail Madad complaint management system. 
Your name is Rail Madad AI Assistant.

Only provide information related to:
- How to submit complaints
- How to track complaints
- Understanding the complaint process
- Using the website features
- Finding relevant information about Indian Railways complaint system

If asked about anything unrelated to Rail Madad or Indian Railways complaint system, politely redirect the conversation back to how you can help with complaints.

Be concise, friendly, and provide step-by-step guidance when needed.

Here are some key facts about Rail Madad:
1. Rail Madad is an AI-enhanced complaint management system for Indian Railways
2. Users can submit complaints with photos, videos, or audio
3. The AI system categorizes and prioritizes complaints automatically
4. Users can track their complaints using a complaint ID
5. Complaints are routed to the appropriate department based on their category
6. Critical complaints are given higher priority
7. Users receive real-time updates on their complaints

Do not make up information. If you don't know something specific about Rail Madad, say so and offer to help with what you do know.`

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json()

    // Convert history to the format expected by the AI
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: message,
      system: SYSTEM_PROMPT,
      messages: formattedHistory
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

