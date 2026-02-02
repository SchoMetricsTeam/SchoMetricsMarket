"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Clock, Send, Recycle, Sparkles, Megaphone } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { Navigation } from "@/components/ui/navigation"

// Variantes de animación para reusar
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        institucion: "",
        mensaje: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("¡Mensaje enviado! Juntos hacemos el cambio.");
                setFormData({ nombre: "", email: "", institucion: "", mensaje: "" });
            } else {
                toast.error("Ups, algo falló. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión. Verifica tu internet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <Navigation />

            <motion.section
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 mx-auto"
            >
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16 pt-10">
                    <motion.div variants={fadeInUp as any} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-emerald-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                        <Megaphone className="w-4 h-4" /> Contáctanos
                    </motion.div>

                    <motion.h1 variants={fadeInUp as any} className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-700 dark:text-white mb-6">
                        Conectemos por un futuro <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-blue-600">
                            más sostenible
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp as any} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Si necesitas Comprar o Vender materiales reciclables, generar excelentes ingresos y contribuir al medio ambiente, SchoMetrics es tu mejor opción.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">

                    {/* Form Column */}
                    <motion.div variants={fadeInUp as any} className="lg:col-span-7">
                        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Envíanos un mensaje</h3>
                                <p className="text-slate-500 dark:text-slate-400">Responderemos en menos de 24 horas hábiles.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 group">
                                        <Label htmlFor="nombre" className="text-slate-700 dark:text-slate-300 font-medium">Nombre Completo</Label>
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Correo Electrónico</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                            placeholder="juan@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="institucion" className="text-slate-700 dark:text-slate-300 font-medium">Institución / Empresa / Independiente</Label>
                                    <Input
                                        id="institucion"
                                        name="institucion"
                                        value={formData.institucion}
                                        onChange={handleChange}
                                        className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                        placeholder="Nombre de la escuela, organización o negocio"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mensaje" className="text-slate-700 dark:text-slate-300 font-medium">¿Cómo podemos ayudarte?</Label>
                                    <Textarea
                                        id="mensaje"
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all duration-300"
                                        placeholder="Escribe tu mensaje aquí..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">Enviando... <Recycle className="animate-spin h-5 w-5" /></span>
                                    ) : (
                                        <span className="flex items-center gap-2">Enviar Mensaje <Send className="h-5 w-5" /></span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Info Column */}
                    <motion.div variants={fadeInUp as any} className="lg:col-span-5 space-y-8">

                        {/* Info Cards */}
                        <div className="grid gap-6">
                            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Email Directo</h4>
                                    <a href="mailto:contacto@schometrics.com" className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">
                                        contacto@schometrics.com
                                    </a>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Horario de Atención</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Lun - Vie: 8:00 AM - 6:00 PM<br />
                                        Sábados: 9:00 AM - 2:00 PM
                                    </p>
                                </div>
                            </div>

                            {/* <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Oficinas</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Ciudad Innovación, Edificio Eco<br />
                                        Piso 3, Oficina 301
                                    </p>
                                </div>
                            </div> */}
                        </div>

                        {/* FAQ Mini */}
                        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Preguntas Rápidas</h3>
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                                    <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">¿Tiene costo el registro?</h5>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                        No, el registro básico para vendedores y compradores es 100% gratuito.
                                    </p>
                                </div>
                                <div className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                                    <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">¿Qué materiales aceptan?</h5>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                        PET, Cartón, Aluminio y Papel, Residuos de temporada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <Toaster toastOptions={{
                className: '!bg-slate-900 !text-white !rounded-xl',
                duration: 5000
            }} />
        </div>
    )
}
