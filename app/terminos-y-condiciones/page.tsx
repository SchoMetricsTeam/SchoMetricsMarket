// app/terminos-y-condiciones/page.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TerminosCondicionesPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-gray-100 dark:bg-gray-800 rounded-full p-3 w-fit mb-4">
                        <FileText className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Términos y Condiciones de SchoMetrics
                    </CardTitle>
                    <CardDescription>
                        Última actualización: 4 de Octubre de 2025
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="prose dark:prose-invert max-w-none">
                        <p>
                            Bienvenido a SchoMetrics. Estos términos y condiciones describen las reglas y regulaciones para el uso de la plataforma web de SchoMetrics, diseñada para conectar a Escuelas que venden materiales reciclables con Empresas que desean comprarlos.
                        </p>
                        <p>
                            Al acceder a esta plataforma, asumimos que aceptas estos términos y condiciones. No continúes usando SchoMetrics si no estás de acuerdo con todos los términos establecidos en esta página.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">1. Definiciones</h2>
                        <ul>
                            <li><strong>Plataforma:</strong> Se refiere al sitio web y los servicios ofrecidos por SchoMetrics.</li>
                            <li><strong>Usuario Escuela:</strong> Institución educativa registrada que publica y vende materiales reciclables.</li>
                            <li><strong>Usuario Empresa:</strong> Entidad comercial registrada que compra materiales reciclables.</li>
                            <li><strong>Transacción:</strong> El acuerdo de compra-venta de materiales reciclables entre un Usuario Escuela y un Usuario Empresa, facilitado a través de la Plataforma.</li>
                        </ul>

                        <h2 className="font-semibold text-xl mt-6">2. Descripción del Servicio</h2>
                        <p>
                            SchoMetrics actúa como un intermediario tecnológico que facilita la conexión entre Usuarios Escuela que desean vender materiales reciclables (Papel, Plástico, Aluminio, Materia Orgánica) y Usuarios Empresa interesados en su adquisición. SchoMetrics no es el comprador ni el vendedor directo de los materiales.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">3. Cuentas de Usuario</h2>
                        <p>
                            Para utilizar los servicios de compra y venta, los usuarios deben ponerse en contacto a traves del correo electrónico: soporte@schometrics.com. donde se le solicitaran documentos oficiales que acrediten su información y regulación, los usuarios deberán proporcionar información veraz y actualizada. Es responsabilidad del usuario mantener la confidencialidad de su contraseña y cuenta.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">4. Proceso de Transacción y Pagos</h2>
                        <p>
                            Para garantizar la seguridad y validación de cada transacción, SchoMetrics gestiona el flujo de pagos de la siguiente manera:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>
                                <strong>Acuerdo de Compra:</strong> El Usuario Empresa se compromete a comprar un lote de materiales publicado por un Usuario Escuela por un monto total acordado.
                            </li>
                            <li>
                                <strong>Pago a SchoMetrics:</strong> El Usuario Empresa realizará el pago del monto total acordado mediante transferencia electrónica a la cuenta bancaria designada por SchoMetrics. Este pago quedará en custodia.
                            </li>
                            <li>
                                <strong>Validación y Recolección:</strong> Una vez que SchoMetrics valida la recepción de los fondos, se notifica a ambas partes para que coordinen la recolección de los materiales.
                            </li>
                            <li>
                                <strong>Transferencia a la Escuela:</strong> Tras la confirmación de la recolección exitosa, SchoMetrics procederá a transferir los fondos a la cuenta bancaria del Usuario Escuela.
                            </li>
                        </ol>

                        <h2 className="font-semibold text-xl mt-6">5. Comisiones del Servicio</h2>
                        <p>
                            Por su rol como intermediario, facilitador tecnológico y gestor de pagos seguros, SchoMetrics cobrará una comisión de servicio.
                        </p>
                        <ul>
                            <li>
                                La comisión corresponde al <strong>20% sobre el monto total</strong> de la transacción.
                            </li>
                            <li>
                                Esta comisión será deducida automáticamente por SchoMetrics del monto total pagado por el Usuario Empresa antes de realizar la transferencia final al Usuario Escuela. El Usuario Escuela recibirá el 80% del valor total de la venta.
                            </li>
                        </ul>

                        <h2 className="font-semibold text-xl mt-6">6. Obligaciones de los Usuarios</h2>
                        <p><strong>Usuarios Escuela se comprometen a:</strong></p>
                        <ul>
                            <li>Describir de forma precisa la calidad y cantidad (peso en Kg) de los materiales.</li>
                            <li>Asegurar que los materiales estén preparados (limpios, secos, compactados) según las guías de la plataforma.</li>
                        </ul>
                        <p><strong>Usuarios Empresa se comprometen a:</strong></p>
                        <ul>
                            <li>Realizar el pago del monto total acordado en los plazos establecidos.</li>
                            <li>Coordinar y ejecutar la recolección de los materiales de manera puntual.</li>
                        </ul>

                        <h2 className="font-semibold text-xl mt-6">7. Limitación de Responsabilidad</h2>
                        <p>
                            SchoMetrics no se hace responsable de la calidad, seguridad o legalidad de los materiales publicados. La plataforma es un punto de encuentro y la responsabilidad final sobre la transacción recae en los usuarios compradores y vendedores. Nuestro rol se limita a facilitar la conexión y asegurar el proceso de pago.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">8. Modificaciones de los Términos</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Notificaremos a los usuarios de cualquier cambio significativo. El uso continuado de la plataforma después de dichas modificaciones constituirá su aceptación.
                        </p>

                        <h2 className="font-semibold text-xl mt-6">9. Contacto</h2>
                        <p>
                            Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos a través del siguiente correo electrónico: <a href="mailto:soporte@schometrics.com" className="text-blue-600 dark:text-blue-400 hover:underline">soporte@schometrics.com</a>.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}