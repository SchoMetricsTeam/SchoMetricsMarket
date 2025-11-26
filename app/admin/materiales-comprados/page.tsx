"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Calendar, Clock, Box, MapPin, Save, Loader2, RefreshCw, Trash2, X, CheckCircle, CircleHelp, ArrowLeftCircle } from "lucide-react"
import LoaderCircle from "@/app/components/LoaderCircle"
import { MATERIAL_TYPE_LABELS } from "@/lib/constants"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"
import { generatePurchaseReceipt, generateAllPurchasesReport } from "@/lib/pdf-generator"
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages"
import { AdminNavigation } from "@/app/components/admin/AdminNavigation"
import { BuyerPurchaseData } from "@/types/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { StatusLabelPurchase } from "./components/StatusLabelPurchase"
import Link from "next/link"


interface StatusChanges {
  [purchaseId: string]: {
    materialStatus?: string
    paymentStatus?: string
  }
}
export default function AdminPurchasedPage() {
  const [purchases, setPurchases] = useState<BuyerPurchaseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusChanges, setStatusChanges] = useState<StatusChanges>({})
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
      const response = await fetch(`/api/admin/purchased-materials?page=${page}&limit=10`)
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
      const response = await fetch(`/api/admin/download-receipt/${purchaseId}`)
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

  const downloadAllReceipts = async () => {
    try {
      const response = await fetch("/api/admin/download-all-receipts")
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

  const saveStatusChanges = async (purchaseId: string) => {
    const changes = statusChanges[purchaseId]
    if (!changes) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/admin/purchase-status/${purchaseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      })

      if (response.ok) {
        toast.success("Estados actualizados correctamente")
        // Update local state
        setPurchases((prev) =>
          prev.map((purchase) => {
            if (purchase.id === purchaseId) {
              return {
                ...purchase,
                paymentStatus: changes.paymentStatus || purchase.paymentStatus,
                material: {
                  ...purchase.material,
                  status: changes.materialStatus || purchase.material.status,
                },
              }
            }
            return purchase
          }),
        )
        // Clear changes for this purchase
        setStatusChanges((prev) => {
          const newChanges = { ...prev }
          delete newChanges[purchaseId]
          return newChanges
        })
      } else {
        const error = await response.json()
        toast.error(error.message || "Error al actualizar estados")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al actualizar estados")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = (purchaseId: string, type: "materialStatus" | "paymentStatus", value: string) => {
    setStatusChanges((prev) => ({
      ...prev,
      [purchaseId]: {
        ...prev[purchaseId],
        [type]: value,
      },
    }))
  }

  const handleDelete = async ({ purchasedMaterialId }: { purchasedMaterialId: string }) => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/purchased-materials/${purchasedMaterialId}`,
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

  const commissionAmoun = (totalAmount: number) => {
    return (totalAmount * 0.2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <AdminNavigation />
        <LoaderCircle />
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white bg-black">
      <AdminNavigation />

      <div className=" mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-center gap-3">
          <div>
            <h1 className="text-3xl font-bold mb-2">Materiales Reciclables Comprados</h1>
            <p className="text-zinc-300">Historial completo de todas las compras de materiales reciclables</p>
          </div>
          <div className="flex gap-2 items-center mt-5">
            <StatusLabelPurchase />
            <ArrowLeftCircle className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div className="flex flex-col justify-center items-start w-full gap-2 md:flex-row md:justify-between">
            {purchases.length > 0 && (
              <Button onClick={downloadAllReceipts} className="flex items-center gap-2 bg-green-700 text-white border-none hover:bg-green-800 hover:text-white cursor-pointer mt-10">
                <FileText className="h-4 w-4" />
                Descargar Informe de Compras
              </Button>
            )}
            <Button onClick={() => fetchPurchases(pagination.page)} disabled={isLoading} className="flex items-center gap-2 bg-lime-400 text-black border-none hover:bg-lime-500 hover:text-white cursor-pointer">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualizar datos
            </Button>
          </div>
        </div>

        {purchases.length === 0 ? (
          <Card className="bg-zinc-900 text-white border border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Box className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aún no se realizan compras</h3>
              <p className="text-muted-foreground text-center mb-4">
                Cuando realicen compras de materiales reciclables, aparecerán aquí.
              </p>
              <Button asChild className="cursor-pointer bg-slate-700 hover:bg-slate-800 text-white border-none">
                <a href="/admin/materiales-disponibles">Ver Materiales Disponibles</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-zinc-900 text-white border border-zinc-800">
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
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Estado</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Folio de Validez</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Material</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Vendedor</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Identificador de Cuenta (Vendedor)</TableHead>
                      <TableHead className="text-teal-300 uppercase font-bold text-center">COMPRADOR</TableHead>
                      <TableHead className="text-teal-300 uppercase font-bold text-center">Identificador de Cuenta (Comprador)</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Cantidad (Kg)</TableHead>
                      <TableHead className="text-green-600 uppercase font-bold text-center">Monto $ pagado por comprador</TableHead>
                      <TableHead className="text-lime-500 uppercase font-bold text-center">Monto $ → Vendedor</TableHead>
                      <TableHead className="text-blue-300 uppercase font-extrabold text-center">Comisión $ de SchoMetrics (20%)</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Fecha de Compra</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Fecha de Recolección</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Evidencias</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">¿Cómo llegar?</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Estado de Disponibilidad de Material</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Estado de Pago</TableHead>
                      <TableHead className="text-green-300 uppercase font-bold text-center">Guardar Cambios</TableHead>
                      <TableHead className="text-lime-200 uppercase font-bold text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono text-sm">
                          {
                            purchase.material.status === "AVAILABLE" && purchase.paymentStatus === "FAILED" && (
                              <X className="w-7 h-7 text-red-600" />
                            )
                          }
                          {
                            purchase.material.status === "AVAILABLE" && purchase.paymentStatus === "REFUNDED" && (
                              <X className="w-7 h-7 text-blue-600" />
                            )
                          }
                          {
                            purchase.material.status === "AVAILABLE" && purchase.paymentStatus === "PENDING" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                          {
                            purchase.material.status === "AVAILABLE" && purchase.paymentStatus === "COMPLETED" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                          {
                            purchase.material.status === "PENDING" && purchase.paymentStatus === "PENDING" && (
                              <Clock className="w-7 h-7 text-yellow-500 animate-spin" />
                            )
                          }
                          {
                            purchase.material.status === "PENDING" && purchase.paymentStatus === "COMPLETED" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                          {
                            purchase.material.status === "PENDING" && purchase.paymentStatus === "FAILED" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                          {
                            purchase.material.status === "PENDING" && purchase.paymentStatus === "REFUNDED" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                          {
                            purchase.material.status === "PURCHASED" && purchase.paymentStatus === "COMPLETED" && (
                              <CheckCircle className="w-7 h-7 text-green-600" />
                            )
                          }
                          {
                            purchase.material.status === "PURCHASED" && purchase.paymentStatus === "PENDING" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                          {
                            purchase.material.status === "PURCHASED" && purchase.paymentStatus === "FAILED" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                          {
                            purchase.material.status === "PURCHASED" && purchase.paymentStatus === "REFUNDED" && (
                              <CircleHelp className="w-7 h-7 text-red-400 animate-heartbeat" />
                            )
                          }
                        </TableCell>
                        <TableCell
                          className={
                            purchase.material.status === "PURCHASED" && purchase.paymentStatus === "COMPLETED" ?
                              "font-mono text-lg text-green-300 tracking-wider font-semibold" :
                              "font-mono text-lg text-orange-300 tracking-wider font-semibold"
                          }
                        >
                          {purchase.purchaseFolio}
                        </TableCell>
                        <TableCell className="text-center px-5">
                          <div className="space-y-1">
                            <p className="font-medium">{purchase.material.title}</p>
                            <Badge variant="outline" className="text-xs bg-orange-500 border-none text-white">
                              {
                                MATERIAL_TYPE_LABELS[
                                purchase.material.materialType as keyof typeof MATERIAL_TYPE_LABELS
                                ]
                              }
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-2">
                          <span className="font-bold uppercase text-indigo-500 text-center">{purchase.material.user.name}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold uppercase text-indigo-500 text-center">{purchase.material.user.identifier}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold uppercase text-teal-500 text-center">{purchase.buyerName}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold uppercase text-teal-500 text-center">{purchase.buyer.identifier}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{purchase.material.quantity} kg</span>
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <span className="font-bold text-green-400 text-xl">
                            ${purchase.totalAmount} MXN
                          </span>
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <span className="font-bold text-lime-500 text-xl">
                            ${
                              purchase.totalAmount - commissionAmoun(purchase.totalAmount)
                            } MXN
                          </span>
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <span className="font-bold text-blue-300 text-xl">
                            ${commissionAmoun(purchase.totalAmount).toFixed(2)} MXN
                          </span>
                        </TableCell>
                        <TableCell>
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
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Link
                                href={purchase.material.location}
                                target="_blank"
                                className="bg-gray-700 hover:bg-gray-600 text-white border-none transition-all cursor-pointer hover:text-white px-3 py-2 flex gap-2 items-center rounded-md text-sm"
                              >
                                <MapPin className="mr-1 h-4 w-4" />
                                Ver Ubicación
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <Badge
                            className={
                              purchase.paymentStatus === "COMPLETED" ? "bg-green-500 text-white hover:bg-green-600" : "bg-yellow-500 text-white"
                            }
                          >
                            {purchase.paymentStatus === "COMPLETED" ? "Completado" : "Pendiente"}
                          </Badge>
                        </TableCell> */}
                        <TableCell>
                          <Select
                            value={statusChanges[purchase.id]?.materialStatus || purchase.material.status}
                            onValueChange={(value) => handleStatusChange(purchase.id, "materialStatus", value)}
                          >
                            <SelectTrigger
                              className={
                                purchase.material.status === "AVAILABLE" ?
                                  "w-32 bg-orange-500 text-white" :
                                  purchase.material.status === "PENDING" ?
                                    "w-32 bg-rose-500 text-white"
                                    : "w-32 bg-green-500 text-white"
                              }
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AVAILABLE">Disponible</SelectItem>
                              <SelectItem value="PENDING">Pendiente</SelectItem>
                              <SelectItem value="PURCHASED">Comprado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={statusChanges[purchase.id]?.paymentStatus || purchase.paymentStatus}
                            onValueChange={(value) => handleStatusChange(purchase.id, "paymentStatus", value)}
                          >
                            <SelectTrigger className={
                              purchase.paymentStatus === "PENDING" ?
                                "w-32 bg-rose-500 text-white" :
                                purchase.paymentStatus === "FAILED" ?
                                  "w-32 bg-red-700 text-white" :
                                  purchase.paymentStatus === "REFUNDED" ?
                                    "w-32 bg-gray-500 text-white" :
                                    "w-32 bg-green-500 text-white"

                            }>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pendiente</SelectItem>
                              <SelectItem value="COMPLETED">Completado</SelectItem>
                              <SelectItem value="FAILED">Fallido</SelectItem>
                              <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {statusChanges[purchase.id] && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => saveStatusChanges(purchase.id)}
                              disabled={isSaving}
                              className="bg-green-600 text-white border-none hover:bg-green-700 hover:text-white"
                            >
                              <Save className="mr-1 h-3 w-3" />
                              {isSaving ? "Guardando..." : "Guardar"}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {purchase.paymentStatus === "COMPLETED" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReceipt(purchase.id, purchase.purchaseFolio)}
                              className="flex items-center gap-1 bg-emerald-600 text-white border-none hover:text-emerald-600 cursor-pointer"
                            >
                              <Download className="h-3 w-3" />
                              Descargar Comprobante
                            </Button>
                          ) : purchase.paymentStatus === "PENDING" ? (

                            <div className="space-y-1 flex flex-col justify-center items-center text-center font-bold">
                              <Clock className="h-5 w-5 animate-spin" />
                              ADMINISTRADOR:  Realiza la verificación del pago y actualiza el estado de Pago y Disponibilidad del material
                            </div>
                          ) : (
                            <div className="flex gap-2 mt-3">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={isDeleting}
                                    title={purchase.id}
                                  // title="Eliminar intento de compra"
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
