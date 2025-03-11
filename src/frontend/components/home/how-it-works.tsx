"use client"

import { motion } from "framer-motion"

export function HowItWorks() {
  const { t } = useTranslation() // Changed to destructure t

  const steps = [
    {
      number: "01",
      title: t("home.howItWorks.step1.title"),
      description: t("home.howItWorks.step1.description"),
    },
    {
      number: "02",
      title: t("home.howItWorks.step2.title"),
      description: t("home.howItWorks.step2.description"),
    },
    {
      number: "03",
      title: t("home.howItWorks.step3.title"),
      description: t("home.howItWorks.step3.description"),
    },
  ]

  return (
    <section className="relative py-20 md:py-32 bg-muted/50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-accent/5 rounded-full blur-3xl opacity-50 transform translate-x-1/2 translate-y-1/2" />
        </div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="mr-1">🔄</span> {t("home.howItWorks.badge")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("home.howItWorks.title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("home.howItWorks.description")}
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border md:block hidden" />

          <div className="grid gap-8 md:grid-cols-1">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative md:ml-24 md:grid md:grid-cols-5 md:items-center md:gap-12"
              >
                <div className="flex md:col-span-2">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm md:absolute md:-left-24 md:h-12 md:w-12">
                    <span className="text-lg font-bold">{step.number}</span>
                    <div className="absolute -inset-1 rounded-full border border-primary/20 md:hidden" />
                  </div>
                  <div className="ml-6 md:ml-0">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <div className="mt-6 md:col-span-3 md:mt-0">
                  <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                    <div className="h-60 bg-muted/50 flex items-center justify-center">
                      <div className="text-4xl">{index === 0 ? "📝" : index === 1 ? "🤖" : "✅"}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

