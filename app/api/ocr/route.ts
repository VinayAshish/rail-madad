import { NextResponse } from "next/server"
import { performOCR, processImage, extractInformation } from "@/lib/image-processing"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Process image for better OCR results
    const processedImage = processImage(buffer)

    // Perform OCR on processed image
    const ocrText = await performOCR(processedImage)

    // Extract information from OCR text
    const extractedInfo = extractInformation(ocrText)

    return NextResponse.json({
      success: true,
      text: ocrText,
      extractedInfo,
    })
  } catch (error) {
    console.error("OCR processing error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}

