import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Leaf, School } from "lucide-react";
import Link from "next/link";

const Cta = () => {
    return (
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
    );
}

export default Cta;