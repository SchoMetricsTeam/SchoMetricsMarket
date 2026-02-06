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
  ShoppingCart,
  Box,
  School,
  LucideBoxes,
  Map,
  AArrowDown,
  X,
  FileText,
  Zap,
  Eye,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { MATERIAL_PRICES, MATERIAL_TYPE_LABELS, MEXICAN_STATES } from "@/lib/constants"
import LoaderCircle from "@/app/components/LoaderCircle"
import type { RecyclableMaterialUserData } from "@/types/types"
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages"
import toast from "react-hot-toast"
import type { MaterialType } from "@/generated/prisma/enums"
import { PurchaseForm } from "@/app/components/purchase/PurchaseForm"
import useUserSession from "@/hooks/useUserSession"
import { motion } from "motion/react"
import { BuyerNavBar } from "@/app/components/buyer/BuyerNavBar"

export default function PublishedMaterialsPage() {
  const [recyclableMaterials, setRecyclableMaterials] = useState<RecyclableMaterialUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>("all")
  const [selectedState, setSelectedState] = useState<string>("all")
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const session = useUserSession()

  useEffect(() => {
    fetchMaterials()
  }, [])

  const filteredMaterials = useMemo(() => {
    if (!recyclableMaterials?.recyclableMaterials) return []

    return recyclableMaterials.recyclableMaterials.filter((material) => {
      // La condición ahora está directamente en el return
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMaterialType = selectedMaterialType === "all" || material.materialType === selectedMaterialType
      const matchesState = selectedState === "all" || material.state === selectedState

      // Se fuerza a que el status sea siempre "AVAILABLE"
      return material.status === "AVAILABLE" && matchesSearch && matchesMaterialType && matchesState
    })
    // Se elimina selectedStatus de las dependencias del hook
  }, [recyclableMaterials, searchTerm, selectedMaterialType, selectedState])

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/buyer/recyclable-materials/available")
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

  const calculateTotal = (materialType: MaterialType, quantity: number) => {
    return (MATERIAL_PRICES[materialType] * quantity).toFixed(2)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedMaterialType("all")
    setSelectedState("all")
  }

  const handlePurchaseMaterial = (material: any) => {
    setSelectedMaterial(material)
    setShowPurchaseForm(true)
  }

  const handlePurchaseSuccess = () => {
    fetchMaterials()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <BuyerNavBar />
        <LoaderCircle />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-buyer">
      <BuyerNavBar />

      <div className="absolute left-1/4 top-20 h-96 w-max animate-pulse rounded-full bg-linear-to-br from-emerald-200/30 to-teal-200/30 blur-3xl" style={{ animationDuration: '4s' }} />
      <div className="absolute right-1/4 bottom-20 h-96 w-96 animate-pulse rounded-full bg-linear-to-tr from-teal-200/30 to-emerald-200/30 blur-3xl" style={{ animationDuration: '6s', animationDelay: '2s' }} />

      <div className="container mt-10 mx-auto px-6 py-8 sm:px-6 lg:px-8 relative">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-linear-to-br from-emerald-100/20 to-teal-500/20 rounded-lg border border-emerald-300/30">
              <Box className="h-6 w-6 text-teal-600 animate-spin" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent">
              Materiales Reciclables Disponibles
            </h1>
          </div>
          <p className="text-zinc-600 text-lg leading-relaxed">
            Aquí podrás encontrar materiales reciclables publicados de todo México
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 rounded-2xl border border-teal-200 bg-[#f0fffa] p-6 shadow-xl shadow-teal-100"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-white p-2 border border-teal-200">
                <Filter className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-teal-600">Filtros de búsqueda</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="group border-emerald-200 text-emerald-700 transition-all duration-300 hover:border-emerald-500 hover:bg-white cursor-pointer hover:text-emerald-600"
            >
              <X className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              Limpiar filtros
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-teal-600">Buscar por nombre</label>
              <div className="relative group">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
                <Input
                  placeholder="Buscar materiales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 border-slate-200 bg-white pl-10 transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-teal-600">Tipo de Material</label>
              <Select value={selectedMaterialType} onValueChange={setSelectedMaterialType}>
                <SelectTrigger className="h-11 border-slate-200 bg-white transition-all duration-300 hover:border-emerald-500 cursor-pointer">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer hover:bg-teal-100">Todos los tipos</SelectItem>
                  <SelectItem value="PLASTICO" className="cursor-pointer hover:bg-teal-100">🔵 Plástico</SelectItem>
                  <SelectItem value="PAPEL" className="cursor-pointer hover:bg-teal-100">📄 Papel</SelectItem>
                  <SelectItem value="VIDRIO" className="cursor-pointer hover:bg-teal-100">🔷 Vidrio</SelectItem>
                  <SelectItem value="ORGANICO" className="cursor-pointer hover:bg-teal-100">🌱 Orgánico</SelectItem>
                  <SelectItem value="ALUMINIO" className="cursor-pointer hover:bg-teal-100">⚙️ Aluminio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-teal-600">Estado</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="h-11 border-slate-200 bg-white transition-all duration-300 hover:border-emerald-500 cursor-pointer">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">Todos los estados</SelectItem>
                  {MEXICAN_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="cursor-pointer hover:bg-teal-100">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-2 sm:flex-row w-full sm:items-center sm:justify-between">
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-white border border-emerald-200/50 px-4 py-3 w-fit">
              <div className="flex items-center gap-2">
                <div className="relative h-2 w-2">
                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
                  <div className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
              <span className="text-sm font-semibold text-emerald-700">
                Mostrando {filteredMaterials.length} de{" "}
                {
                  (recyclableMaterials?.recyclableMaterials || []).filter((material) => material.status === "AVAILABLE")
                    .length
                }{" "}
                materiales disponibles
              </span>
            </div>
            <Link href={`/comprador/materiales-comprados/${session.session?.id}`} className="flex gap-2 bg-green-500 text-white mt-5 px-4 py-2 rounded-md cursor-pointer hover:bg-green-600 font-semibold tracking-wide">
              <ShoppingBag className="w-5 h-5 animate-bounce" />
              Mis Compras
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden bg-white border-2 border-teal-200 transition-all ease-linear duration-300 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-900">
              <CardHeader className="pb-3">
                <div className="space-y-3">
                  <CardTitle className="text-xl font-bold text-teal-700">
                    {material.title}
                  </CardTitle>

                  <div className="flex flex-wrap gap-2">
                    {material.user.userType === "SCHOOL" && (
                      <Badge className="bg-linear-to-r from-violet-500 to-purple-600 text-white">
                        <School className="mr-1.5 h-3.5 w-3.5" />
                        ESCUELA
                      </Badge>
                    )}
                    <Badge className="bg-linear-to-r from-sky-500 to-blue-600 text-white">
                      <Box className="mr-1.5 h-3.5 w-3.5" />
                      {MATERIAL_TYPE_LABELS[material.materialType]}
                    </Badge>
                    {material.status === "AVAILABLE" && (
                      <Badge className="bg-linear-to-r from-amber-500 to-orange-500 text-white">
                        <Clock className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
                        Disponible
                      </Badge>
                    )}
                    {material.status === "PURCHASED" && (
                      <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white">
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                        Apartado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg bg-linear-to-r from-violet-50 to-purple-50 border border-violet-200/50 px-3 py-2">
                  <School className="h-4 w-4 text-violet-600" />
                  <p className="font-semibold text-violet-700 text-sm">{material.user.name}</p>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">Folio:</span>
                  </div>
                  <p className="font-bold text-emerald-700 tracking-wider text-sm">{material.folio}</p>
                </div>

                <div className="space-y-2 rounded-lg bg-slate-50/50 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                      <LucideBoxes className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-600">Cantidad:</span>
                    <p className="font-bold text-emerald-700">{material.quantity} kg</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100">
                      <Map className="h-4 w-4 text-teal-600" />
                    </div>
                    <p className="font-semibold text-slate-700">
                      {material.city}, {material.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100">
                      <MapPin className="h-4 w-4 text-sky-600" />
                    </div>
                    <p className="font-semibold text-slate-700">{material.address}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                      <AArrowDown className="h-4 w-4 text-violet-600" />
                    </div>
                    <span className="text-slate-600">CP:</span>
                    <p className="font-semibold text-slate-700">{material.postalCode}</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg bg-linear-to-br from-slate-50 to-gray-50 p-3 border border-slate-200/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">CCT:</span>
                    <p className="font-bold text-slate-700 uppercase">{material.user.profile?.cct?.toUpperCase()}</p>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">RFC:</span>
                    <p className="font-bold text-slate-700">{material.user.profile?.rfc}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200/50 p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-700 mb-1">Horario de Recolección</p>
                      <p className="text-sm font-bold text-blue-900">{material.schedule}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-lime-50 via-green-50 to-lime-50 border-2 border-lime-300/50 p-6 shadow-2xl">
                  {/* Premium pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)`,
                      color: '#f59e0b'
                    }} />
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-lime-400 to-teal-400 opacity-20 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-
                  to-tr from-green-400 to-lime-400 opacity-20 blur-2xl" />

                  <div className="relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-linear-to-r from-yellow-400 via-orange-400 to-yellow-400 text-white px-4 py-2 rounded-full text-[10px] md:text-sm font-bold shadow-lg mb-4 animate-[wiggle_1s_ease-in-out_infinite]">
                      <Zap className="w-4 h-4" fill="currentColor" />
                      <span>¡PRECIO INCREÍBLE!</span>
                      <Zap className="w-4 h-4" fill="currentColor" />
                    </div>
                    {/* Price with emphasis */}
                    <div className="bg-linear-to-r from-blue-600 to-sky-600 rounded-2xl p-6 mb-4 shadow-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                      <div className="relative z-10 text-center">
                        <div className="text-emerald-100 text-sm font-medium mb-4">Total a Pagar</div>
                        <div className="text-2xl md:text-4xl xl:text-6xl font-black text-white drop-shadow-lg animate-[bounce_2s_ease-in-out_infinite]">
                          ${calculateTotal(material.materialType, material.quantity)}
                        </div>
                        <div className="text-white text-base font-bold mt-1">Pesos Mexicanos (MXN)</div>
                      </div>
                    </div>

                    {/* Info cards */}
                    <div className="flex justify-center items-center gap-2 w-full">
                      <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-emerald-700 text-xs font-semibold">Precio/Kg</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-900">${MATERIAL_PRICES[material.materialType]} MXN</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
                          <span className="text-teal-700 text-xs font-semibold">Cantidad</span>
                        </div>
                        <div className="text-2xl font-black text-teal-900">{material.quantity} Kg</div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="pt-2 text-teal-600 flex items-center font-semibold">
                  <Eye className="mr-1 h-5 w-5" />
                  Visibilidad del Material:
                </span>
                {material.images && material.images.length > 0 && (
                  <div className="flex gap-2 justify-start items-center">
                    {material.images && material.images.length > 0 ? (
                      <RecyclableMaterialContentImages visualContent={material.images} />
                    ) : (
                      <p className="text-sm text-gray-500">No hay imágenes adjuntas para este material.</p>
                    )}
                  </div>
                )}
                <div className="flex flex-col justify-center items-start gap-2">
                  {material.status === "PURCHASED" && (
                    <div className="">
                      <span className="text-sm gap-2 text-green-500 items-center justify-start">
                        Descarga el <b>Comprobante de Apartado</b> en la sección de <b>Materiales Apartados</b>.
                      </span>
                      <Link href={`/empresas/materiales-comprados/${session.session?.id}`} className="flex gap-2 justify-start items-center px-3 py-2 bg-emerald-500 w-max text-white text-sm rounded-md mt-2">
                        <Download className="mr-1 h-5 w-5 animate-bounce" />
                        Descargar
                      </Link>

                    </div>
                  )}
                </div>
                {material.status === "AVAILABLE" ? (
                  <Button size="sm" className="flex-1 w-full cursor-pointer bg-blue-500 hover:bg-blue-600" onClick={() => handlePurchaseMaterial(material)}>
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    Apartar material
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1 bg-green-600 w-full" disabled>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Material Apartado
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredMaterials.length === 0 &&
          recyclableMaterials?.recyclableMaterials &&
          recyclableMaterials.recyclableMaterials.length > 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-600 mb-4">
                No se encontraron materiales que coincidan con los filtros seleccionados
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="group border-emerald-200 text-emerald-700 transition-all duration-300 hover:border-emerald-500 hover:bg-white cursor-pointer hover:text-emerald-600"
              >
                <X className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                Limpiar filtros
              </Button>
            </div>
          )}
      </div>

      {showPurchaseForm && selectedMaterial && (
        <PurchaseForm
          material={selectedMaterial}
          onClose={() => {
            setShowPurchaseForm(false)
            setSelectedMaterial(null)
          }}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  )
}


