"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Clock } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { Navigation } from "@/components/ui/navigation"

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        institucion: "",
        mensaje: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Formulario enviado:", formData);
                toast.success("¡Gracias por contactarnos! Te responderemos pronto.");
                setFormData({ nombre: "", email: "", institucion: "", mensaje: "" });
            } else {
                toast.error("Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            toast.error("Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navigation />
            {/* Hero Section */}
            <section className="container mt-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">Contáctanos</h1>
                        <p className="text-xl text-lime-600 max-w-3xl mx-auto text-pretty pt-5">
                            ¿Tienes preguntas sobre SchoMetrics? Estamos aquí para ayudarte a transformar tu institución educativa con
                            prácticas sostenibles.
                        </p>
                        <p className="text-xl text-emerald-500 max-w-3xl mx-auto text-pretty pt-5">
                            ¿Eres una Empresa Recicladora y quieres formar parte de esta transformación?
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="border-border shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-primary">Envíanos un Mensaje</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre" className="text-foreground">
                                                Nombre Completo
                                            </Label>
                                            <Input
                                                id="nombre"
                                                name="nombre"
                                                type="text"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                                className="border-border focus:ring-accent focus:border-accent"
                                                placeholder="Tu nombre completo"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-foreground">
                                                Correo Electrónico
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="border-border focus:ring-accent focus:border-accent"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="institucion" className="text-foreground">
                                            Institución Educativa o Nombre De Tu Empresa
                                        </Label>
                                        <Input
                                            id="institucion"
                                            name="institucion"
                                            type="text"
                                            value={formData.institucion}
                                            onChange={handleChange}
                                            className="border-border focus:ring-accent focus:border-accent"
                                            placeholder="Nombre de tu escuela o empresa"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mensaje" className="text-foreground">
                                            Mensaje
                                        </Label>
                                        <Textarea
                                            id="mensaje"
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="border-border focus:ring-accent focus:border-accent resize-none"
                                            placeholder="Cuéntanos cómo podemos ayudarte con tus iniciativas sostenibles..."
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-schoMetricsBaseColor/80 hover:bg-schoMetricsBaseColor text-white" size="lg">
                                        Enviar Mensaje
                                    </Button>
                                </form>
                                <Toaster toastOptions={{ duration: 5000 }} />
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <Card className="border-border shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-primary">Información de Contacto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-primary/10 p-3 rounded-lg">
                                            <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Email</h3>
                                            <p className="text-muted-foreground">contacto@schometrics.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-primary/10 p-3 rounded-lg">
                                            <Clock className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Horario de Atención</h3>
                                            <p className="text-muted-foreground">
                                                Lunes a Viernes: 8:00 AM - 6:00 PM
                                                <br />
                                                Sábados: 9:00 AM - 2:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ Section */}
                            <Card className="border-border shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-primary">Preguntas Frecuentes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">¿Cómo puedo registrar mi Escuela o Empresa?</h4>
                                        <span className="text-sm text-muted-foreground">
                                            Puedes comunicarte directamente completando el formulario o envía un correo a <p ><a className="text-schoMetricsBaseColor font-semibold" href="mailto:contacto@schometrics.com">contacto@schometrics.com</a> para recibir asistencia personalizada.</p>
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">¿Ofrecen capacitación?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Sí, ofrecemos programas de capacitación completos para administradores, docentes y estudiantes.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">¿Cuál es el costo de la plataforma?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            El uso de la plataforma es completamente gratuito. Contáctanos para obtener información más detallada.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
