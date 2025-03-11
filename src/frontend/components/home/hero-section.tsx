"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Shield, Clock } from "lucide-react"
import { Button } from "@/frontend/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background dark:from-primary-900/20 dark:to-background py-20 md:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[30%] w-[80%] h-[80%] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="mr-1">✨</span> AI-Powered Complaint System
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gradient">Simplified</span> Complaint Management
            </h1>
            <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
              Submit and track your complaints with ease. Our AI-powered system ensures faster resolution and better
              customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link href="/submit">
                  Submit a Complaint
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/track">Track Your Complaint</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative mx-auto aspect-video overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-20" />
              <img
                src="/images/dashboard-preview.png"
                alt="Rail Madad AI Dashboard"
                className="h-full w-full object-cover"
                width={550}
                height={310}
              />
            </div>

            {/* Floating feature cards */}
            <motion.div
              className="absolute -left-12 top-1/4 max-w-[180px] rounded-lg border bg-background p-4 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Easy Submission</p>
              <p className="text-xs text-muted-foreground">Submit complaints with just a few clicks</p>
            </motion.div>

            <motion.div
              className="absolute -right-12 top-2/3 max-w-[180px] rounded-lg border bg-background p-4 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Secure Process</p>
              <p className="text-xs text-muted-foreground">Your data is always protected</p>
            </motion.div>

            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 max-w-[200px] rounded-lg border bg-background p-4 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Real-time Tracking</p>
              <p className="text-xs text-muted-foreground">Monitor your complaint status in real-time</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

