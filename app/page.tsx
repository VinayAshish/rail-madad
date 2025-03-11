import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                AI-Enhanced Rail Madad Complaint System
              </h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Our advanced AI system automatically categorizes and prioritizes your complaints, ensuring faster
                resolution and better service.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/submit">
                    Submit a Complaint <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/track">Track Your Complaint</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl">
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Image
                  src="/image.jpg"
                  alt="Indian Railways Train"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our AI-powered system offers a range of features to make your complaint experience seamless.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="p-2 bg-blue-100 rounded-full">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-blue-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How to Use Rail Madad</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Follow these simple steps to submit and track your railway complaints
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Submit Your Complaint</h3>
              <p className="text-gray-500">
                Fill out the complaint form with details about your issue. You can submit during or after your journey.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Automatic Processing</h3>
              <p className="text-gray-500">
                Our AI system analyzes and categorizes your complaint, assigning the appropriate priority level.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Track Resolution</h3>
              <p className="text-gray-500">
                Use your complaint ID to track the status of your complaint at any time until it's resolved.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto mb-8">
            <h3 className="text-xl font-semibold mb-4">Tips for Faster Resolution</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 text-green-500">✓</span>
                <span>Be specific and provide all relevant details in your description</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 text-green-500">✓</span>
                <span>Upload photos of your ticket or the issue when possible</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 text-green-500">✓</span>
                <span>Include accurate PNR, train, coach, and seat numbers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 text-green-500">✓</span>
                <span>Report issues as soon as possible for quicker resolution</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/submit">Submit a Complaint</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/track">Track Your Complaint</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: "AI Categorization",
    description: "Our AI automatically categorizes your complaint for faster routing to the right department.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M12 2H2v10h10V2Z" />
        <path d="M22 12h-10v10h10V12Z" />
        <path d="M12 12H2v10h10V12Z" />
        <path d="M22 2h-10v10h10V2Z" />
      </svg>
    ),
  },
  {
    title: "Smart Prioritization",
    description: "Critical issues are automatically prioritized to ensure they're addressed first.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Real-time Tracking",
    description: "Track the status of your complaint in real-time with detailed updates.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Multi-channel Notifications",
    description: "Receive updates via SMS, WhatsApp, or email based on your preference.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: "Voice Complaints",
    description: "Submit complaints using voice input for a more accessible experience.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <path d="M12 19v3" />
      </svg>
    ),
  },
  {
    title: "AI Chatbot Assistance",
    description: "Get help from our AI chatbot for filing complaints or tracking status.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
      </svg>
    ),
  },
]

