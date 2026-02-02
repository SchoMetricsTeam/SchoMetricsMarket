"use client"

import { Navigation } from "@/components/ui/navigation"
import HowItsWork from "./components/home/HowItsWork"
import Benefits from "./components/home/Benefits"
import Features from "./components/home/Features"
import Impact from "./components/home/Impact"
import FAQ from "./components/home/FAQ"
import CTA from "./components/home/CTA"
import Footer from "./components/home/Footer"
import { ChevronDown, RecycleIcon } from "lucide-react"
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight"
import { motion } from "motion/react"
import { LayoutTextFlip } from "@/components/ui/layout-text-flip"
import MissionVision from "./components/home/MissionVision"

export default function MaterialesReciclablesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="relative pt-24 pb-24 md:pt-16 lg:pb-36 overflow-hidden">
        <div className="flex flex-col justify-center items-center my-10">
          <div className="w-max flex justify-center items-center text-center font-semibold bg-white text-lime-500 hover:bg-white text-md px-5 py-2.5 animate-scale-in shadow-lg shadow-lime-500/50 rounded-none animate-pulse">
            <RecycleIcon className="h-5 w-5 text-lime-500 mr-2" />
            Tienda Online - Vende o Compra
          </div>
        </div>
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full text-center">
            <HeroHighlight>
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: [20, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-4xl px-4 md:text-6xl lg:text-7xl font-bold text-neutral-700 max-w-5xl leading-relaxed lg:leading-snug text-center mx-auto"
              >
                Con <b className="text-[#006ace]">SchoMetrics</b> Transforma
                {" "}
                <motion.div>
                  <Highlight className="text-white">
                    <LayoutTextFlip
                      text=""
                      words={["Residuos", "Recursos"]}
                    />
                  </Highlight>
                </motion.div>
                En Oportunidades <b className="text-lime-500 animate-caret-blink">$</b>
              </motion.h1>
            </HeroHighlight>

            <p
              className="mt-5 mb-12 text-xl text-muted-foreground sm:text-2xl md:text-3xl lg:text-5xl w-full max-w-6xl mx-auto leading-normal "
            >
              Conectamos <span className="text-sellerBaseColor font-medium">Vendedores</span> y <span className="text-teal-600 font-medium">Compradores</span> de Materiales Reciclables por todo México.{" "}
              <span className="text-schoMetricsBaseColor font-medium">Monetiza  materiales reciclables</span>, obtén increíbles ingresos y contribuye
              al cuidado del planeta.
            </p>
            {/* Scroll indicator */}
            <div className="mt-16 animate-bounce">
              <ChevronDown className="h-8 w-8 text-schoMetricsBaseColor mx-auto opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced with step connectors */}
      <HowItsWork />

      {/* Benefits Section - Split layout with visual hierarchy */}
      <Benefits />

      {/* Features Grid - Enhanced with better visual hierarchy */}
      <Features />

      {/* Mission & Vission */}
      <MissionVision />

      {/* Impact Section - Enhanced with better metrics visualization */}
      <Impact />

      {/* Testimonials Section - New addition */}
      {/* <Testimonials /> */}

      {/* FAQ Section - New addition */}
      <FAQ />


      {/* CTA Section - Enhanced with more visual appeal */}
      <CTA />

      {/* Footer - Enhanced with better organization */}
      <Footer />
    </div>
  )
}
