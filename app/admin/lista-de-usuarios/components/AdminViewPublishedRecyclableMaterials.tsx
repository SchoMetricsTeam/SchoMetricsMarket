import LoaderCircle from "@/app/components/LoaderCircle";
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MaterialStatus, MaterialType } from "@/generated/prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Box,
    Download,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AdminViewPublishedRecyclableMaterials {
    id: string,
    userId: string,
    title: string,
    materialType: MaterialType,
    quantity: number,
    city: string,
    state: string,
    postalCode: string,
    address: string,
    latitude: number,
    longitude: number,
    schedule: string,
    images: Array<{
        id: string
        url: string
        order: number
    }>
    status: MaterialStatus,
    createdAt: string,
    updatedAt: string,
}

interface PublishedRecyclableMaterialsProps {
    userId: string;
}

const AdminViewPublishedRecyclableMaterials: React.FC<PublishedRecyclableMaterialsProps> = ({ userId }) => {
    const [publishedMaterials, setPublishedMaterials] = useState<AdminViewPublishedRecyclableMaterials[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPublishedMaterials = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/users/profiles/seller/publishedReyclableMaterials/${userId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Error al cargar los materiales reciclables publicados.",
                );
            }
            const data: AdminViewPublishedRecyclableMaterials[] = await response.json();
            setPublishedMaterials(data);
        } catch (error) {
            console.error("Error al cargar los materiales reciclables publicados:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error desconocido al cargar los materiales reciclables publicados.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPublishedMaterials();
    }, [fetchPublishedMaterials]);

    const downloadReceipt = async (materialId: string) => {
        try {
            // Buscar la compra asociada a este material
            const response = await fetch(`/api/admin/users/profiles/seller/material-purchase/${materialId}`)
            if (!response.ok) {
                throw new Error("No se encontró la compra asociada")
            }

            const purchaseData = await response.json()

            // Descargar el comprobante
            const receiptResponse = await fetch(`/api/admin/users/profiles/seller/download-receipt/${purchaseData.id}`)
            if (!receiptResponse.ok) {
                throw new Error("Error al generar el comprobante")
            }

            const blob = await receiptResponse.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.style.display = "none"
            a.href = url
            a.download = `comprobante-${publishedMaterials.find((material) => material.id === materialId)?.title}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success("Comprobante descargado exitosamente")
        } catch (error) {
            console.error("Error descargando comprobante:", error)
            toast.error("Error al descargar el comprobante")
        }
    }

    const MATERIAL_TYPE: { [materialType: string]: string } = {
        PLASTICO: "Plástico",
        PAPEL: "Papel",
        VIDRIO: "Vidrio",
        ORGANICO: "Orgánico",
        ALUMINIO: "Aluminio",
    };
    return (
        <div className="">
            {/* Sección de Materiales Reciclables Publicados */}
            <div className="flex flex-col items-start gap-2 text-sm">
                <div className="flex mt-10 gap-2 w-full bg-lime-600 rounded-lg items-center justify-center text-center text-white py-2 font-bold">
                    <Box className="h-6 w-6 animate-spin" />
                    Materiales Reciclables Publicados:
                </div>
                {/*  */}
                <Card className="w-full p-2 bg-zinc-900 border-none shadow-md shadow-zinc-700 text-white">
                    {isLoading ? (
                        <LoaderCircle />
                    ) : error ? (
                        <div className="py-10 text-center text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : publishedMaterials.length > 0 ? (
                        <>
                            <div className="h-[400px] w-full overflow-auto p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center font-bold text-lime-500 uppercase">
                                                Fecha de Publicación
                                            </TableHead>
                                            <TableHead className="text-center font-bold text-lime-500 uppercase">
                                                Título
                                            </TableHead>
                                            <TableHead className="text-center font-bold text-lime-500 uppercase">
                                                Tipo de Material
                                            </TableHead>
                                            <TableHead className="text-center font-bold text-lime-500 uppercase">
                                                Cantidad de Material
                                            </TableHead>
                                            <TableHead className="text-center font-bold text-lime-500 uppercase">
                                                Disponibilidad
                                            </TableHead>
                                            <TableHead className="text-center font-bold text-lime-500 uppercase">
                                                Horario de Atención
                                            </TableHead>
                                            <TableHead className="text-center font-bold text-lime-500 uppercase">
                                                Evidencias
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {publishedMaterials.map((published) => (
                                            <TableRow key={published.id}>
                                                <TableCell className="w-[100px] text-center font-bold text-gray-500">
                                                    {format(
                                                        new Date(published.createdAt),
                                                        "dd MMM, yyyy",
                                                        { locale: es },
                                                    )}
                                                </TableCell>
                                                <TableCell className="flex items-center justify-center gap-4 text-center font-bold text-amber-500">
                                                    {published.title}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold text-gray-400">
                                                    {MATERIAL_TYPE[published.materialType] ||
                                                        published.materialType}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold text-gray-400">
                                                    {published.quantity} Kg
                                                </TableCell>
                                                <TableCell
                                                    className={
                                                        published.status === "AVAILABLE"
                                                            ? "text-orange-500 font-bold text-lg text-center uppercase"
                                                            : published.status === "PURCHASED"
                                                                ? "text-green-500 font-bold text-lg text-center uppercase"
                                                                : "text-gray-100 font-bold text-lg text-center uppercase"
                                                    }>
                                                    {
                                                        published.status === "AVAILABLE" ? "DISPONIBLE" : "COMPRADO"
                                                    }
                                                </TableCell>
                                                <TableCell className="text-start font-semibold text-gray-400">
                                                    {published.schedule}
                                                </TableCell>
                                                <TableCell className="flex items-center justify-center text-center">
                                                    {/* Image List */}
                                                    {published.images && published.images.length > 0 ? (
                                                        <RecyclableMaterialContentImages visualContent={published.images} />
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No hay imágenes adjuntas para este material.</p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-start font-semibold text-gray-400">
                                                    {published.status === "PURCHASED" && (
                                                        <Button size="sm" variant="outline" onClick={() => downloadReceipt(published.id)} className="bg-white text-green-600 font-semibold hover:text-white hover:bg-green-800 hover:border-transparent cursor-pointer">
                                                            <Download className="mr-1 h-3 w-3 animate-bounce" />
                                                            Descargar Comprobante
                                                        </Button>
                                                    )}
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-3xl font-bold text-gray-400">
                                El usuario no ha publicado ningún material reciclable.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminViewPublishedRecyclableMaterials;
