import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSignIcon, BottleWine, Recycle, Target } from "lucide-react";

const Impact = () => {
    return (
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
    );
}

export default Impact;