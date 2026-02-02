'use client';

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Heart, Leaf, RefreshCcw, ShieldCheck, Users } from 'lucide-react';

const values = [
    {
        title: "Transparencia Total",
        description: "Claridad absoluta en cada transacción entre vendedores y compradores, asegurando confianza en el proceso de compra.",
        icon: ShieldCheck,
        color: "bg-blue-500/10 text-blue-600"
    },
    {
        title: "Impacto Comunitario",
        description: "Empoderamos a las instituciones, Organizaciones o Emprendimientos para transformar sus residuos en recursos económicos.",
        icon: Users,
        color: "bg-amber-500/10 text-amber-600"
    },
    {
        title: "Sostenibilidad Real",
        description: "Fomentamos una economía circular que reduce la huella de carbono.",
        icon: Leaf,
        color: "bg-emerald-500/10 text-emerald-600"
    },
    {
        title: "Innovación Continua",
        description: "Tecnología de punta para simplificar la logística y venta de materiales reciclables.",
        icon: RefreshCcw,
        color: "bg-purple-500/10 text-purple-600"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

export default function MissionVision() {
    return (
        <section className="relative py-24 overflow-hidden bg-slate-50">
            {/* Fondo decorativo sutil */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-lime-300/20 blur-3xl" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-3xl" />
            </div>

            <div className="container px-4 mx-auto relative z-10 max-w-6xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-20"
                >
                    {/* Cabecera */}
                    <div className="text-center max-w-3xl mx-auto">
                        <Badge variant="outline" className="mb-6 border-lime-500 text-lime-500 px-4 py-2 font-semibold animate-bounce">
                            <Heart className="mr-2 h-4 w-4" />
                            Valor Social
                        </Badge>
                        <motion.h2 variants={itemVariants as any} className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                            El Corazón de <span className="text-schoMetricsBaseColor">SchoMetrics</span>
                        </motion.h2>
                        <motion.p variants={itemVariants as any} className="text-xl text-muted-foreground text-balance leading-relaxed">
                            Estamos redefiniendo la compra y venta de materiales reciclables a favor de un futuro más limpio.
                        </motion.p>
                    </div>

                    {/* Misión y Visión - Layout Tipo Grid */}
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Tarjeta Misión */}
                        <motion.div
                            variants={itemVariants as any}
                            className="group relative p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-lime-500/30 transition-colors duration-300"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <RefreshCcw className="w-24 h-24 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-lime-500 rounded-full" />
                                Nuestra Misión
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Facilitar la transición hacia una economía circular conectando de manera eficiente a vendedores de materiales reciclables con compradores comprometidos, transformando residuos en recursos valiosos mediante una plataforma digital transparente.
                            </p>
                        </motion.div>

                        {/* Tarjeta Visión */}
                        <motion.div
                            variants={itemVariants as any}
                            className="group relative p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-transparent hover:border-blue-500/30 transition-colors duration-300 "
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Leaf className="w-24 h-24 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-blue-500 rounded-full" />
                                Nuestra Visión
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Ser la plataforma web de comercio de reciclaje más grande y confiable, donde cada comunidad, institución o empresa pueda monetizar sus residuos de manera justa, impulsando el desarrollo económico y ambiental.
                            </p>
                        </motion.div>
                    </div>

                    {/* Sección de Valores */}
                    <div className="space-y-12">
                        <motion.div variants={itemVariants as any} className="text-center">
                            <h3 className="text-3xl font-bold text-slate-900">Nuestros Valores</h3>
                            <p className="mt-4 text-slate-600">Los pilares que sostienen cada intercambio en SchoMetrics.</p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((val, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants as any}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${val.color}`}>
                                        <val.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{val.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {val.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}