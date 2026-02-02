import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreeDeciduous, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const Benefits = () => {
    return (
        <section className="py-24 lg:py-36 relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-white" />

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                    <div className="animate-slide-in-left">
                        <Badge variant="outline" className="mb-6 border-rose-500 text-rose-500 px-4 py-2 font-semibold animate-bounce">
                            <TreeDeciduous className="mr-2 h-4 w-4" />
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
                                    icon: TreeDeciduous,
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
                                            className={`flex flex-col items-center justify-center text-center gap-3 p-5 rounded-2xl bg-linear-to-br ${material.color} hover:scale-105 transition-all duration-300 border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-default group`}
                                        >
                                            <span className="text-3xl group-hover:scale-125 transition-transform animate-bounce">{material.icon}</span>
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
    );
}

export default Benefits;