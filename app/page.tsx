import Hero from "@/components/organisms/Hero";
import AboutUs from "@/components/organisms/AboutUs";
import TabsSection from "@/components/organisms/TabsSection";
import BlogSection from "@/components/organisms/BlogSection";
import ContactForm from "@/components/organisms/ContactForm";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutUs />
      <TabsSection />
      <BlogSection />
      <ContactForm />
    </div>
  );
}
