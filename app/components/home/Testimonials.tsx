import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Quote, Star, Users, MapPin } from "lucide-react";

const Testimonials = () => {
    return (
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
    );
}

export default Testimonials;