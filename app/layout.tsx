import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import dynamic from "next/dynamic"

const inter = Inter({ subsets: ["latin"] })

// Dynamically import the Header and RailMadadChatbot components with ssr: false
// This prevents hydration errors by ensuring they only render on the client
const Header = dynamic(() => import("@/components/layout/header").then((mod) => mod.Header), { ssr: false })
const RailMadadChatbot = dynamic(
  () => import("@/components/chatbot/rail-madad-chatbot").then((mod) => mod.RailMadadChatbot),
  { ssr: false },
)

export const metadata: Metadata = {
  title: "Rail Madad - AI-Enhanced Complaint Management System",
  description: "Submit and track complaints for Indian Railways",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <RailMadadChatbot />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

