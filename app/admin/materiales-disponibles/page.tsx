"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Search, Filter, CheckCircle, Box, LucideBoxes, Map, MapPinHouseIcon, RectangleEllipsisIcon, AlertCircle, UserStar, IdCardLanyard } from "lucide-react"
import { MATERIAL_PRICES, MATERIAL_TYPE_LABELS, MEXICAN_STATES } from "@/lib/constants"
import LoaderCircle from "@/app/components/LoaderCircle"
import type { RecyclableMaterialUserData } from "@/types/types"
import { RecyclableMaterialContentImages } from "@/app/components/RecyclableMaterialContentImages"
import toast from "react-hot-toast"
import { AdminNavigation } from "@/app/components/admin/AdminNavigation"
import { MaterialType } from "@/generated/prisma/client"


export default function PublishedMaterialsPage() {
    const [recyclableMaterials, setRecyclableMaterials] = useState<RecyclableMaterialUserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMaterialType, setSelectedMaterialType] = useState<string>("all")
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [selectedState, setSelectedState] = useState<string>("all")

    useEffect(() => {
        fetchMaterials()
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
                (selectedStatus === "PURCHASED" && material.status === "PURCHASED")

            // Filter by state
            const matchesState = selectedState === "all" || material.state === selectedState

            return matchesSearch && matchesMaterialType && matchesStatus && matchesState
        })
    }, [recyclableMaterials, searchTerm, selectedMaterialType, selectedStatus, selectedState])

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

    const openGoogleMaps = (latitude: number, longitude: number) => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`
        window.open(url, "_blank")
    }

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedMaterialType("all")
        setSelectedStatus("all")
        setSelectedState("all")
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

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Materiales Publicados</h1>
                    <p className="text-zinc-300">Visualiza los materiales reciclables publicados y su estado de disponibilidad.</p>
                </div>

                <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Filtros</h2>
                        <Button variant="outline" size="sm" onClick={clearFilters} className="text-black cursor-pointer hover:bg-slate-100">
                            Limpiar filtros
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Search by name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Buscar por nombre</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar materiales..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Material type filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de Material</label>
                            <Select value={selectedMaterialType} onValueChange={setSelectedMaterialType}>
                                <SelectTrigger className="cursor-pointer border hover:border-lime-500">
                                    <SelectValue placeholder="Todos los tipos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="all">Todos los tipos</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="PLASTICO">Plástico</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="PAPEL">Papel</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="VIDRIO">Vidrio</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="METAL_COBRE">Metal/Cobre</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="ORGANICO">Orgánico</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="ELECTRONICOS">Electrónicos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status/Availability filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Disponibilidad</label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="cursor-pointer border hover:border-lime-500">
                                    <SelectValue placeholder="Todas las disponibilidades" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="all">Todas</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="AVAILABLE">Disponible</SelectItem>
                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value="PURCHASED">Comprado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* State filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado</label>
                            <Select value={selectedState} onValueChange={setSelectedState}>
                                <SelectTrigger className="cursor-pointer border hover:border-lime-500">
                                    <SelectValue placeholder="Todos los estados" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    {MEXICAN_STATES.map((state) => (
                                        <SelectItem key={state} value={state} className="hover:bg-slate-200 cursor-pointer">
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results counter */}
                    <div className="text-sm text-lime-300 tracking-wide animate-pulse">
                        Mostrando {filteredMaterials.length} de {recyclableMaterials?.recyclableMaterials.length || 0} materiales
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredMaterials.map((material) => (
                        <Card key={material.id} className={
                            material.status === "PURCHASED" ? "overflow-hidden bg-zinc-950 border-zinc-800 text-white transition-all ease-linear duration-300 hover:border-y-green-600"
                                : "overflow-hidden bg-zinc-950 border-zinc-800 text-white transition-all ease-linear hover:border-y-yellow-300"
                        }>
                            <CardHeader>
                                <div className="flex flex-col items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{material.title}</CardTitle>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                                        {
                                            material.user.userType === "SELLER" && (
                                                <Badge className="bg-lime-500 text-white hover:bg-lime-600 w-max">
                                                    <UserStar className="mr-2 h-4 w-4" />
                                                    VENDEDOR
                                                </Badge>
                                            )
                                        }
                                        <Badge className="bg-sky-500 text-white flex text-center items-center w-max">
                                            <Box className="mr-2 h-4 w-4" />
                                            {MATERIAL_TYPE_LABELS[material.materialType]}
                                        </Badge>
                                        {
                                            material.status === "AVAILABLE" && (
                                                <Badge className="bg-amber-500 text-white hover:bg-amber-600 w-max">
                                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                                    Disponible
                                                </Badge>
                                            )
                                        }
                                        {
                                            material.status === "PURCHASED" && (
                                                <Badge className="bg-green-500 text-white hover:bg-green-600 w-max">
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Comprado
                                                </Badge>
                                            )
                                        }
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <UserStar className="h-4 w-4 text-lime-500" />
                                    <p className="font-bold uppercase text-lime-500">
                                        {material.user.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <IdCardLanyard className="h-4 w-4 text-lime-500" />
                                    <p className="font-bold uppercase text-lime-500">
                                        {material.user.identifier}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <LucideBoxes className="h-4 w-4" />
                                    Cantidad de Material:
                                    <p className="font-bold text-white">
                                        {material.quantity} kg
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Map className="h-4 w-4" />
                                    <p className="font-bold text-white">
                                        {material.city}, {material.state}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <p className="font-bold text-white">
                                        {material.address}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPinHouseIcon className="h-4 w-4" />
                                    Código Postal:
                                    <p className="font-bold text-white">
                                        {material.postalCode}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <RectangleEllipsisIcon className="h-4 w-4" />
                                    CCT:
                                    <p className="font-bold text-white">
                                        {material.user.profile?.cct}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <RectangleEllipsisIcon className="h-4 w-4" />
                                    RFC:
                                    <p className="font-bold text-white">
                                        {material.user.profile?.rfc}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 text-sm text-muted-foreground">
                                    - Horario de Atención para Recolección de Materiales:
                                    <p className="font-bold text-white flex gap-2 items-center justify-center">
                                        <Clock className="h-4 w-4" />
                                        {material.schedule}
                                    </p>
                                </div>

                                <div className="bg-zinc-700 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Precio total:</span>
                                        <span className="text-lg font-bold text-green-500">
                                            ${calculateTotal(material.materialType, material.quantity)} MXN
                                        </span>
                                    </div>
                                    <div className="text-xs text-green-500 mt-1">
                                        ${MATERIAL_PRICES[material.materialType]} MXN por kg
                                    </div>
                                </div>
                                {/* Image List */}
                                <div className="">
                                    {material.images && material.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                                            {material.images && material.images.length > 0 ? (
                                                <RecyclableMaterialContentImages visualContent={material.images} />
                                            ) : (
                                                <p className="text-sm text-gray-500">No hay imágenes adjuntas para este material.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openGoogleMaps(material.latitude, material.longitude)}
                                        className="bg-zinc-600 border-none hover:bg-zinc-700 text-white hover:text-white cursor-pointer"
                                    >
                                        <MapPin className="mr-1 h-3 w-3" />
                                        ¿Cómo llegar?
                                    </Button>

                                    {/* {material.status === "PURCHASED" && (
                                        <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700">
                                            <Download className="mr-1 h-3 w-3" />
                                            Descargar Comprobante
                                        </Button>
                                    )} */}
                                </div>
                                {/* purchase */}
                                {/* <Button size="sm" className="flex-1" onClick={() => (toast.success("Material comprado con éxito"))}>
                                    <ShoppingCart className="mr-1 h-3 w-3" />
                                    Apartar material
                                </Button> */}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredMaterials.length === 0 && recyclableMaterials?.recyclableMaterials.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-16 text-center backdrop-blur-sm">
                        <div className="rounded-full bg-lime-200 p-6 mb-6">
                            <AlertCircle className="h-12 w-12 text-lime-800" />
                        </div>
                        <h3 className="text-xl font-semibold text-lime-200 mb-2">No hay Materiales Reciclables Disponibles</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Aún no se han publicado materiales reciclables. Los nuevos materiales disponibles aparecerán aquí automáticamente.
                        </p>
                    </div>
                )}

                {filteredMaterials.length === 0 &&
                    recyclableMaterials?.recyclableMaterials &&
                    recyclableMaterials.recyclableMaterials.length > 0 && (
                        <div className="text-center py-12">
                            <p className="text-zinc-300 mb-4">
                                No se encontraron materiales que coincidan con los filtros seleccionados
                            </p>
                            <Button variant="outline" onClick={clearFilters} className="text-black cursor-pointer hover:bg-slate-200">
                                Limpiar filtros
                            </Button>
                        </div>
                    )}
            </div>
        </div>
    )
}
