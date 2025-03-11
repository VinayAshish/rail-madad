import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/frontend/contexts/auth-context"
import { Header } from "@/frontend/components/layout/header"
import { Chatbot } from "@/frontend/components/chat/chatbot"
import { Toaster } from "@/frontend/components/ui/toaster"
import "@/frontend/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rail Madad AI - Enhanced Complaint Management System",
  description: "AI-powered complaint management system for Indian Railways",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-background">{children}</main>
          <Chatbot />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

