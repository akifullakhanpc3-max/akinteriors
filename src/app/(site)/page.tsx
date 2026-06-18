import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';

const AboutSection = dynamic(() => import('@/components/sections/AboutSection'));
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'));
const WhyChooseUs = dynamic(() => import('@/components/sections/WhyChooseUs'));
const StatsSection = dynamic(() => import('@/components/sections/StatsSection'));
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'));
const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection'));
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'));
const TeamSection = dynamic(() => import('@/components/sections/TeamSection'));
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'));
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'));

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <StatsSection />
      <ProjectsSection />
      <ProcessSection />
      <TestimonialsSection />
      <TeamSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
