import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { DestinationCard, ItemCard } from "@/components/cards";
import { FeaturesBar } from "@/components/features-bar";
import { OffersSection } from "@/components/offers-section";
import { TrustBar } from "@/components/trust-bar";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { HowItWorks } from "@/components/how-it-works";
import { FaqSection } from "@/components/faq-section";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <TrustBar />

        {/* Popular Destinations */}
        <Section title="Popular Destinations" viewAll="/destinations">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DestinationCard 
              name="Manali" 
              province="Himachal Pradesh" 
              image="https://images.unsplash.com/photo-1591154706847-e8396bc8d601?auto=format&fit=crop&q=80&w=600" 
            />
            <DestinationCard 
              name="Rishikesh" 
              province="Uttarakhand" 
              image="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=600" 
            />
            <DestinationCard 
              name="Goa" 
              province="Goa" 
              image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=600" 
            />
            <DestinationCard 
              name="Kasol" 
              province="Himachal Pradesh" 
              image="https://images.unsplash.com/photo-1627894483216-2138af692e2e?auto=format&fit=crop&q=80&w=600" 
            />
          </div>
        </Section>

        <OffersSection />

        {/* Featured Homestays */}
        <Section title="Featured Homestays" viewAll="/stays">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ItemCard 
              title="The Creek Villa" 
              location="Manali, HP" 
              price="4,500" 
              rating="4.9" 
              image="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600" 
            />
            <ItemCard 
              title="River View Cottage" 
              location="Rishikesh, UK" 
              price="3,200" 
              rating="4.5" 
              image="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600" 
            />
            <ItemCard 
              title="Mountain Echo" 
              location="Kasol, HP" 
              price="2,800" 
              rating="4.8" 
              image="https://images.unsplash.com/photo-1449156006079-eb5881679b0b?auto=format&fit=crop&q=80&w=600" 
            />
            <ItemCard 
              title="Greenwood Stay" 
              location="Bir, HP" 
              price="3,000" 
              rating="4.9" 
              image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600" 
            />
          </div>
        </Section>

        {/* Top Activities */}
        <Section title="Top Activities" viewAll="/activities">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ItemCard 
              type="activity"
              title="River Rafting" 
              location="Rishikesh" 
              price="1,200" 
              rating="4.8" 
              image="https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=600" 
            />
            <ItemCard 
              type="activity"
              title="Mountain Trek" 
              location="Triund, HP" 
              price="1,500" 
              rating="4.5" 
              image="https://images.unsplash.com/photo-1551632432-c7359b243b4d?auto=format&fit=crop&q=80&w=600" 
            />
            <ItemCard 
              type="activity"
              title="Paragliding" 
              location="Bir Billing, HP" 
              price="3,000" 
              rating="4.9" 
              image="https://images.unsplash.com/photo-1516245556508-7d6004ff0f39?auto=format&fit=crop&q=80&w=600" 
            />
            <ItemCard 
              type="activity"
              title="Village Farming" 
              location="Kasol, HP" 
              price="900" 
              rating="4.6" 
              image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600" 
            />
          </div>
        </Section>

        {/* Explore Attractions */}
        <Section title="Explore Attractions" viewAll="/attractions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DestinationCard 
              name="Solang Valley" 
              province="Manali" 
              image="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=600" 
            />
            <DestinationCard 
              name="Neer Waterfall" 
              province="Rishikesh" 
              image="https://images.unsplash.com/photo-1544131464-f999185b3400?auto=format&fit=crop&q=80&w=600" 
            />
            <DestinationCard 
              name="Vashisht Temple" 
              province="Manali" 
              image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600" 
            />
            <DestinationCard 
              name="Jogini Falls" 
              province="Manali" 
              image="https://images.unsplash.com/photo-1598330106281-ed851e06d997?auto=format&fit=crop&q=80&w=600" 
            />
          </div>
        </Section>

        {/* <HowItWorks /> */}

        <Testimonials />

        <FaqSection />

        <FeaturesBar />
      </main>
      
      <Footer />
    </div>
  );
}

function Section({ title, children, viewAll }: { title: string, children: React.ReactNode, viewAll: string }) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
        </div>
        <Link href={viewAll} className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}
