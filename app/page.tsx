"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Recycle,
  School,
  Leaf,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  Heart,
  Target,
  Star,
  Quote,
  ChevronDown,
  Lightbulb,
  Handshake,
  HeartHandshake,
  FileDown,
  Download,
  BadgeDollarSignIcon,
  BottleWine,
  ShoppingBag,
} from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/ui/navigation"
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight"
import { motion } from "motion/react"
import { LayoutTextFlip } from "@/components/ui/layout-text-flip"

export default function MaterialesReciclablesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section - Premium design with blue gradients */}
      <section className="relative pt-24 pb-24 md:pt-16 lg:pb-36 overflow-hidden">
        <div className="flex flex-col justify-center items-center my-10">
          <div className="w-max flex justify-center items-center text-center font-semibold bg-white text-lime-500 hover:bg-white text-md px-5 py-2.5 animate-scale-in shadow-lg shadow-lime-500/50 rounded-none animate-pulse">
            <ShoppingBag className="h-5 w-5 text-lime-500 mr-2" />
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
              Conectamos escuelas con empresas recicladoras en todo México.{" "}
              <span className="text-schoMetricsBaseColor font-medium">Monetiza materiales reciclables</span> mientras contribuyes
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
      <section className="py-24 lg:py-36 bg-linear-to-br from-slate-50 via-lime-50/30 to-slate-50 relative">
        <div className="absolute inset-0" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <Badge
              variant="outline"
              className="mb-6 border-schoMetricsBaseColor text-schoMetricsBaseColor px-4 py-2 text-sm font-semibold animate-pulse"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Proceso Simple
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              En solo 3 pasos, conecta tu escuela con empresas recicladoras y comienza a generar ingresos sostenibles.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-linear-to-r from-schoMetricsBaseColor via-accent to-schoMetricsBaseColor opacity-30" />

            {[
              {
                step: "01",
                icon: School,
                title: "Registra tu Escuela",
                description:
                  "Solicita una cuenta en SchoMetrics y publica tus materiales reciclables disponibles: plástico, papel, latas de aluminio, etc.",
                color: "from-lime-100/20 to-lime-200/5",
              },
              {
                step: "02",
                icon: Handshake,
                title: "Conecta con Empresas",
                description:
                  "Las empresas recicladoras certificadas cercanas visualizarán los materiales publicados, analizarán la disponibilidad, los horarios y la ubicación para realizar la compra y recolección de tu material.",
                color: "from-lime-100/20 to-lime-200/5",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Genera Ingresos",
                description:
                  "Visualiza el estado de compra, descarga el archivo de comprobante, entrega tu material y recibe pagos seguros directamente en tu cuenta bancaria.",
                color: "from-lime-100/20 to-lime-200/5",
              },
            ].map((item, index) => (
              <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <Card className="relative overflow-hidden border-2 border-t-lime-300 hover:border-lime-400 transition-all duration-500 hover:shadow-2xl hover:shadow-lime-200/40 group h-full bg-linear-to-tr from-white to-slate-50">
                  {/* Step number background */}
                  <div className="absolute -top-4 -right-6 text-[140px] text-blue-100/70 font-bold group-hover:text-lime-200/80 transition-colors leading-none">
                    {item.step}
                  </div>

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <CardHeader className="relative z-10">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-lime-100/20 to-lime-200/5 group-hover:from-lime-100 group-hover:to-accent group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <item.icon className="h-10 w-10 text-schoMetricsBaseColor group-hover:text-lime-600 transition-colors group-hover:animate-heartbeat" />
                    </div>
                    <div className="text-sm font-bold text-lime-500 mb-2">PASO {item.step}</div>
                    <CardTitle className="text-2xl lg:text-3xl font-bold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base lg:text-lg leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Split layout with visual hierarchy */}
      <section className="py-24 lg:py-36 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-white" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div className="animate-slide-in-left">
              <Badge variant="outline" className="mb-6 border-rose-500 text-rose-500 px-4 py-2 font-semibold animate-bounce">
                <Heart className="mr-2 h-4 w-4" />
                Beneficios
              </Badge>
              <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-tight">
                Más que una Plataforma de Reciclaje
              </h2>
              <p className="text-xl text-muted-foreground mb-5 leading-relaxed">
                SchoMetrics es un <span className="font-semibold text-schoMetricsBaseColor">ecosistema completo</span> que
                beneficia a escuelas, empresas y al medio ambiente de manera integral.
              </p>
              <Button
                asChild
                size="lg"
                className="text-lg mb-5 px-7 py-5 bg-linear-to-r from-rose-400 to-rose-500 text-white hover:from-rose-500 hover:to-rose-300 transition-all hover:scale-105 font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 animate-heartbeat"
              >
                <Link href="/contacto">
                  ¡ Contactar Ahora !
                </Link>
              </Button>
              <div className="space-y-6">
                {[
                  {
                    icon: Heart,
                    title: "Impacto Ambiental Medible",
                    description:
                      "Reduce la huella de carbono de tu institución y promueve la economía circular en tu comunidad con métricas visibles, medibles y en tiempo real.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Ingresos Adicionales Garantizados",
                    description:
                      "Genera recursos económicos constantes para proyectos educativos, mejoras escolares y programas sustentables.",
                  },
                  {
                    icon: Users,
                    title: "Educación Sustentable Integral",
                    description:
                      "Fomenta la cultura del reciclaje entre estudiantes, maestros y familias con herramientas educativas incluidas.",
                  },
                  {
                    icon: Shield,
                    title: "Transacciones 100% Seguras",
                    description:
                      "Pagos seguros de Banco a Banco a partir de Transferencias, verificación exhaustiva de empresas recicladoras y soporte dedicado 24/7.",
                  },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex gap-5 group p-5 rounded-2xl hover:bg-lime-100/30 transition-all hover:shadow-lg hover:shadow-lime-100/60 border border-transparent hover:border-lime-200/80"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-rose-300/20 to-accent/20 group-hover:from-lime-500 group-hover:bg-lime-300 transition-all duration-500 shadow-lg group-hover:scale-110 group-hover:animate-heartbeat">
                      <benefit.icon className="h-7 w-7 text-rose-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl lg:text-2xl font-bold text-foreground">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-schoMetricsBaseColor/30 via-accent/20 to-schoMetricsBaseColor/30 rounded-3xl blur-3xl opacity-50" />

              <Card className="relative bg-linear-to-br from-card via-card/95 to-card/90 backdrop-blur-xl border-2 border-schoMetricsBaseColor/20 shadow-2xl shadow-schoMetricsBaseColor/20 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--tw-gradient-stops))] from-schoMetricsBaseColor via-transparent to-transparent" />
                </div>

                <CardHeader className="relative z-10">
                  <CardTitle className="text-3xl font-bold">Materiales Aceptados</CardTitle>
                  <CardDescription className="text-lg">
                    Amplia variedad de materiales reciclables certificados
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Plástico PET", icon: "♻️", color: "from-blue-500/20 to-blue-600/10" },
                      { name: "Papel y Cartón", icon: "📄", color: "from-amber-500/20 to-amber-600/10" },
                      { name: "Latas de Aluminio", icon: "🔩", color: "from-slate-500/20 to-slate-600/10" },
                      { name: "Orgánico", icon: "🌱", color: "from-green-500/20 to-green-600/10" },
                    ].map((material, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-5 rounded-2xl bg-linear-to-br ${material.color} hover:scale-105 transition-all duration-300 border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-default group`}
                      >
                        <span className="text-3xl group-hover:scale-125 transition-transform">{material.icon}</span>
                        <span className="font-semibold text-foreground text-sm lg:text-base">{material.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced with better visual hierarchy */}
      <section className="py-24 lg:py-36 bg-linear-to-b from-secondary/30 to-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <Badge variant="outline" className="mb-6 border-lime-500 text-lime-500 px-4 py-2 font-semibold animate-bounce">
              <Zap className="mr-2 h-4 w-4" />
              Características
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Tecnología al Servicio del Medio Ambiente
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Herramientas avanzadas diseñadas para hacer el reciclaje{" "}
              <span className="text-schoMetricsBaseColor font-semibold">simple, eficiente y rentable</span>.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Localización Inteligente (Para Empresas)",
                description:
                  "Encuentra las Escuelas cercanas con Google Maps y ajusta las mejores rutas para realizar la recolección.",
                gradient: "from-blue-500/10 to-blue-600/5",
              },
              {
                icon: Clock,
                title: "Programación Flexible (Para Escuelas)",
                description:
                  "Establece horarios de recolección personalizados que se adapten perfectamente a las necesidades operativas de tu escuela.",
                gradient: "from-purple-500/10 to-purple-600/5",
              },
              {
                icon: Shield,
                title: "Pagos Seguros de Banco a Banco (Para Empresas)",
                description:
                  "Transacciones protegidas con encriptación de nivel bancario. Recibe pagos directos, confiables y trazables.",
                gradient: "from-green-500/10 to-green-600/5",
              },
              {
                icon: FileDown,
                title: "Comprobantes Electrónicos (Formato PDF)",
                description:
                  "Descarga tu comprobante de Compra o Venta, incluye un Folio de Validez de Compra, único e irrepetible para validar la operación.",
                gradient: "from-orange-500/10 to-orange-600/5",
              },
              {
                icon: Download,
                title: "Descarga tu resumen completo de Compras",
                description:
                  "Descarga el archivo PDF de tu resumen de compras/ventas totales, visualiza el monto total invertido y todo el historial de compras/ventas que has realizado.",
                gradient: "from-cyan-500/10 to-cyan-600/5",
              },
              {
                icon: Zap,
                title: "Actualización de Estados de Disponibilidad y Compra Automáticos",
                description:
                  "Los estados de Disponibilidad y Compra de los Materiales Reciclables se ajustarán de manera automática de pendiendo de su situación actual.",
                gradient: "from-yellow-500/10 to-yellow-600/5",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-schoMetricsBaseColor/20 hover:border-lime-200 transition-all duration-500 hover:shadow-2xl hover:shadow-lime-200/40 group bg-linear-to-br from-card to-card/50 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br ${feature.gradient} group-hover:from-lime-500 group-hover:to-lime-300 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:animate-heartbeat`}
                  >
                    <feature.icon className="h-8 w-8 text-schoMetricsBaseColor group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl lg:text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base lg:text-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section - Enhanced with better metrics visualization */}
      <section className="py-24 lg:py-36 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <Badge variant="outline" className="mb-6 border-schoMetricsBaseColor text-schoMetricsBaseColor px-4 py-2 font-semibold animate-pulse">
              <Target className="mr-2 h-4 w-4 animate-heartbeat" />
              Nuestro Impacto
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Juntos Creamos un Futuro Sustentable
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Cada escuela y empresa que se une a SchoMetrics contribuye activamente a un{" "}
              <span className="text-schoMetricsBaseColor font-semibold">México más verde y próspero</span>.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                icon: Recycle,
                metric: "Impacto",
                description: "0.77 toneladas de CO₂.",
                subtext: "Según estudios ambientales, se puede estimar que por cada tonelada de residuos reciclados se evita aproximadamente 0.77 toneladas de CO₂.",
                color: "from-lime-500/10 to-lime-500/5",
              },
              {
                icon: BadgeDollarSignIcon,
                metric: "$ MXN",
                description: "Ingresos para escuelas",
                subtext: "Con la venta de tus materiales reciclables puedes aumentar los ingresos de tu escuela, mejorando la calidad y estancia escolar en tu institución educativa.",
                color: "from-lime-500/10 to-lime-500/5",
              },
              {
                icon: BottleWine,
                metric: "CALIDAD",
                description: "Material reciclable de calidad",
                subtext: "Las Escuelas deben ofrecer Materiales Reciclables de la mejor calidad, favoreciendo a al tratamiendo y aprovechamiendo de los mismos.",
                color: "from-lime-500/10 to-lime-500/5",
              },
            ].map((impact, index) => (
              <Card
                key={index}
                className="text-center border-2 border-schoMetricsBaseColor/30 hover:border-lime-300 transition-all duration-500 hover:shadow-2xl hover:shadow-lime-200/30 group bg-linear-to-br from-white via-lime-50/30 to-white backdrop-blur hover:-translate-y-2 animate-scale-in overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${impact.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <CardHeader className="relative z-10">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-lime-500 to-lime-300 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <impact.icon className="h-12 w-12 text-white group-hover:animate-heartbeat" />
                  </div>
                  <CardTitle className="text-4xl lg:text-5xl font-black bg-linear-to-br from-lime-500 to-lime-400 bg-clip-text text-transparent mb-3">
                    {impact.metric}
                  </CardTitle>
                  <CardDescription className="text-base lg:text-lg font-semibold text-schoMetricsBaseColor">
                    {impact.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-muted-foreground">{impact.subtext}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New addition */}
      <section className="py-24 lg:py-36 bg-linear-to-tr from-white to-lime-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <Badge variant="outline" className="mb-6 border-green-500 text-green-600 px-4 py-2 font-semibold animate-heartbeat">
              <Quote className="mr-2 h-4 w-4" />
              Testimonios
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Historias reales de escuelas y empresas que están transformando el reciclaje en México.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            {[
              {
                name: "Profra. María González",
                role: "Directora, Escuela Primaria Benito Juárez",
                location: "Ciudad de México",
                quote:
                  "En 6 meses hemos generado más de $45,000 MXN que invertimos en nuevos equipos de cómputo. Los estudiantes están más conscientes del medio ambiente.",
                rating: 5,
              },
              {
                name: "Ing. Carlos Ramírez",
                role: "CEO, EcoRecicla México",
                location: "Monterrey, NL",
                quote:
                  "SchoMetrics nos ha conectado con muchas escuelas. La plataforma es intuitiva y hace el proceso de recolección muy eficiente.",
                rating: 5,
              },
              {
                name: "Lic. Ana Martínez",
                role: "Coordinadora Ambiental, Colegio Cervantes",
                location: "Guadalajara, Jal",
                quote:
                  "Excelente Marketplace. Nuestros alumnos aportan materiales reciclables y la escuela genera ingresos adicionales destinados al beneficio de ellos.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 border-lime-200 hover:border-green-400 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/20 group bg-linear-to-br from-card to-card/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-white text-green-500" />
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <CardDescription className="text-base lg:text-lg leading-relaxed text-foreground italic">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - New addition */}
      <section className="py-24 lg:py-36 relative bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <Badge variant="outline" className="mb-6 border-schoMetricsBaseColor text-schoMetricsBaseColor px-4 py-2 font-semibold animate-bounce">
              ¿? Preguntas Frecuentes
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              ¿Tienes Dudas?
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Encuentra respuestas a las preguntas más comunes sobre SchoMetrics.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "¿Cuánto cuesta usar SchoMetrics?",
                answer:
                  "El registro y uso de la plataforma es completamente gratuito. Solo cobramos una pequeña comisión del 20% sobre las transacciones exitosas, que se descuenta automáticamente del pago.",
              },
              {
                question: "¿Qué materiales puedo reciclar?",
                answer:
                  "Aceptamos una amplia variedad: plástico PET, papel, cartón, vidrio, aluminio (latas) y materiales orgánicos. Cada empresa compradora puede elegir el tipo de material a comprar.",
              },
              {
                question: "¿Cómo se verifican las cuantas Vendedoras y Compradoras?",
                answer:
                  "Todas las cuentas pasan por un riguroso proceso de verificación que incluye validación de documentos legales, certificaciones ambientales, de operatividad y referencias comerciales antes de ser aceptadas en la plataforma.",
              },
              {
                question: "¿Cuánto tiempo tarda el proceso de recolección?",
                answer:
                  "Una vez aceptada una oferta, la recolección se programa típicamente dentro de 3-7 días hábiles, dependiendo de la ubicación y disponibilidad de la empresa recicladora.",
              },
              {
                question: "¿Cómo recibo los pagos?",
                answer:
                  "Los pagos se procesan de forma segura a través de transferencias bancarias y se depositan automática y directamente en la cuenta bancaria registrada de tu escuela cada 7 días hábiles después de la recolección confirmada.",
              },
              {
                question: "¿Necesito equipo especial para separar los materiales?",
                answer:
                  "No es necesario equipo especializado. Basta con adquirir una Báscula de Gancho o Báscula de Plataforma para determinar el peso correcto de tus Materiales, además te proporcionamos guías gratuitas sobre cómo separar y almacenar correctamente los materiales reciclables en tu escuela.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="border-2 border-schoMetricsBaseColor/20 hover:border-schoMetricsBaseColor transition-all duration-300 hover:shadow-lg hover:shadow-schoMetricsBaseColor/20 group bg-linear-to-br from-card to-card/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl lg:text-2xl font-bold text-foreground flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-schoMetricsBaseColor shrink-0 mt-1" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base lg:text-lg leading-relaxed pl-9">{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with more visual appeal */}
      <section className="py-24 lg:py-36 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        {/* Animated orbs */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-lime-100 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 left-20 w-96 h-96 bg-sky-100 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Card className="border-4 border-lime-200 border-double rounded-sm backdrop-blur-xl shadow-2xl shadow-lime-100/50 overflow-hidden relative">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--tw-gradient-stops))] from-primary via-transparent to-transparent animate-pulse" />
              </div>

              <CardHeader className="text-center pb-10 pt-16 relative z-10">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-r from-lime-400 to-lime-500 text-white shadow-xl animate-pulse">
                  <Leaf className="h-12 w-12 animate-heartbeat" />
                </div>
                <div className="text-center relative z-10">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-black leading-tight">
                    ¿Quieres Formar Parte del Cambio?
                  </div>
                  <div className="text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Únete a SchoMetrics hoy y forma parte de esta increíble{" "}
                    <span className="text-lime-500 font-semibold">red dereciclaje de México</span>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="mt-5 text-lg px-10 py-7 bg-linear-to-r from-lime-400 to-lime-500 text-white hover:from-lime-500 hover:to-lime-300 transition-all hover:scale-105 font-semibold shadow-lg shadow-lime-200 hover:shadow-xl hover:shadow-lime-300 animate-heartbeat"
                  >
                    <Link href="/contacto">
                      <School className="mr-2 h-6 w-6" />
                      ¡ Contactar Ahora !
                    </Link>
                  </Button>
                  <div className="mt-7 flex flex-wrap justify-center gap-8 text-base text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                      <span className="font-medium">Sin costos ocultos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                      <span className="font-medium">Registro gratuito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                      <span className="font-medium">Soporte 24/7</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

            </Card>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced with better organization */}
      <footer className="border-t-4 border-double border-lime-300 bg-white backdrop-blur relative">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/schometrics-logo.png" alt="SchoMetrics" width={56} height={56} priority />
                <span className="text-2xl font-bold text-schoMetricsBaseColor">
                  SchoMetrics
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed text-lg">
                Conectando escuelas con empresas recicladoras en México. Transformamos residuos en oportunidades para un
                futuro más sustentable y próspero.
              </p>
              <HeartHandshake className="h-20 w-20 animate-pulse text-lime-500" />
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-6 text-lg">Plataforma</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link
                    href="https://schometrics.com"
                    target="_blank"
                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Para Escuelas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/iniciar-sesion/empresas"
                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Para Empresas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Cómo Funciona
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-6 text-lg">Soporte</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/contacto" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/terminos-y-condiciones" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Términos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/politicas-de-privacidad" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} SchoMetrics. Todos los derechos reservados.
            </p>
            <p className="text-sm text-muted-foreground text-center sm:text-right flex items-center">
              Hecho con <Heart className="mx-2 inline h-4 w-4 text-rose-600 fill-rose-400 animate-pulse" /> en <b className="ml-2 text-green-700">Me</b><b>xi</b><b className="text-red-600">co</b>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
