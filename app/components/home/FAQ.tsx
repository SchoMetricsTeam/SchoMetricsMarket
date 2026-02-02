import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const Faq = () => {
    return (
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
    );
}

export default Faq;