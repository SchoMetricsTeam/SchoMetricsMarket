"use client"

import { useEffect, useState, useCallback } from "react"
import type { Report, ReportStatus } from "@/generated/prisma/client"
import {
    Trash2,
    AlertCircle,
    Save,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    LoaderCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminNavigation } from "@/app/components/admin/AdminNavigation"

interface StatusChanges {
    [reportId: string]: {
        reportStatus?: string
    }
}

// Formateador de fechas
const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [statusChanges, setStatusChanges] = useState<StatusChanges>({})
    const [refreshingCards, setRefreshingCards] = useState<Set<string>>(new Set())

    const fetchReports = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/reports")
            if (!response.ok) throw new Error("Error al cargar los reportes")
            const data = await response.json()
            setReports(data)
        } catch (error) {
            toast.error("Error al cargar los reportes")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const saveStatusChanges = async (reportId: string) => {
        const changes = statusChanges[reportId]
        if (!changes) return

        try {
            setIsSaving(true)
            setRefreshingCards((prev) => new Set(prev).add(reportId))

            const response = await fetch(`/api/admin/reports/${reportId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(changes),
            })

            if (response.ok) {
                toast.success("Estado del reporte actualizado correctamente")

                // Update local state

                setReports((prev) =>
                    prev.map((report) => {
                        if (report.id === reportId) {
                            return {
                                ...report,
                                reportStatus: changes.reportStatus as ReportStatus,
                            }
                        }
                        return report
                    }),
                )

                // Clear changes for this report
                setStatusChanges((prev) => {
                    const newChanges = { ...prev }
                    delete newChanges[reportId]
                    return newChanges
                })

                // Trigger card refresh animation
                setTimeout(() => {
                    setRefreshingCards((prev) => {
                        const newSet = new Set(prev)
                        newSet.delete(reportId)
                        return newSet
                    })
                }, 600)
            } else {
                const error = await response.json()
                toast.error(error.message || "Error al actualizar estado del reporte")
                setRefreshingCards((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(reportId)
                    return newSet
                })
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al actualizar estado del reporte")
            setRefreshingCards((prev) => {
                const newSet = new Set(prev)
                newSet.delete(reportId)
                return newSet
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleStatusChange = (reportId: string, type: "reportStatus", value: string) => {
        setStatusChanges((prev) => ({
            ...prev,
            [reportId]: {
                ...prev[reportId],
                [type]: value,
            },
        }))
    }

    const handleDelete = async (reportId: string) => {
        try {
            const response = await fetch(`/api/admin/reports/${reportId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("No se pudo eliminar el reporte.")
            }

            setReports((prevReports) => prevReports.filter((report) => report.id !== reportId))
            toast.success("Reporte eliminado con éxito")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDIENTE":
                return {
                    bgClass: "bg-gradient-to-br from-rose-50 to-pink-50",
                    borderClass: "border-rose-200",
                    badgeClass: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/50",
                    selectClass: "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-none",
                    icon: <AlertTriangle className="h-4 w-4 animate-heartbeat" />,
                    label: "Pendiente",
                }
            case "REVISION":
                return {
                    bgClass: "bg-gradient-to-br from-amber-50 to-orange-50",
                    borderClass: "border-amber-200",
                    badgeClass: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50",
                    selectClass: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none",
                    icon: <Clock className="h-4 w-4 animate-spin" />,
                    label: "En revisión",
                }
            default:
                return {
                    bgClass: "bg-gradient-to-br from-emerald-50 to-teal-50",
                    borderClass: "border-emerald-200",
                    badgeClass: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50",
                    selectClass: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none",
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    label: "Completado",
                }
        }
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
        <div className="min-h-screen bg-black">
            <AdminNavigation />
            <div className="container mx-auto py-8 px-4">
                <div className="mb-12 space-y-4">
                    <div className="inline-block">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-indigo-400 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Administración de Reportes
                        </h1>
                    </div>
                    <p className="text-lg text-zinc-300 max-w-2xl">
                        Gestiona y supervisa todos los reportes recibidos
                    </p>
                    <div className="flex items-center gap-2 text-sm text-indigo-300">
                        <FileText className="h-4 w-4" />
                        <span>
                            {reports.length} {reports.length === 1 ? "reporte" : "reportes"} en total
                        </span>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-16 text-center backdrop-blur-sm">
                        <div className="rounded-full bg-indigo-200 p-6 mb-6">
                            <AlertCircle className="h-12 w-12 text-indigo-800" />
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-200 mb-2">No hay reportes disponibles</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Aún no se ha recibido ningún reporte. Los nuevos reportes aparecerán aquí automáticamente.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {reports.map((report) => {
                            const statusConfig = getStatusConfig(report.reportStatus)
                            const isRefreshing = refreshingCards.has(report.id)

                            return (
                                <Card
                                    key={report.id}
                                    className={`
                                    flex flex-col overflow-hidden border-2 transition-all duration-500
                                    ${statusConfig.bgClass} ${statusConfig.borderClass}
                                    hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
                                    ${isRefreshing ? "animate-pulse scale-[0.98]" : ""}
                                `}
                                >
                                    <CardHeader className="space-y-3 pb-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-xl font-bold leading-tight line-clamp-2">{report.title}</CardTitle>
                                            <Badge
                                                className={`${statusConfig.badgeClass} flex items-center gap-1.5 px-3 py-1 animate-fade-in shrink-0`}
                                            >
                                                {statusConfig.icon}
                                                <span className="font-semibold">{statusConfig.label}</span>
                                            </Badge>
                                        </div>
                                        <CardDescription className="flex items-center gap-2 text-sm">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{formatDate(report.createdAt)}</span>
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="grow space-y-5 pb-6">
                                        <div className="space-y-1 p-3 rounded-lg bg-background/50 backdrop-blur-sm border">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                <Building2 className="h-3.5 w-3.5" />
                                                Dirigido a
                                            </div>
                                            <p className="text-sm">
                                                {report.targetType}:{" "}
                                                <span className="font-bold text-teal-600">{report.sellerName}</span>
                                            </p>
                                        </div>

                                        <div className="space-y-1 p-3 rounded-lg bg-background/50 backdrop-blur-sm border">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                <User className="h-3.5 w-3.5" />
                                                Reportado por
                                            </div>
                                            <p className="text-sm font-bold text-blue-600 uppercase">{report.ownerName}</p>
                                        </div>

                                        {(report.rfc || report.cct) && (
                                            <div className="space-y-2 p-3 rounded-lg bg-background/50 backdrop-blur-sm border">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    Datos Adicionales
                                                </p>
                                                <div className="space-y-1 text-sm">
                                                    {report.rfc && (
                                                        <p>
                                                            <span className="font-medium">RFC:</span> {report.rfc}
                                                        </p>
                                                    )}
                                                    {report.cct && (
                                                        <p>
                                                            <span className="font-medium">CCT:</span> {report.cct}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-destructive uppercase tracking-wide">
                                                <AlertCircle className="h-3.5 w-3.5" />
                                                Contenido del Reporte
                                            </div>
                                            <p className="text-sm text-destructive font-medium leading-relaxed line-clamp-4">
                                                {report.content}
                                            </p>
                                        </div>

                                        <details className="group">
                                            <summary className="cursor-pointer list-none p-3 rounded-lg bg-background/50 backdrop-blur-sm border hover:bg-background/80 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                        Datos del Propietario del Reporte
                                                    </span>
                                                    <svg
                                                        className="h-4 w-4 transition-transform group-open:rotate-180"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </summary>
                                            <div className="mt-2 p-4 rounded-lg bg-background/30 backdrop-blur-sm border space-y-3 animate-fade-in">
                                                <div className="grid grid-cols-1 gap-3 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Nombre</p>
                                                            <p className="font-semibold text-blue-600">{report.ownerName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Correo</p>
                                                            <p className="font-semibold text-blue-600 break-all">
                                                                {report.ownerEmail}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Teléfono</p>
                                                            <p className="font-semibold text-blue-600">{report.ownerPhone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Ubicación</p>
                                                            <p className="font-semibold text-blue-600">
                                                                {report.ownerCity}, {report.ownerState} - CP: {report.ownerPostalCode}
                                                            </p>
                                                            <p className="text-xs mt-1">{report.ownerAddress}</p>
                                                        </div>
                                                    </div>
                                                    {report.ownerRFC && (
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">RFC</p>
                                                            <p className="font-semibold text-blue-600">{report.ownerRFC}</p>
                                                        </div>
                                                    )}
                                                    {report.ownerCCT && (
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">CCT</p>
                                                            <p className="font-semibold text-blue-600">{report.ownerCCT}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Tipo de Cuenta</p>
                                                        <p className="font-semibold text-blue-600">{report.ownerUserType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Identificador de Cuenta</p>
                                                        <p className="font-mono text-xl text-blue-600">{report.ownerIdentifier}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </details>

                                        <div className="space-y-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                Estado del Reporte
                                            </label>
                                            <Select
                                                value={statusChanges[report.id]?.reportStatus || report.reportStatus}
                                                onValueChange={(value) => handleStatusChange(report.id, "reportStatus", value)}
                                            >
                                                <SelectTrigger
                                                    className={`${statusConfig.selectClass} font-semibold shadow-md hover:shadow-lg transition-shadow`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PENDIENTE">
                                                        <div className="flex items-center gap-2">
                                                            <AlertTriangle className="h-4 w-4 animate-heartbeat" />
                                                            Pendiente
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="REVISION">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 animate-spin" />
                                                            En revisión
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="COMPLETADO">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            Completado
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {statusChanges[report.id] && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => saveStatusChanges(report.id)}
                                                    disabled={isSaving}
                                                    className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-4 border-t bg-background/30 flex flex-col">
                                        {
                                            report.reportStatus === "COMPLETADO" && (
                                                <>
                                                    <span className="text-sm text-muted-foreground py-3">Si el reporte ha sido atendido y solucionado de manera correcta, puedes eliminarlo.</span>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                className="w-full shadow-md hover:shadow-lg transition-all duration-300"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Eliminar Reporte
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el reporte de la base de
                                                                    datos.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(report.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Sí, eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )
                                        }
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
