"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Calendar, Clock, Box, MapPin, X, RefreshCw, ShoppingCart, UserStar, BadgeDollarSign } from "lucide-react"
import LoaderCircle from "@/app/components/LoaderCircle"
import { MATERIAL_TYPE_LABELS } from "@/lib/constants"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages"
import { SellerSalesData } from "@/types/types"
import { generateAllSalesReport } from "@/lib/pdf-generator"
import { SellerNavigation } from "@/app/components/seller/SellerNavigation"
import Link from "next/link"


export default function MaySalesPage() {
    const [sales, setSales] = useState<SellerSalesData[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    })

    useEffect(() => {
        fetchSales()
    }, [])

    const fetchSales = async (page = 1) => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/seller/my-sales?page=${page}&limit=10`)
            if (response.ok) {
                const data = await response.json()
                setSales(data.sales)
                setPagination(data.pagination)
            } else {
                toast.error("Error al cargar las ventas")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al cargar las ventas")
        } finally {
            setIsLoading(false)
        }
    }

    const downloadReceipt = async (materialId: string) => {
        try {
            // Lógica de descarga... (Mantenida sin cambios)
            const response = await fetch(`/api/seller/material-purchase/${materialId}`)
            if (!response.ok) {
                throw new Error("No se encontró la venta asociada")
            }

            const saleData = await response.json()

            const receiptResponse = await fetch(`/api/seller/download-receipt/${saleData.id}`)
            if (!receiptResponse.ok) {
                throw new Error("Error al generar el comprobante de venta")
            }

            const blob = await receiptResponse.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.style.display = "none"
            a.href = url
            a.download = `Comprobante-de-Venta:${sales?.find((materialSale) => materialSale.material.id === materialId)?.material.title || "descarga"}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success("Comprobante de venta descargado exitosamente")
        } catch (error) {
            console.error("Error descargando comprobante de venta:", error)
            toast.error("Error al descargar el comprobante de venta")
        }
    }

    const downloadAllSalesReceipts = async () => {
        try {
            const response = await fetch("/api/seller/download-all-sales-receipts")
            if (response.ok) {
                const data = await response.json()
                generateAllSalesReport(data.sales)
                toast.success("Informe de ventas descargado exitosamente")
            } else {
                toast.error("Error al descargar el informe de ventas")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al descargar el informe de ventas")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950">
                <SellerNavigation />
                <LoaderCircle />
            </div>
        )
    }

    const commissionAmoun = (totalAmount: number) => {
        return (totalAmount * 0.2)
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <SellerNavigation />
            <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col items-start justify-center gap-3">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-linear-to-br from-green-600 to-lime-500 rounded-lg border border-sellerBaseColor/30">
                                <BadgeDollarSign className="h-6 w-6 text-white animate-spin" />
                            </div>
                            <h1 className="text-4xl font-bold text-lime-500">
                                Mis Ventas
                            </h1>
                        </div>
                        <p className="text-zinc-300 text-lg leading-relaxed">
                            Aquí encontrarás la tabla de tus ventas realizadas, puedes descargar el Comprobante de manera individual por cada venta o descargar el Informe de Ventas Totales
                        </p>
                    </div>
                    {sales?.length !== 0 && (
                        <Button onClick={downloadAllSalesReceipts} className="flex items-center gap-2 cursor-pointer bg-lime-600 text-white border-none hover:bg-lime-700 relative">
                            <FileText className="h-4 w-4" />
                            Descargar Informe de Ventas Totales
                        </Button>
                    )}
                </div>

                {sales?.length === 0 ? (
                    <Card className="relative border border-teal-100 shadow-md shadow-teal-100">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Box className="h-12 w-12 text-sellerBaseColor mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-sellerBaseColor">No tienes ventas realizadas</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Cuando realices tu primera venta, aparecerá aquí.
                            </p>
                            <Button className="bg-indigo-600 text-white hover:text-white hover:bg-indigo-700 cursor-pointer">
                                <a href="/comprador/materiales-disponibles">Ver Materiales Disponibles</a>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-[#001817] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <BadgeDollarSign className="h-5 w-5" />
                                Historial de Ventas ({pagination.total} venta)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">Folio de Validez</TableHead>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">Estado de Pago</TableHead>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">Material</TableHead>
                                            <TableHead className="flex gap-2 items-center justify-center text-teal-500 font-bold text-center uppercase">
                                                <UserStar className="h-4 w-4 text-teal-500" />
                                                Comprador
                                            </TableHead>
                                            <TableHead className="text-sky-600 uppercase font-bold text-center">Cantidad</TableHead>
                                            <TableHead className="text-green-600 uppercase font-bold text-center">Monto $ pagado por comprador</TableHead>
                                            <TableHead className="text-lime-500 uppercase font-bold text-center">Monto $ a Recibir</TableHead>
                                            <TableHead className="text-schoMetricsBaseColor uppercase font-bold text-center">Comisión $ de SchoMetrics (20%)</TableHead>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">Fecha de Compra</TableHead>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">Fecha de Recolección</TableHead>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">Visualización</TableHead>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">¿Cómo llegar?</TableHead>
                                            <TableHead className="text-blue-300 uppercase font-bold text-center">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sales?.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell className="font-mono text-lg font-bold text-teal-500 tracking-wider px-3">{sale.purchaseFolio}</TableCell>
                                                <TableCell className="uppercase">
                                                    <Badge
                                                        className={
                                                            sale.paymentStatus === "COMPLETED" ? "bg-green-500 text-white font-bold hover:bg-green-600 w-max" :
                                                                sale.paymentStatus === "PENDING" ? "bg-yellow-500 text-white font-bold hover:bg-yellow-600 w-max" :
                                                                    sale.paymentStatus === "FAILED" ?
                                                                        "bg-red-500 text-white hover:bg-red-600 w-max" :
                                                                        "bg-blue-500 text-white hover:bg-blue-600 w-max"
                                                        }
                                                    >
                                                        {sale.paymentStatus === "COMPLETED" ? "Completado" :
                                                            sale.paymentStatus === "PENDING" ? "En Revisión" :
                                                                sale.paymentStatus === "FAILED" ?
                                                                    "Pago Fallido" :
                                                                    "Rembolsado"
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center px-4">
                                                    <div className="space-y-1">
                                                        <p className="text-orange-600 font-semibold">{sale.material.title}</p>
                                                        <Badge variant="outline" className="text-xs bg-orange-500 border-none text-white">
                                                            {
                                                                MATERIAL_TYPE_LABELS[
                                                                sale.material.materialType as keyof typeof MATERIAL_TYPE_LABELS
                                                                ]
                                                            }
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold uppercase text-teal-600">{sale.buyerName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <span className="font-bold text-sky-600">{sale.material.quantity} kg</span>
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <span className="font-bold text-green-400">
                                                        ${sale.totalAmount} MXN
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <span className="font-bold text-lime-500 text-xl">
                                                        ${
                                                            sale.totalAmount - commissionAmoun(sale.totalAmount)
                                                        } MXN
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <span className="font-bold text-blue-300">
                                                        ${commissionAmoun(sale.totalAmount).toFixed(2)} MXN
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4">
                                                    {format(new Date(sale.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span className="text-sm">
                                                                {format(new Date(sale.collectionDate), "dd/MM/yyyy", { locale: es })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="text-sm">{sale.collectionTime}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex items-center justify-center text-center">
                                                    {/* Image List */}
                                                    {sale.material.images && sale.material.images.length > 0 ? (
                                                        <RecyclableMaterialContentImages visualContent={sale.material.images} />
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No hay imágenes adjuntas para este material.</p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        sale.paymentStatus === "COMPLETED" ? (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Link
                                                                        href={sale.material.location}
                                                                        target="_blank"
                                                                        className="bg-gray-700 hover:bg-gray-600 text-white border-none transition-all cursor-pointer hover:text-white px-3 py-2 flex gap-2 items-center rounded-md text-sm"
                                                                    >
                                                                        <MapPin className="mr-1 h-4 w-4" />
                                                                        Ver Ubicación
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ) : sale.paymentStatus === "PENDING" ? (
                                                            <div className="space-y-1 text-center">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Clock className="h-5 w-5 animate-spin" />
                                                                    <p>Estamos Revisando el Comprobante de Transferencia Bancaria, esto puede tardar hasta 24 hrs.</p>
                                                                </div>
                                                            </div>
                                                        ) : sale.paymentStatus === "FAILED" ?
                                                            (
                                                                <div className="space-y-1 text-center">
                                                                    <div className="flex flex-col items-center gap-1 text-red-500 font-bold">
                                                                        <X className="h-5 w-5 animate-heartbeat" />
                                                                        <p>No se pudo completar la compra, el pago y el comprobante no fueron aprobados. Intenta de nuevo o comunicate a <b className="text-white">soporte@schometrics.com</b> para más información.</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-1 text-center">
                                                                    <div className="flex flex-col items-center gap-1 text-blue-500 font-bold">
                                                                        <RefreshCw className="h-5 w-5 animate-heartbeat" />
                                                                        <p>No se pudo completar la compra, el pago fue <b className="uppercase text-white">rembolsado</b> a tu cuenta y el comprobante de reembolso fue enviado a tu correo electrónico. Intenta de nuevo o comunicate a <b className="text-white">soporte@schometrics.com</b> para más información.</p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                </TableCell>
                                                <TableCell>
                                                    {sale.material.status === "PURCHASED" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => downloadReceipt(sale.material.id)}
                                                            className="bg-green-600 text-white font-semibold hover:bg-green-500 transition-all shadow-md shadow-green-700/50 cursor-pointer"
                                                        >
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

                            {/* Paginación */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-muted-foreground">
                                        Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                                        {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} compras
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchSales(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchSales(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
