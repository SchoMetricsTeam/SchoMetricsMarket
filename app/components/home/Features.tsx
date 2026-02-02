import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Clock, Download, FileDown, MapPin, Shield, Zap } from "lucide-react";

const Features = () => {
    return (
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
    );
}

export default Features;