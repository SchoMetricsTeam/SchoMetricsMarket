"use client";

import Link from "next/link";
import { Suspense } from "react";
import { motion } from 'motion/react';
import SellerLoginForm from "./SellerLoginForm";
import { Shield, TrendingUp, Zap } from "lucide-react";

function LoginFormSkeleton() {
    return (
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl animate-pulse">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-12 w-40 rounded-lg bg-linear-to-r from-slate-200 to-slate-300"></div>
                    <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-8 w-3/4 rounded-lg bg-linear-to-r from-slate-200 to-slate-300"></div>
                    <div className="h-5 w-full rounded bg-slate-200"></div>
                </div>
                <div className="h-20 w-full rounded-xl bg-slate-100"></div>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="h-4 w-1/3 rounded bg-slate-200"></div>
                    <div className="h-12 w-full rounded-lg bg-slate-200"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-1/3 rounded bg-slate-200"></div>
                    <div className="h-12 w-full rounded-lg bg-slate-200"></div>
                </div>
                <div className="mt-6 h-12 w-full rounded-lg bg-linear-to-r from-violet-200 to-purple-200"></div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]" />

            <div className="absolute left-1/4 top-20 h-96 w-96 animate-pulse rounded-full bg-linear-to-br from-indigo-300/30 to-purple-400/30 blur-3xl" style={{ animationDuration: '4s' }} />
            <div className="absolute right-1/4 bottom-20 h-96 w-96 animate-pulse rounded-full bg-linear-to-tr from-purple-300/30 to-indigo-400/30 blur-3xl" style={{ animationDuration: '6s', animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.2,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-8 flex flex-wrap items-center justify-center gap-4"
                >
                    <div className="group flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-lg shadow-indigo-500/10 backdrop-blur-sm transition-all duration-300 hover:shadow-indigo-500/20">
                        <div className="rounded-full bg-indigo-100 p-1.5 text-sellerBaseColor transition-transform duration-300 group-hover:scale-110">
                            <Shield className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Seguro</span>
                    </div>
                    <div className="group flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-lg shadow-purple-500/10 backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/20">
                        <div className="rounded-full bg-indigo-100 p-1.5 text-sellerBaseColor transition-transform duration-300 group-hover:scale-110">
                            <Zap className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Rápido</span>
                    </div>
                    <div className="group flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-lg shadow-indigo-500/10 backdrop-blur-sm transition-all duration-300 hover:shadow-indigo-500/20">
                        <div className="rounded-full bg-indigo-100 p-1.5 text-sellerBaseColor transition-transform duration-300 group-hover:scale-110">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Confiable</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Suspense fallback={<LoginFormSkeleton />}>
                        <SellerLoginForm />
                    </Suspense>
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-block rounded-xl bg-white/60 px-6 py-4 backdrop-blur-sm">
                        <p className="text-sm text-slate-600">
                            © {new Date().getFullYear()}{" "}
                            <span className="font-semibold bg-linear-to-r from-sellerBaseColor to-sellerBaseColor bg-clip-text text-transparent">
                                SchoMetrics
                            </span>
                            . Todos los derechos reservados.
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
                            <Link
                                href="https://schometrics.com/terminos-y-condiciones"
                                className="transition-colors hover:text-sellfrom-sellerBaseColor"
                            >
                                Términos
                            </Link>
                            <span className="text-slate-300">•</span>
                            <Link
                                href="https://schometrics.com/politicas-de-privacidad"
                                className="transition-colors hover:text-sellfrom-sellerBaseColor"
                            >
                                Privacidad
                            </Link>
                        </div>
                    </div>
                </motion.footer>
            </motion.div>
        </div>
    );
}
