"use client"

import { useTranslation } from "next-intl" // Changed from useTranslations
import { motion } from "framer-motion"
import { FileText, Clock, MessageSquare, Upload, BarChart3, Bell } from "lucide-react"

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: any
  title: string
  description: string
  delay: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}

export function FeaturesSection() {
  const { t } = useTranslation() // Changed to destructure t

  const features = [
    {
      icon: FileText,
      title: t("home.features.feature1.title"),
      description: t("home.features.feature1.description"),
    },
    {
      icon: Clock,
      title: t("home.features.feature2.title"),
      description: t("home.features.feature2.description"),
    },
    {
      icon: MessageSquare,
      title: t("home.features.feature3.title"),
      description: t("home.features.feature3.description"),
    },
    {
      icon: Upload,
      title: t("home.features.feature4.title"),
      description: t("home.features.feature4.description"),
    },
    {
      icon: BarChart3,
      title: t("home.features.feature5.title"),
      description: t("home.features.feature5.description"),
    },
    {
      icon: Bell,
      title: t("home.features.feature6.title"),
      description: t("home.features.feature6.description"),
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="mr-1">🚀</span> {t("home.features.badge")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("home.features.title")}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("home.features.description")}
            </p>
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

