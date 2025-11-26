"use client";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "@/components/ui/animated-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, CircleHelp, Clock, TriangleAlert, X } from "lucide-react";

const correctStates = [
    {
        icon: <CheckCircle className="w-8 h-8 text-green-500" />,
        material: "Comprado",
        payment: "Completado",
        description: "Compra completada exitosamente. El material ha sido pagado y marcado como Comprado."
    },
    {
        icon: <Clock className="w-8 h-8 text-yellow-500" />,
        material: "Pendiente",
        payment: "Pendiente",
        description: "Compra en proceso. Esperando la validación del pago y la verificación del Baucher."
    },
    {
        icon: <X className="w-8 h-8 text-red-500" />,
        material: "Disponible",
        payment: "Fallido",
        description: "El pago falló. El material vuelve a estar Disponible para otros Compradores."
    },
    {
        _icon: <X className="w-8 h-8 text-blue-500" />,
        get icon() {
            return this._icon;
        },
        set icon(value) {
            this._icon = value;
        },
        material: "Disponible",
        payment: "Rembolsado",
        description: "La compra fue reembolsada. El material está Disponible nuevamente."
    }
];

// --- Datos para las inconsistencias ---
const inconsistentStates = [
    { material: "Disponible", payment: "Pendiente" },
    { material: "Disponible", payment: "Completado" },
    { material: "Pendiente", payment: "Completado" },
    { material: "Pendiente", payment: "Fallido" },
    { material: "Pendiente", payment: "Rembolsado" },
    { material: "Comprado", payment: "Pendiente" },
    { material: "Comprado", payment: "Fallido" },
    { material: "Comprado", payment: "Rembolsado" }
];

export function StatusLabelPurchase() {

    return (
        <div className="flex items-center justify-center">
            <Modal>
                <ModalTrigger className="bg-red-600 text-white flex justify-center group/modal-btn animate-pulse">
                    <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                        Estados de Compra
                    </span>
                    <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                        <TriangleAlert className="w-6 h-6" />
                    </div>
                </ModalTrigger>
                <ModalBody>
                    <ModalContent>
                        <Card className="w-full bg-zinc-900 text-white border border-zinc-700 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-center text-zinc-100 tracking-wide">
                                    Leyenda de Estados de Compra
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-6 md:gap-8 p-6">

                                {/* === Sección de Estatus Correctos === */}
                                <div className="space-y-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
                                    <h3 className="text-xl font-semibold text-green-400 border-b-2 border-green-400/30 pb-2 flex items-center gap-2">
                                        ✅ Estatus Correctos
                                    </h3>
                                    <ul className="space-y-4">
                                        {correctStates.map((state, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                <div className="shrink-0 mt-1">{state.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-zinc-200">
                                                        Material: <span className="font-mono bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs">{state.material}</span>
                                                        <br />
                                                        Pago: <span className="font-mono bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs">{state.payment}</span>
                                                    </p>
                                                    <p className="text-sm text-zinc-400 mt-2">{state.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* === Sección de Estatus Incorrectos (Inconsistencias) === */}
                                <div className="space-y-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                                    <h3 className="text-xl font-semibold text-red-400 border-b-2 border-red-400/30 pb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-6 h-6" /> Inconsistencias de Datos
                                    </h3>
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 mt-1">
                                            <CircleHelp className="w-8 h-8 text-red-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-zinc-200">Error de Sincronización</p>
                                            <p className="text-sm text-zinc-400 mt-2">
                                                Cualquier combinación de estados que muestre este ícono: <CircleHelp className="w-5 h-5 text-red-400 animate-heartbeat" /> representa una <b className="text-white">inconsistencia</b> en los datos que debe ser revisada y corregida por un administrador.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="font-semibold text-zinc-300 mb-2">Posibles combinaciones inconsistentes:</p>
                                        <div className="grid grid-cols-1 gap-x-4 gap-y-2">
                                            {inconsistentStates.map((state, index) => (
                                                <div key={index} className="text-sm">
                                                    <span className="font-mono bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md text-xs">{state.material}</span>
                                                    <span className="text-zinc-500 mx-1">+</span>
                                                    <span className="font-mono bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md text-xs">{state.payment}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </ModalContent>
                </ModalBody>
            </Modal>
        </div>
    );
}
