import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Scale, Leaf, Package, File, BottleWine, PillBottle, Lightbulb, Brain } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SellerNavBar } from "@/app/components/seller/SellerNavBar";

export default function GuiaReciclajePage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white w-full">
            <SellerNavBar />
            <div className="flex flex-col justify-center items-center relative">
                <div className="mb-10 mt-10">
                    <div className="flex flex-col items-center justify-center text-center gap-3 mb-3">
                        <div className="p-2 bg-sellerBaseColor/5 rounded-lg border border-indigo-400">
                            <Lightbulb className="h-6 w-6 text-amber-300" />
                        </div>
                        <h1 className="text-4xl font-bold text-sellerBaseColor">
                            Guía para la Gestión de Materiales Reciclables
                        </h1>
                    </div>
                    <p className="text-zinc-300 text-lg leading-relaxed px-3 text-center">
                        ¡Prepara tus materiales correctamente y maximiza tus ganancias!
                    </p>
                </div>
                <main className="flex flex-col justify-center items-center w-full px-10 mb-10 gap-8 lg:px-20 xl:px-40">
                    {/* Sección de Introducción */}
                    <Card className="w-full bg-[#0b022b] shadow-md shadow-indigo-950 border-indigo-950 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package size={24} />
                                ¿Por qué es importante preparar los materiales?
                            </CardTitle>
                            <CardDescription className="text-amber-300 animate-pulse text-md flex gap-2 items-center">
                                <Brain className="w-5 h-5 text-amber-300" />
                                Una correcta separación y limpieza no solo facilita el tratamiento del material, también
                                aumenta la visibilidad de tus materiales y las probabilidades de su venta se incrementan.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Acordeón con cada material */}
                    <Accordion type="single" collapsible className="w-full">

                        {/* Papel y Cartón */}
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xl font-semibold cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <File className="text-blue-500 animate-heartbeat" /> Papel y Cartón
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 p-4">
                                <h3 className="text-lg font-semibold">Tratamiento Previo:</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Limpio y Seco:</strong> Asegúrate de que todo el papel y cartón esté
                                        completamente seco. El material húmedo puede desarrollar moho y pierde valor.
                                    </li>
                                    <li>
                                        <strong>Sin Contaminantes:</strong> Retira cualquier residuo de comida, plástico (como cintas adhesivas o ventanas de sobres) y grapas metálicas grandes.
                                    </li>
                                    <li>
                                        <strong>Ejemplo Real:</strong> Si una caja de pizza de cartón tiene manchas de grasa, esa parte manchada ya no es reciclable y debe ser separada. Solo la parte limpia se puede vender.
                                    </li>
                                </ul>
                                <h3 className="text-lg font-semibold">Acumulación y Almacenamiento:</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Aplanar Cajas:</strong> Desarma y aplana todas las cajas de cartón. Esto ahorra una cantidad increíble de espacio.
                                    </li>
                                    <li>
                                        <strong>Apilar y Amarrar:</strong> Apila las hojas de papel y el cartón aplanado en bloques ordenados. Utiliza cuerda o rafia para amarrar las pacas y mantenerlas compactas para la recolección.
                                    </li>
                                    <li>
                                        <strong>Lugar Protegido:</strong> Almacena el material bajo un techo para protegerlo de la lluvia y el sol directo.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Plástico (PET, HDPE) */}
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-xl font-semibold cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <BottleWine className="text-green-500 animate-heartbeat" /> Plástico (Botellas, Envases)
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 p-4">
                                <h3 className="text-lg font-semibold">Tratamiento Previo:</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Vaciar y Enjuagar:</strong> Es fundamental vaciar completamente las botellas y envases. Un enjuague rápido con poca agua es suficiente para eliminar residuos de líquidos y evitar malos olores.
                                    </li>
                                    <li>
                                        <strong>Retirar Tapas y Etiquetas:</strong> Separa las tapas y, si es posible, las etiquetas. Estos componentes suelen ser de un plástico diferente y su separación aumenta la calidad del material.
                                    </li>
                                    <li>
                                        <strong>Ejemplo Real:</strong> Las botellas de refresco (PET) deben enjuagarse para quitar el azúcar restante. A las botellas de leche o yogurt (HDPE) se les debe dar un enjuague para evitar que los restos se descompongan.
                                    </li>
                                </ul>
                                <h3 className="text-lg font-semibold">Acumulación y Almacenamiento:</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Compactar:</strong> Después de enjuagar, aplasta las botellas y envases para reducir su volumen. Puedes pisarlas con cuidado. ¡No olvides volver a poner la tapa después de aplastarlas para que no recuperen su forma!
                                    </li>
                                    <li>
                                        <strong>Bolsas Grandes o Contenedores:</strong> Acumula el plástico compactado en costales grandes, sacos de rafia o contenedores específicos. Esto facilita su manejo y transporte.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Aluminio (Latas) */}
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-xl font-semibold cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <PillBottle className="text-red-500 animate-heartbeat" /> Aluminio (Latas)
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 p-4">
                                <h3 className="text-lg font-semibold">Tratamiento Previo:</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Enjuague Ligero:</strong> Al igual que el plástico, enjuaga las latas para eliminar restos de bebidas azucaradas que puedan atraer insectos.
                                    </li>
                                    <li>
                                        <strong>Déjalas Secar:</strong> Escúrrelas bien para evitar la acumulación de líquido en el contenedor de almacenamiento.
                                    </li>
                                </ul>
                                <h3 className="text-lg font-semibold">Acumulación y Almacenamiento:</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Aplastar:</strong> ¡El paso más importante! Aplastar las latas reduce drásticamente el espacio necesario. Una lata aplastada ocupa menos del 20% de su volumen original.
                                    </li>
                                    <li>
                                        <strong>Contenedores Resistentes:</strong> Usa costales o contenedores que no se rompan fácilmente, ya que los bordes de las latas aplastadas pueden ser filosos.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Materia Orgánica */}
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-xl font-semibold cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Leaf className="text-yellow-600 animate-heartbeat" /> Materia Orgánica
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 p-4">
                                <h3 className="text-lg font-semibold">Tratamiento Previo (Compostaje):</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>¿Qué se puede compostar?:</strong> Restos de frutas y verduras, cáscaras de huevo, posos de café, hojas secas, pasto y pequeños trozos de cartón sin tinta.
                                    </li>
                                    <li>
                                        <strong>Evitar:</strong> No incluyas carnes, lácteos, grasas, aceites o alimentos cocinados, ya que generan malos olores y atraen plagas.
                                    </li>
                                    <li>
                                        <strong>Ejemplo Real:</strong> Los restos del almuerzo de los niños, como cáscaras de plátano, corazones de manzana y restos de ensalada, son perfectos para iniciar una composta.
                                    </li>
                                </ul>
                                <h3 className="text-lg font-semibold">Acumulación y Creación de Composta:</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Compostero:</strong> Utiliza un contenedor o un área designada en el patio. Puedes construir uno haciendo una pequeña excavasión en la tierra o usar un bote grande con agujeros para ventilación.
                                    </li>
                                    <li>
                                        <strong>Balance de Materiales:</strong> Alterna capas de material "verde" (húmedo, como restos de comida) con capas de material "marrón" (seco, como hojas secas o cartón). Esto es clave para una buena oxigenación y evitar malos olores.
                                    </li>
                                    <li>
                                        <strong>Humedad y Aireación:</strong> La mezcla debe estar húmeda como una esponja escurrida. Revuelve la composta cada una o dos semanas para airearla y acelerar el proceso. En unos meses, tendrás tierra rica en nutrientes lista para la venta.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Sección de Pesaje */}
                    <Alert className="bg-[#0b022b] shadow-md shadow-indigo-950 border-indigo-950 text-white">
                        <Scale className="h-6 w-6" />
                        <AlertTitle className="font-semibold text-lg">¿Cómo pesar los materiales?</AlertTitle>
                        <AlertDescription className="mt-2 space-y-3 text-purple-200">
                            <p>
                                Obtener el peso correcto en kilogramos (Kg) es crucial para la venta. Aquí tienes métodos prácticos:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>Báscula de Gancho (Para bolsas y costales):</strong> Son económicas y fáciles de usar. Simplemente cuelga el costal de plástico o latas del gancho para obtener el peso. Ideal para volúmenes medianos.
                                </li>
                                <li>
                                    <strong>Báscula de Plataforma (Para pacas y volúmenes grandes):</strong> Es la mejor opción para pesar las pacas de cartón o varios costales a la vez. Coloca el material sobre la plataforma para una lectura precisa.
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </main>
            </div>
        </div>
    );
}