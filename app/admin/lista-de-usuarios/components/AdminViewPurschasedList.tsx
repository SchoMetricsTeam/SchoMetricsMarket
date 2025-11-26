"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Calendar, Clock, MapPin, CheckCircle, Save, UserStar } from "lucide-react"
import LoaderCircle from "@/app/components/LoaderCircle"
import { MATERIAL_TYPE_LABELS } from "@/lib/constants"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"
import { generatePurchaseReceipt, generateAllPurchasesReport } from "@/lib/pdf-generator"
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages"
import { PurchaseData } from "@/types/types"
import Link from "next/link"


interface PurchaseDataProps {
  userId: string
}

interface StatusChanges {
  [purchaseId: string]: {
    materialStatus?: string
    paymentStatus?: string
  }
}

const AdminViewPurchasedMaterialsPage: React.FC<PurchaseDataProps> = ({ userId }) => {
  const [purchases, setPurchases] = useState<PurchaseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
      const response = await fetch(
        `/api/admin/users/profiles/buyer/purchasedMaterials/${userId}?page=${page}&limit=10`,
      )
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

  const handleStatusChange = (purchaseId: string, type: "materialStatus" | "paymentStatus", value: string) => {
    setStatusChanges((prev) => ({
      ...prev,
      [purchaseId]: {
        ...prev[purchaseId],
        [type]: value,
      },
    }))
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

  const downloadReceipt = async (purchaseId: string, folio: string) => {
    try {
      const response = await fetch(`/api/admin/users/profiles/buyer/download-receipt/${purchaseId}`)
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
      const response = await fetch(`/api/admin/users/profiles/buyer/download-all-receipts/${userId}`)
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

  if (isLoading) {
    return <LoaderCircle />
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-center gap-3">
          <div className="flex mt-10 gap-2 w-full bg-green-600 rounded-lg items-center justify-center text-center text-white py-2 font-bold">
            <CheckCircle className="h-6 w-6 animate-heartbeat" />
            Materiales Reciclables Comprados:
          </div>
          {purchases.length > 0 && (
            <Button onClick={downloadAllReceipts} className="flex items-center gap-2 bg-teal-600 text-white border-none hover:bg-teal-700 hover:text-white cursor-pointer">
              <FileText className="h-4 w-4" />
              Descargar Informe de Compras
            </Button>
          )}
        </div>

        {purchases.length === 0 ? (
          <div className="py-10 text-center bg-zinc-900 border-zinc-800  rounded-xl shadow-md shadow-zinc-700">
            <p className="text-3xl font-bold text-gray-400">El usuario no ha comprado ningún material reciclable.</p>
          </div>
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
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">
                        Folio de Validez
                      </TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Material</TableHead>
                      <TableHead className="flex gap-2 items-center justify-center text-lime-500 font-bold text-center uppercase">
                        <UserStar className="h-4 w-4 text-lime-500" />
                        Vendedor
                      </TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Cantidad</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Monto $</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Fecha de Compra</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">
                        Fecha de Recolección
                      </TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Evidencias</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">¿Cómo llegar?</TableHead>
                      <TableHead className="text-purple-300 uppercase font-bold text-center">Estado de Disponibilidad</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Estado de Pago</TableHead>
                      <TableHead className="text-green-300 uppercase font-bold text-center">Guardar Cambios</TableHead>
                      <TableHead className="text-indigo-300 uppercase font-bold text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono text-sm">{purchase.purchaseFolio}</TableCell>
                        <TableCell>
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
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{purchase.material.user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{purchase.material.quantity} kg</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-green-600">${purchase.totalAmount} MXN</span>
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
                        <TableCell>
                          <Select
                            value={statusChanges[purchase.id]?.materialStatus || purchase.material.status}
                            onValueChange={(value) => handleStatusChange(purchase.id, "materialStatus", value)}
                          >
                            <SelectTrigger className="w-32">
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
                            <SelectTrigger className="w-32">
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
                              className="bg-green-600 text-white border-none hover:bg-green-700"
                            >
                              <Save className="mr-1 h-3 w-3" />
                              {isSaving ? "Guardando..." : "Guardar"}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {purchase.paymentStatus === "COMPLETED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReceipt(purchase.id, purchase.purchaseFolio)}
                              className="flex items-center gap-1 bg-rose-600 text-white border-none hover:text-red-600"
                            >
                              <Download className="h-3 w-3" />
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

        {/* Detalles expandibles para móvil */}
        <div className="md:hidden space-y-4 mt-8 h-[500px] overflow-auto">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Folio: {purchase.purchaseFolio}</CardTitle>
                  <Badge
                    className={
                      purchase.paymentStatus === "COMPLETED" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                    }
                  >
                    {purchase.paymentStatus === "COMPLETED" ? "Completado" : "Pendiente"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Material:</p>
                    <p className="font-semibold">{purchase.material.title}</p>
                    <Badge variant="outline" className="text-xs mt-1 bg-orange-500 border-none text-white">
                      {MATERIAL_TYPE_LABELS[purchase.material.materialType as keyof typeof MATERIAL_TYPE_LABELS]}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Escuela:</p>
                    <div className="flex items-center gap-1">
                      <UserStar className="h-4 w-4 text-lime-600" />
                      <span className="font-semibold">{purchase.material.user.name}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Cantidad:</p>
                    <p className="font-semibold">{purchase.material.quantity} kg</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Monto:</p>
                    <p className="font-bold text-green-600">${purchase.totalAmount} MXN</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Fecha de Compra:</p>
                    <p>{format(new Date(purchase.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Recolección:</p>
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
                  </div>
                </div>

                {/* Mobile status selectors */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Estado del Material:</Label>
                    <Select
                      value={statusChanges[purchase.id]?.materialStatus || purchase.material.status}
                      onValueChange={(value) => handleStatusChange(purchase.id, "materialStatus", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Disponible</SelectItem>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="PURCHASED">Comprado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Estado de Pago:</Label>
                    <Select
                      value={statusChanges[purchase.id]?.paymentStatus || purchase.paymentStatus}
                      onValueChange={(value) => handleStatusChange(purchase.id, "paymentStatus", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="COMPLETED">Completado</SelectItem>
                        <SelectItem value="FAILED">Fallido</SelectItem>
                        <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {statusChanges[purchase.id] && (
                    <Button
                      size="sm"
                      onClick={() => saveStatusChanges(purchase.id)}
                      disabled={isSaving}
                      className="w-full bg-green-600 text-white hover:bg-green-700 hover:text-white"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  )}
                </div>

                {purchase.paymentStatus === "COMPLETED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadReceipt(purchase.id, purchase.purchaseFolio)}
                    className="w-full flex items-center gap-2 bg-teal-600 text-white border-none hover:bg-teal-600 hover:border-transparent cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Comprobante
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminViewPurchasedMaterialsPage
