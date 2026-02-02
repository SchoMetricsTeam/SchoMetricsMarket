"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Calendar, Clock, School, Box, MapPin, X, Trash2, Loader2, RefreshCw, ShoppingCart, UserStar } from "lucide-react"
import LoaderCircle from "@/app/components/LoaderCircle"
import { MATERIAL_TYPE_LABELS } from "@/lib/constants"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"
import { generatePurchaseReceipt, generateAllPurchasesReport } from "@/lib/pdf-generator"
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages"
import { BuyerPurchaseData } from "@/types/types"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Separator } from '@/components/ui/separator';
import { BuyerNavigation } from "@/app/components/buyer/BuyerNavigation"
import Link from "next/link"
import { motion } from "motion/react"


export default function PurchasedMaterialsPage() {
  const [purchases, setPurchases] = useState<BuyerPurchaseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async (page = 1) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/buyer/purchased-materials?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setPurchases(data.purchases)
        setPagination(data.pagination)
      } else {
        toast.error("Error al cargar las compras")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al cargar las compras")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReceipt = async (purchaseId: string, folio: string) => {
    try {
      const response = await fetch(`/api/buyer/download-receipt/${purchaseId}`)
      if (response.ok) {
        const data = await response.json()
        generatePurchaseReceipt(data.purchase)
        toast.success("Comprobante descargado exitosamente")
      } else {
        toast.error("Error al descargar el comprobante")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al descargar el comprobante")
    }
  }

  const downloadAllPurchasesReceipts = async () => {
    try {
      const response = await fetch("/api/buyer/download-all-purchase-receipts")
      if (response.ok) {
        const data = await response.json()
        generateAllPurchasesReport(data.purchases)
        toast.success("Informe de compras descargado exitosamente")
      } else {
        toast.error("Error al descargar el informe")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al descargar el informe")
    }
  }

  const handleDelete = async ({ purchasedMaterialId }: { purchasedMaterialId: string }) => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/buyer/purchased-materials/${purchasedMaterialId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el intento de compra.");
      }
      toast.success("Intento de compra eliminado correctamente.");

      // Vuelve a cargar los datos para refrescar la tabla
      // Si el usuario borra el último elemento de una página, lo regresa a la página anterior
      if (purchases.length === 1 && pagination.page > 1) {
        await fetchPurchases(pagination.page - 1);
      } else {
        await fetchPurchases(pagination.page);
      }
    } catch (err) {
      console.error("Error eliminando intento de compra:", err);
      toast.error(
        err instanceof Error ? err.message : "No se pudo eliminar el intento de compra.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <BuyerNavigation />
        <LoaderCircle />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-buyer">
      <BuyerNavigation />
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col items-start justify-center gap-3">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-linear-to-br from-emerald-100/20 to-teal-500/20 rounded-lg border border-emerald-300/30">
                <ShoppingCart className="h-6 w-6 text-teal-500" />
              </div>
              <h1 className="text-4xl font-bold text-teal-600">
                Mis Compras
              </h1>
            </div>
            <p className="text-zinc-600 text-lg leading-relaxed">
              Aquí encontrarás la tabla de tus compras realizadas, puedes descargar el Comprobante de manera individual por cada compra o descargar el Informe de Compras Totales
            </p>
          </div>
          {purchases.length > 0 && (
            <Button onClick={downloadAllPurchasesReceipts} className="flex items-center gap-2 cursor-pointer bg-teal-600 text-white border-none hover:bg-teal-700 relative">
              <FileText className="h-4 w-4" />
              Descargar Informe de Compras Totales
            </Button>
          )}
        </div>

        {purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 rounded-2xl border border-teal-200 bg-[#f7fffc] p-6 shadow-xl shadow-teal-100"
          >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Box className="h-12 w-12 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-teal-700">No tienes compras realizadas</h3>
              <p className="text-muted-foreground text-center mb-4">
                Cuando realices tu primera compra de materiales reciclables, aparecerá aquí.
              </p>
              <Button className="bg-teal-700 text-white hover:text-white hover:bg-teal-800 cursor-pointer">
                <a href="/comprador/materiales-disponibles">Ver Materiales Disponibles</a>
              </Button>
            </CardContent>
          </motion.div>

        ) : (
          <Card className="bg-[#001817] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Historial de Compras ({pagination.total} compras)
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
                      <TableHead className="flex gap-2 items-center justify-center text-purple-500 font-bold text-center uppercase">
                        <UserStar className="h-4 w-4 text-purple-500" />
                        Vendedor
                      </TableHead>
                      <TableHead className="text-sky-600 uppercase font-bold text-center">Cantidad</TableHead>
                      <TableHead className="text-green-600 uppercase font-bold text-center">Monto $</TableHead>
                      <TableHead className="text-blue-300 uppercase font-bold text-center">Fecha de Compra</TableHead>
                      <TableHead className="text-blue-300 uppercase font-bold text-center">Fecha de Recolección</TableHead>
                      <TableHead className="text-blue-300 uppercase font-bold text-center">Visualización</TableHead>
                      <TableHead className="text-blue-300 uppercase font-bold text-center">¿Cómo llegar?</TableHead>
                      <TableHead className="text-blue-300 uppercase font-bold text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono text-lg font-bold text-teal-500 tracking-wider px-3">{purchase.purchaseFolio}</TableCell>
                        <TableCell className="uppercase">
                          <Badge
                            className={
                              purchase.paymentStatus === "COMPLETED" ? "bg-green-500 text-white font-bold hover:bg-green-600 w-max" :
                                purchase.paymentStatus === "PENDING" ? "bg-yellow-500 text-white font-bold hover:bg-yellow-600 w-max" :
                                  purchase.paymentStatus === "FAILED" ?
                                    "bg-red-500 text-white hover:bg-red-600 w-max" :
                                    "bg-blue-500 text-white hover:bg-blue-600 w-max"
                            }
                          >
                            {purchase.paymentStatus === "COMPLETED" ? "Completado" :
                              purchase.paymentStatus === "PENDING" ? "En Revisión" :
                                purchase.paymentStatus === "FAILED" ?
                                  "Pago Fallido" :
                                  "Rembolsado"
                            }
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center px-4">
                          <div className="space-y-1">
                            <p className="text-orange-600 font-semibold">{purchase.material.title}</p>
                            <Badge variant="outline" className="text-xs bg-orange-500 border-none text-white">
                              {
                                MATERIAL_TYPE_LABELS[
                                purchase.material.materialType as keyof typeof MATERIAL_TYPE_LABELS
                                ]
                              }
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold uppercase text-purple-600">{purchase.material.user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <span className="font-bold text-sky-600">{purchase.material.quantity} kg</span>
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <span className="font-bold text-green-600">
                            ${purchase.totalAmount} MXN
                          </span>
                        </TableCell>
                        <TableCell className="px-4">
                          {format(new Date(purchase.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className="text-sm">
                                {format(new Date(purchase.collectionDate), "dd/MM/yyyy", { locale: es })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm">{purchase.collectionTime}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center justify-center text-center">
                          {/* Image List */}
                          {purchase.material.images && purchase.material.images.length > 0 ? (
                            <RecyclableMaterialContentImages visualContent={purchase.material.images} />
                          ) : (
                            <p className="text-sm text-gray-500">No hay imágenes adjuntas para este material.</p>
                          )}
                        </TableCell>
                        <TableCell>
                          {
                            purchase.paymentStatus === "COMPLETED" ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Link
                                    href={purchase.material.location}
                                    target="_blank"
                                    className="bg-blue-600 hover:bg-blue-700 text-white border-none transition-all cursor-pointer hover:text-white px-3 py-2 flex gap-2 items-center rounded-md text-sm"
                                  >
                                    <MapPin className="mr-1 h-4 w-4" />
                                    ¿Cómo llegar?
                                  </Link>
                                </div>
                              </div>
                            ) : purchase.paymentStatus === "PENDING" ? (
                              <div className="space-y-1 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <Clock className="h-5 w-5 animate-spin" />
                                  <p>Estamos Revisando el Comprobante de Transferencia Bancaria, esto puede tardar hasta 24 hrs.</p>
                                </div>
                              </div>
                            ) : purchase.paymentStatus === "FAILED" ?
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
                          {purchase.paymentStatus === "COMPLETED" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReceipt(purchase.id, purchase.purchaseFolio)}
                              className="flex items-center gap-1 bg-green-600 text-white border-transparent hover:text-green-600 cursor-pointer hover:border-green-600"
                            >
                              <Download className="h-3 w-3" />
                              Descargar Comprobante
                            </Button>
                          ) : purchase.paymentStatus === "PENDING" ? (
                            <div className="space-y-1 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <Clock className="h-5 w-5 animate-spin" />
                                <p>Estamos Revisando el Comprobante de Transferencia Bancaria, esto puede tardar hasta 24 hrs.</p>
                              </div>
                            </div>
                          ) : purchase.paymentStatus === "FAILED" ?
                            (
                              <div className="flex flex-col items-center gap-1 justify-center">
                                <div className="space-y-1 text-center">
                                  <div className="flex flex-col items-center gap-1 text-red-500 font-bold">
                                    <X className="h-5 w-5 animate-heartbeat" />
                                    <p>No se pudo completar la compra, el pago y el comprobante no fueron aprobados. Intenta de nuevo o comunicate a <b className="text-white">soporte@schometrics.com</b> para más información.</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={isDeleting}
                                        title="Eliminar intento de compra"
                                      >
                                        <Trash2 className="mr-1.5 h-4 w-4" /> Eliminar intento de compra
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Acción de confirmación</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Toca el botón <b>Eliminar</b> para eliminar este intento de compra.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={
                                            () => handleDelete({ purchasedMaterialId: purchase.id })
                                          }
                                          disabled={isDeleting}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          {isDeleting && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          )}{" "}
                                          Eliminar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1 text-center">
                                <div className="flex flex-col items-center gap-1 text-blue-500 font-bold">
                                  <RefreshCw className="h-5 w-5 animate-heartbeat" />
                                  <p>No se pudo completar la compra, el pago fue <b className="uppercase text-white">rembolsado</b> a tu cuenta y el comprobante de reembolso fue enviado a tu correo electrónico. Intenta de nuevo o comunicate a <b className="text-white">soporte@schometrics.com</b> para más información.</p>
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={isDeleting}
                                        title="Eliminar intento de compra"
                                      >
                                        <Trash2 className="mr-1.5 h-4 w-4" /> Eliminar intento de compra
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Acción de confirmación</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Toca el botón <b>Eliminar</b> para eliminar este intento de compra.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={
                                            () => handleDelete({ purchasedMaterialId: purchase.id })
                                          }
                                          disabled={isDeleting}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          {isDeleting && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          )}{" "}
                                          Eliminar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
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
                      onClick={() => fetchPurchases(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchPurchases(pagination.page + 1)}
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
