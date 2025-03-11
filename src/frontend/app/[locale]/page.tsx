import { HeroSection } from "@/frontend/components/home/hero-section"
import { FeaturesSection } from "@/frontend/components/home/features-section"
import { HowItWorks } from "@/frontend/components/home/how-it-works"
import { Testimonials } from "@/frontend/components/home/testimonials"
import { CtaSection } from "@/frontend/components/home/cta-section"
import { Footer } from "@/frontend/components/layout/footer"

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

