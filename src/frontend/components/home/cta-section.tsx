"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/frontend/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5 dark:from-background dark:to-primary-900/10">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Submit your complaint now and experience our AI-powered resolution system.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 min-[400px]:flex-row">
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
      </div>
    </section>
  )
}

