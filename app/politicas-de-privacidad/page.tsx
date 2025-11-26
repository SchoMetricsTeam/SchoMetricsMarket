// app/politicas-de-privacidad/page.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PoliticasPrivacidadPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-gray-100 dark:bg-gray-800 rounded-full p-3 w-fit mb-4">
                        <Shield className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Políticas de Privacidad de SchoMetrics
                    </CardTitle>
                    <CardDescription>
                        Última actualización: 4 de Octubre de 2025
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="prose dark:prose-invert max-w-none">
                        <p>
                            En SchoMetrics, la privacidad y seguridad de los datos de nuestros usuarios es nuestra máxima prioridad. Esta Política de Privacidad describe cómo recopilamos, usamos, protegemos y tratamos los datos personales a través de nuestra plataforma, en cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> de México.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">1. Identidad y Domicilio del Responsable</h2>
                        <p>
                            SchoMetrics, con domicilio en <strong>[Dirección Fiscal Completa de SchoMetrics]</strong>, es el responsable del tratamiento de sus datos personales.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">2. Datos Personales que Recabamos</h2>
                        <p>
                            Recopilamos los siguientes datos personales, necesarios para la operación de la plataforma:
                        </p>
                        <ul>
                            <li>
                                <strong>Para Usuarios Escuela y Usuarios Empresa:</strong>
                                <ul className="list-disc pl-5">
                                    <li><strong>Datos de Identificación:</strong> Nombre del representante, nombre de la institución/empresa.</li>
                                    <li><strong>Datos de Contacto:</strong> Correo electrónico, número de teléfono, domicilio de recolección.</li>
                                    <li><strong>Datos Fiscales:</strong> Registro Federal de Contribuyentes (RFC).</li>
                                    <li><strong>Datos Financieros:</strong> Número de Cuenta Clave Bancaria Estandarizada (CLABE) para procesar los pagos y transferencias.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, cookies y otras tecnologías de rastreo para mejorar la experiencia en el sitio.
                            </li>
                        </ul>

                        <h2 className="font-semibold text-xl mt-6">3. Finalidades del Tratamiento de Datos</h2>
                        <p>Sus datos personales son utilizados para las siguientes finalidades esenciales:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Crear y gestionar su cuenta en la plataforma.</li>
                            <li>Facilitar la comunicación entre Usuarios Escuela y Usuarios Empresa para coordinar la compra-venta y recolección de materiales.</li>
                            <li>Procesar, validar y ejecutar las transacciones financieras (transferencias bancarias) de forma segura.</li>
                            <li>Emitir comprobantes correspondientes.</li>
                            <li>Brindar soporte técnico y atender sus solicitudes a través de nuestro correo de contacto.</li>
                        </ol>
                        <p>Adicionalmente, podemos usar sus datos para finalidades secundarias como análisis estadístico y mejora de nuestros servicios. Usted puede oponerse a este uso en cualquier momento.</p>

                        <h2 className="font-semibold text-xl mt-6">4. Transferencia de Datos Personales</h2>
                        <p>
                            SchoMetrics no vende sus datos personales. Solo se comparten datos con terceros cuando es estrictamente necesario para cumplir con las finalidades descritas:
                        </p>
                        <ul>
                            <li>
                                <strong>Entre usuarios:</strong> Se compartirá la información de contacto y domicilio necesaria entre el Usuario Escuela y el Usuario Empresa una vez que una transacción ha sido acordada, con el único fin de coordinar la logística de recolección.
                            </li>
                            <li>
                                <strong>Por requerimiento legal:</strong> Podremos divulgar sus datos si así lo requiere una autoridad competente.
                            </li>
                        </ul>

                        <h2 className="font-semibold text-xl mt-6">5. Ejercicio de los Derechos ARCO</h2>
                        <p>
                            Conforme a la LFPDPPP, usted tiene derecho a <strong>Acceder, Rectificar, Cancelar</strong> sus datos personales, así como a <strong>Oponerse</strong> a su tratamiento (Derechos ARCO). Para ejercer cualquiera de estos derechos, por favor envíe una solicitud detallada a nuestro correo electrónico de contacto.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">6. Uso de Cookies</h2>
                        <p>
                            Nuestra plataforma utiliza cookies y tecnologías similares para mejorar la funcionalidad del sitio, recordar sus preferencias y analizar el tráfico. Usted puede gestionar o deshabilitar las cookies a través de la configuración de su navegador.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">7. Seguridad de los Datos</h2>
                        <p>
                            Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o el uso, acceso o tratamiento no autorizado.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">8. Cambios a la Política de Privacidad</h2>
                        <p>
                            SchoMetrics se reserva el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad. Cualquier cambio será notificado a través de nuestra plataforma o por correo electrónico.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">9. Contacto</h2>
                        <p>
                            Para cualquier duda o comentario acerca de nuestra Política de Privacidad, o para ejercer sus derechos ARCO, por favor contáctenos en: <a href="mailto:soporte@schometrics.com" className="text-blue-600 dark:text-blue-400 hover:underline">soporte@schometrics.com</a>.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}