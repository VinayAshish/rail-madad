import { createWorker } from "tesseract.js"
import cv from "opencv-wasm"

// Perform OCR on an image
export async function performOCR(imageBuffer: Buffer): Promise<string> {
  try {
    const worker = await createWorker("eng")
    const {
      data: { text },
    } = await worker.recognize(imageBuffer)
    await worker.terminate()
    return text
  } catch (error) {
    console.error("OCR error:", error)
    return "Failed to extract text from image"
  }
}

// Process image using OpenCV
export function processImage(imageBuffer: Buffer): Buffer {
  try {
    // Load image using OpenCV
    const src = cv.matFromImageData(imageBuffer)
    const dst = new cv.Mat()

    // Apply grayscale
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)

    // Apply Gaussian blur to reduce noise
    const ksize = new cv.Size(5, 5)
    cv.GaussianBlur(dst, dst, ksize, 0)

    // Apply adaptive threshold to enhance text
    cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2)

    // Convert back to buffer
    const processedData = dst.data

    // Clean up
    src.delete()
    dst.delete()

    return Buffer.from(processedData)
  } catch (error) {
    console.error("Image processing error:", error)
    return imageBuffer // Return original if processing fails
  }
}

// Extract meaningful information from OCR text
export function extractInformation(ocrText: string): Record<string, string> {
  const info: Record<string, string> = {}

  // Try to extract train number
  const trainNumberMatch = ocrText.match(/Train\s*(?:No|Number)?\s*[:#]?\s*(\d+)/i)
  if (trainNumberMatch) {
    info.trainNumber = trainNumberMatch[1]
  }

  // Try to extract PNR
  const pnrMatch = ocrText.match(/PNR\s*[:#]?\s*(\d+)/i)
  if (pnrMatch) {
    info.pnr = pnrMatch[1]
  }

  // Try to extract coach number
  const coachMatch = ocrText.match(/Coach\s*[:#]?\s*([A-Z0-9]+)/i)
  if (coachMatch) {
    info.coach = coachMatch[1]
  }

  // Try to extract seat/berth number
  const seatMatch = ocrText.match(/(?:Seat|Berth)\s*[:#]?\s*([A-Z0-9]+)/i)
  if (seatMatch) {
    info.seat = seatMatch[1]
  }

  return info
}

