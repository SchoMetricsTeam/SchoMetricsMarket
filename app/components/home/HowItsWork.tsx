import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Lightbulb, School, TrendingUp } from "lucide-react";

const HowItsWork = () => {
    return (
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
    );
}

export default HowItsWork;