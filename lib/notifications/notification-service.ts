import twilio from "twilio"
import { Resend } from "resend"
import { generateText } from "./openai"

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const resend = new Resend(process.env.RESEND_API_KEY)

interface NotificationOptions {
  type: "sms" | "whatsapp" | "email" | "voice"
  to: string
  subject?: string
  message: string
  language?: string
}

export async function sendNotification(options: NotificationOptions) {
  const { type, to, subject, message, language = "en" } = options

  // Translate message if needed
  const translatedMessage = await translateMessage(message, language)

  switch (type) {
    case "sms":
      await twilioClient.messages.create({
        body: translatedMessage,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      })
      break

    case "whatsapp":
      await twilioClient.messages.create({
        body: translatedMessage,
        to: `whatsapp:${to}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      })
      break

    case "email":
      await resend.emails.send({
        from: "Rail Madad <notifications@railmadad.com>",
        to,
        subject,
        html: translatedMessage,
      })
      break

    case "voice":
      await twilioClient.calls.create({
        twiml: `<Response><Say language="${language}">${translatedMessage}</Say></Response>`,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      })
      break
  }
}

async function translateMessage(message: string, targetLanguage: string) {
  const { text } = await generateText({
    model: "gpt-4",
    prompt: `Translate this message to ${targetLanguage}: ${message}`,
  })
  return text
}

