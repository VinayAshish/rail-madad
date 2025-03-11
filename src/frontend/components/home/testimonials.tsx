"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/frontend/components/ui/avatar"

const Testimonial = ({
  content,
  author,
  role,
  avatarUrl,
  delay,
}: {
  content: string
  author: string
  role: string
  avatarUrl: string
  delay: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="rounded-xl border bg-background p-6 shadow-sm"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="mb-4 text-muted-foreground">{content}</p>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  const testimonials = [
    {
      content:
        "The AI-powered system made it so easy to submit my complaint. I received updates at every step and my issue was resolved quickly.",
      author: "Rahul Sharma",
      role: "Regular Traveler",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    {
      content:
        "As a frequent traveler, I've used many complaint systems, but Rail Madad AI is by far the most efficient and user-friendly.",
      author: "Priya Patel",
      role: "Business Traveler",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    {
      content:
        "The voice complaint feature is a game-changer for elderly passengers like me. I didn't have to type anything!",
      author: "Suresh Kumar",
      role: "Senior Citizen",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="mr-1">💬</span> Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from passengers who have used our system to resolve their complaints.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              avatarUrl={testimonial.avatarUrl}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

