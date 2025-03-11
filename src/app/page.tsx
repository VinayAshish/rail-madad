import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { Testimonials } from "@/components/home/testimonials"
import { CtaSection } from "@/components/home/cta-section"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  )
}

