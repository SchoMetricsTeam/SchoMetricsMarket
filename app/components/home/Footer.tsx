import { ArrowRight, Heart, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t-4 border-double border-lime-300 bg-white backdrop-blur relative">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <Image src="/schometrics-logo.png" alt="SchoMetrics" width={56} height={56} priority />
                            <span className="text-2xl font-bold text-schoMetricsBaseColor">
                                SchoMetrics
                            </span>
                        </div>
                        <p className="text-muted-foreground mb-6 max-w-md leading-relaxed text-lg">
                            Conectando escuelas con empresas recicladoras en México. Transformamos residuos en oportunidades para un
                            futuro más sustentable y próspero.
                        </p>
                        <HeartHandshake className="h-20 w-20 animate-pulse text-lime-500" />
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-6 text-lg">Plataforma</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <Link
                                    href="https://schometrics.com"
                                    target="_blank"
                                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Para Escuelas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/iniciar-sesion/empresas"
                                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Para Empresas
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Cómo Funciona
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-6 text-lg">Soporte</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <Link href="/contacto" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="/terminos-y-condiciones" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Términos de Uso
                                </Link>
                            </li>
                            <li>
                                <Link href="/politicas-de-privacidad" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Privacidad
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        © {new Date().getFullYear()} SchoMetrics. Todos los derechos reservados.
                    </p>
                    <p className="text-sm text-muted-foreground text-center sm:text-right flex items-center">
                        Hecho con <Heart className="mx-2 inline h-4 w-4 text-rose-600 fill-rose-400 animate-pulse" /> en <b className="ml-2 text-green-700">Me</b><b>xi</b><b className="text-red-600">co</b>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;