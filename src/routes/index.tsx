import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Projects } from "@/components/site/Projects";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { ProductVisualizer } from "@/components/site/ProductVisualizer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ARM Edifice — Premium Aluminium & Facade Solutions in Karnataka" },
      {
        name: "description",
        content:
          "ARM Edifice — aluminium windows, ACP, structural & spider glazing, partitions, curtain walls and custom fabrication across Hubli, Mysuru, Bengaluru and Mangalore.",
      },
      { property: "og:title", content: "ARM Edifice — Aluminium & Facade Solutions" },
      {
        property: "og:description",
        content:
          "Complete aluminium & facade studio: windows, ACP, glazing, partitions, custom fabrication.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "ARM Edifice",
          image: "/og-arm-edifice.jpg",
          telephone: "+91-91135-51616",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Pendar Galli",
            addressLocality: "Hubli",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
          areaServed: ["Hubli", "Mysuru", "Bengaluru", "Mangalore", "Hassan"],
          description:
            "Aluminium windows, ACP, structural & spider glazing, partitions and custom fabrication.",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero />
        <Services />
        <ProductVisualizer />
        <Projects />
        <Process />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
