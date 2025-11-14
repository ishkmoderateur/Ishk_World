import HeroSection from "@/components/hero-section";
import ServiceCards from "@/components/service-cards";
import PhilosophySection from "@/components/philosophy-section";
import ImageGallery from "@/components/image-gallery";
import FeaturesSection from "@/components/features-section";
import CTASection from "@/components/cta-section";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <ServiceCards />
      <ImageGallery />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
