"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Clock,
  Download,
  Search,
  Filter,
  CheckCircle,
  Edit,
  LucideBoxes,
  Map,
  AArrowDown,
  RectangleEllipsisIcon,
  Box,
  Star,
  AlertCircle,
  UserStar,
  PackagePlus, // Nuevo icono para publicar
  Palette,
  ShoppingBag,
  BadgeDollarSign, // Nuevo icono para tipo de material
} from "lucide-react"
import Link from "next/link"
import { MATERIAL_PRICES, MATERIAL_TYPE_LABELS } from "@/lib/constants"
import LoaderCircle from "@/app/components/LoaderCircle"
import type { RecyclableMaterialUserData, SellerUserProfileData } from "@/types/types"
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages"
import toast from "react-hot-toast"
import type { MaterialType } from "@/generated/prisma/client"
import { SellerNavBar } from "@/app/components/seller/SellerNavBar"

const ITEMS_PER_PAGE = 9

export default function SellerPublishedMaterialsPage() {
  const [recyclableMaterials, setRecyclableMaterials] = useState<RecyclableMaterialUserData | null>(null)
  const [profile, setProfile] = useState<SellerUserProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [recyclableMaterialsFilter, setRecyclableMaterialsFilter] = useState<MaterialType | "ALL">("ALL")

  useEffect(() => {
    fetchMaterials()
    fetchProfile()
  }, [])

  const filteredMaterials = useMemo(() => {
    if (!recyclableMaterials?.recyclableMaterials) return []

    return recyclableMaterials.recyclableMaterials.filter((material) => {
      // Search by name/title
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by material type
      const matchesMaterialType = selectedMaterialType === "all" || material.materialType === selectedMaterialType

      // Filter by status/availability
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "AVAILABLE" && material.status === "AVAILABLE") ||
        (selectedStatus === "PURCHASED" && material.status === "PURCHASED") ||
        (selectedStatus === "PENDING" && material.status === "PENDING")

      return matchesSearch && matchesMaterialType && matchesStatus
    })
  }, [recyclableMaterials, searchTerm, selectedMaterialType, selectedStatus])

  const fetchMaterials = async (page = 1, search = searchTerm, topic = recyclableMaterialsFilter) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })
      if (search) params.append("search", search)
      if (topic !== "ALL") params.append("topic", topic)
      const response = await fetch(`/api/seller/recyclable-materials?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setRecyclableMaterials(data)
      }
    } catch (error) {
      toast.error("Error al cargar materiales")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/seller/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      toast.error("Error al cargar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotal = (materialType: MaterialType, quantity: number) => {
    return (
      (MATERIAL_PRICES[materialType] as number * quantity) * 0.20
    )
  }
  const finalTotalAmount = (materialType: MaterialType, quantity: number) => {
    return (
      (MATERIAL_PRICES[materialType] * quantity) - calculateTotal(materialType, quantity)
    ).toFixed(2)
  }


  const clearFilters = () => {
    setSearchTerm("")
    setSelectedMaterialType("all")
    setSelectedStatus("all")
  }

  const downloadReceipt = async (materialId: string) => {
    try {
      // Lógica de descarga... (Mantenida sin cambios)
      const response = await fetch(`/api/seller/material-purchase/${materialId}`)
      if (!response.ok) {
        throw new Error("No se encontró la compra asociada")
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
      a.download = `Comprobante-de-Venta:${recyclableMaterials?.recyclableMaterials?.find((material) => material.id === materialId)?.title}.pdf`
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <SellerNavBar />
        <LoaderCircle />
      </div>
    )
  }

  return (
    // Rediseño del fondo a un esquema oscuro y minimalista
    <div className="min-h-screen bg-zinc-950 text-sellerBaseColor relative">
      <SellerNavBar />
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* === HEADER Y TÍTULO === */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 rounded-full border border-sellerBaseColor text-sellerBaseColor/10 shadow-lg shadow-sellerBaseColor/30`}>
              <Box className={`h-8 w-8 text-sellerBaseColor animate-spin`} />
            </div>
            <h1 className={`text-4xl font-extrabold text-sellerBaseColor`}>
              Mis Materiales Publicados
            </h1>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Visualiza tus materiales reciclables publicados y comprados.
          </p>
        </div>

        {/* === ESTADO VACÍO === */}
        {(!recyclableMaterials?.recyclableMaterials || recyclableMaterials.recyclableMaterials.length === 0) ? (
          <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700 relative">
            <p className="text-gray-400 mb-6 text-xl">
              ¡Aún no tienes materiales publicados!
            </p>
            <Link href="/vendedor/publicar-materiales">
              <Button className={`px-8 py-3 font-semibold bg-sellerBaseColor hover:bg-sellerBaseColor/90 text-white transition-all shadow-lg shadow-sellerBaseColor/40 cursor-pointer`}>
                <PackagePlus className="h-5 w-5 mr-2" />
                Publicar mi primer material
              </Button>
            </Link>
          </div>
        ) : (
          /* === FILTROS Y RESULTADOS === */
          <div className="mb-10 p-6 bg-[#06001b] rounded-xl border-sellerBaseColor/10 border-2 shadow-md shadow-[#1b005a]">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className={`text-xl font-semibold text-indigo-100 flex items-center gap-2`}>
                <Filter className={`h-5 w-5 text-indigo-100`} />
                Opciones de Filtrado
              </h2>
              <Button onClick={clearFilters} className={`text-white bg-sellerBaseColor hover:bg-sellerBaseColor/90 transition-all cursor-pointer`}>
                <Filter className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Search by name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sellerBaseColor">Buscar por nombre</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sellerBaseColor" />
                  <Input
                    placeholder="Título del material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-sellerBaseColor/20 text-sellerBaseColor focus:border-sellerBaseColor placeholder:text-sellerBaseColor"
                  />
                </div>
              </div>
              {/* Material type filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sellerBaseColor">Tipo de Material</label>
                <Select value={selectedMaterialType} onValueChange={setSelectedMaterialType}>
                  <SelectTrigger className="bg-white border-sellerBaseColor text-sellerBaseColor focus:ring-sellerBaseColor cursor-pointer hover:border-sellerBaseColor">
                    <Box className="h-4 w-4 mr-2 text-sellerBaseColor" />
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="all">Todos los tipos</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="PLASTICO">Plástico</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="PAPEL">Papel</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="VIDRIO">Vidrio</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="ORGANICO">Orgánico</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="ALUMINIO">Aluminio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Status/Availability filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sellerBaseColor">Disponibilidad</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white border-sellerBaseColor text-sellerBaseColor focus:ring-sellerBaseColor cursor-pointer hover:border-sellerBaseColor">
                    <Clock className="h-4 w-4 mr-2 text-sellerBaseColor" />
                    <SelectValue placeholder="Todas las disponibilidades" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="all">Todas</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="AVAILABLE">Disponible</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="PURCHASED">Comprado</SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-slate-600" value="PENDING">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 sm:flex-row w-full sm:items-center sm:justify-between">

              {/* Results counter */}
              <div className="flex items-center gap-3 mt-6 p-3 bg-sellerBaseColor rounded-lg w-fit">
                <div className={`h-3 w-3 bg-rose-100 rounded-full animate-pulse`} />
                <span className={`text-sm font-medium text-white`}>
                  Mostrando {filteredMaterials.length} de {recyclableMaterials?.recyclableMaterials.length || 0} materiales publicados
                </span>
              </div>
              <Link href={`/vendedor/mis-ventas/${profile?.id}`} className="flex gap-2 bg-white text-green-700 mt-5 px-4 py-2 rounded-md cursor-pointer hover:bg-green-100 font-semibold tracking-wide">
                <BadgeDollarSign className="w-5 h-5 animate-bounce" />
                Mis Ventas
              </Link>
            </div>
          </div>
        )}

        {/* === LISTA DE MATERIALES === */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className={`overflow-hidden transition-all duration-300 relative border ${material.status === "PURCHASED"
                ? `bg-black border-green-700/50 hover:border-green-400 shadow-green-900/50 shadow-xl`
                : material.status === "AVAILABLE"
                  ? `bg-black border-gray-700 hover:border-sellerBaseColor shadow-sellerBaseColor/30 shadow-lg`
                  : `bg-rose-900/10 border-rose-700/50 hover:border-rose-400 shadow-rose-900/50 shadow-xl`
                } text-white`}
            >
              <CardHeader className="p-4 border-b border-gray-700/50">
                <div className="flex flex-col items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">{material.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {/* Badge de Tipo de Material */}
                    <Badge className={`bg-gray-700 text-gray-200 border border-gray-600 w-max`}>
                      <Box className="mr-1 h-4 w-4" />
                      {MATERIAL_TYPE_LABELS[material.materialType]}
                    </Badge>
                    {/* Badge de Estatus */}
                    {material.status === "AVAILABLE" && (
                      <Badge className={`bg-yellow-600 hover:bg-yellow-500 text-white w-max font-semibold`}>
                        <Star className="mr-1 h-4 w-4" />
                        Disponible
                      </Badge>
                    )}
                    {material.status === "PENDING" && (
                      <Badge className="bg-rose-800 text-white w-max font-semibold animate-pulse" title="Tu material está pendiente de compra">
                        <Clock className="mr-1 h-4 w-4" />
                        Pendiente de Compra
                      </Badge>
                    )}
                    {material.status === "PURCHASED" && (
                      <Badge className="bg-green-600 text-white w-max font-semibold">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Comprado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-4">

                {/* Alerta de Estado Pendiente */}
                {material.status === "PENDING" && (
                  <div className="flex items-start gap-3 p-3 bg-rose-900/30 border border-rose-700 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-300 leading-relaxed">
                      **Atención:** Se está realizando la revisión de compra. El estado cambiará a "Comprado" si es exitosa. Si la compra no fue correcta, regresará a estar Disponible automáticamente.
                    </p>
                  </div>
                )}

                {/* Folio de Compra (Solo visible si existe) */}
                {material.folio && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-green-500 rounded-lg">
                    <span className="text-xs text-green-700">Folio de Compra:</span>
                    <p className="font-bold text-green-800 tracking-wider text-sm">{material.folio}</p>
                  </div>
                )}

                {/* Info del Vendedor/Perfil */}
                <div className="flex items-center gap-2 text-sm text-gray-300 border-t border-gray-700/50 pt-4">
                  <UserStar className={`h-4 w-4 text-white`} />
                  Vendedor:
                  <p className={`font-bold uppercase text-sellerBaseColor bg-white px-2 rounded-sm`}>{profile?.name}</p>
                </div>

                {/* Información clave del material */}
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {/* Cantidad */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <LucideBoxes className="h-4 w-4 text-gray-500" />
                    Cantidad:
                    <p className="font-bold text-indigo-300">{material.quantity} kg</p>
                  </div>
                  {/* Ciudad, Estado */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <Map className="h-4 w-4 text-gray-500" />
                    <p className="font-bold text-indigo-300">
                      {material.city}, {material.state}
                    </p>
                  </div>
                  {/* Código Postal */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <AArrowDown className="h-4 w-4 text-gray-500" />
                    C.P.:
                    <p className="font-bold text-indigo-300">{profile?.profile?.postalCode}</p>
                  </div>
                  {/* Horario de Atención */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4 text-gray-500 animate-pulse" />
                    Horario:
                    <p className="font-bold text-indigo-300">{material.schedule}</p>
                  </div>
                </div>

                {/* Datos Fiscales/Dirección (Si son necesarios) */}
                <div className="space-y-2 pt-2 border-t border-gray-700/50">
                  <p className="text-xs font-semibold text-gray-500">Detalles de Recolección:</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <p className="font-medium text-indigo-300">{profile?.profile?.address}</p>
                  </div>
                  {profile?.userType === "SELLER" && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RectangleEllipsisIcon className="h-4 w-4" />
                      CCT/RFC:
                      <p className="font-medium text-indigo-300">{profile?.profile?.cct || 'N/A'} / {profile?.profile?.rfc || 'N/A'}</p>
                    </div>
                  )}
                </div>

                <div className="border border-green-950 p-4 rounded-lg shadow-sm shadow-green-900 hover:shadow-md transition-all ease-linear">
                  <p className="text-green-300">Por la venta de tu material recibirás: </p>
                  <div className="relative z-10 text-center">
                    <div className="text-4xl md:text-6xl py-2 font-black text-white drop-shadow-lg hover:scale-105 transition-all ease-linear ">
                      ${
                        finalTotalAmount(material.materialType, material.quantity)
                      }
                    </div>
                    <div className="text-white text-base font-bold mt-1">Pesos Mexicanos (MXN)</div>
                  </div>
                </div>

                {/* Image List */}
                <div className="pt-4 border-t border-gray-700/50">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Imágenes del Material:</p>
                  {material.images && material.images.length > 0 ? (
                    <RecyclableMaterialContentImages visualContent={material.images} />
                  ) : (
                    <p className="text-sm text-gray-500">No hay imágenes adjuntas.</p>
                  )}
                </div>

                {/* === ACCIONES === */}
                <div className="flex flex-wrap items-center justify-start gap-3 pt-4 border-t border-gray-700/50">
                  {/* Botón de Mapa */}
                  <Link
                    href={material.location}
                    target="_blank"
                    className="bg-gray-700 hover:bg-gray-600 text-white border-none transition-all cursor-pointer hover:text-white px-3 py-2 flex gap-2 items-center rounded-md text-sm"
                  >
                    <MapPin className="mr-1 h-4 w-4" />
                    Ver Ubicación
                  </Link>

                  {/* Botón de Descarga (Comprado) */}
                  {material.status === "PURCHASED" && (
                    <Button
                      size="sm"
                      onClick={() => downloadReceipt(material.id)}
                      className="bg-green-600 text-white font-semibold hover:bg-green-500 transition-all shadow-md shadow-green-700/50 cursor-pointer"
                    >
                      <Download className="mr-1 h-3 w-3 animate-bounce" />
                      Descargar Comprobante
                    </Button>
                  )}

                  {/* Botón de Editar/Eliminar (Disponible) */}
                  {material.status === "AVAILABLE" && (
                    <Link href={`/vendedor/materiales-publicados/editar/${material.id}`}>
                      <Button variant="destructive" size="sm" className="bg-rose-700 hover:bg-rose-600 text-white shadow-md shadow-rose-900/50 cursor-pointer">
                        <Edit className="mr-1 h-3.5 w-3.5" /> Editar/Eliminar
                      </Button>
                    </Link>
                  )}

                  {/* Etiqueta de Estado Pendiente (inactivo) */}
                  {material.status === "PENDING" && (
                    <Badge className="bg-gray-700 text-gray-400 w-max" title="Acciones no disponibles mientras está pendiente">
                      <Clock className="mr-1 h-4 w-4" />
                      Esperando Revisión
                    </Badge>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>


        {/* === ESTADO SIN COINCIDENCIAS === */}
        {filteredMaterials.length === 0 &&
          recyclableMaterials?.recyclableMaterials &&
          recyclableMaterials.recyclableMaterials.length > 0 && (
            <div className="text-center py-12 bg-[#06001b] rounded-xl border border-none mt-10 shadow-md shadow-[#1b005a]">
              <p className="text-gray-200 mb-4 text-lg">
                No se encontraron materiales que coincidan con los filtros seleccionados
              </p>
              <Button onClick={clearFilters} className={`text-white bg-sellerBaseColor hover:bg-sellerBaseColor/90 transition-all cursor-pointer`}>
                <Filter className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          )}
      </div>
    </div>
  )
}