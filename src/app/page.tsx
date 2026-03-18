'use client';

import { useContentStore } from '@/lib/store';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import SearchFilters from '@/components/SearchFilters';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function Home() {
  const { content } = useContentStore();
  const faqs = content.faq;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <div id="search" className="container py-12">
        <div className="flex flex-col items-center text-center mb-10 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Find Your Next Home</h2>
          <p className="text-muted-foreground max-w-[600px]">
            Direct connection with verified landlords. No agent fees. No stress.
          </p>
        </div>
        <SearchFilters />
        <FeaturedProperties />
      </div>

      <CTASection />

      {/* FAQ Section */}
      <section className="container py-24 bg-muted/30 rounded-[3rem] my-12" id="faq">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${index}`}
                className="bg-white dark:bg-white/5 border rounded-2xl px-6 py-1 shadow-sm data-[state=open]:border-primary/20 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </main>
  );
}
