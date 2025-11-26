"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, AlertTriangle, CreditCard, Ban, Trash2, Loader } from 'lucide-react'
import toast from "react-hot-toast"

interface StripeConnectManagementProps {
    userId: string
}

interface AccountStatus {
    hasAccount: boolean
    account?: {
        id: string
        stripeAccountId: string
        accountStatus: string
        chargesEnabled: boolean
        payoutsEnabled: boolean
        detailsSubmitted: boolean
        onboardingComplete: boolean
    }
    stripeStatus?: {
        chargesEnabled: boolean
        payoutsEnabled: boolean
        detailsSubmitted: boolean
        requirementsCurrentlyDue: string[]
        requirementsEventuallyDue: string[]
    }
    user?: {
        id: string
        name: string
        identifier: string
        userType: string
    }
}

export function StripeConnectManagement({ userId }: StripeConnectManagementProps) {
    const [loading, setLoading] = useState(true)
    const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")

    useEffect(() => {
        fetchAccountStatus()
    }, [userId])

    const fetchAccountStatus = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/stripe-connect/${userId}/status`)
            const data = await response.json()

            if (response.ok) {
                setAccountStatus(data)
            } else {
                console.error("Error fetching account status:", data.error)
            }
        } catch (error) {
            console.error("Error fetching account status:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRejectAccount = async () => {
        setActionLoading(true)
        try {
            const response = await fetch(`/api/admin/stripe-connect/${userId}/reject`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectionReason }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Cuenta rechazada exitosamente")
                setRejectDialogOpen(false)
                setRejectionReason("")
                await fetchAccountStatus()
            } else {
                toast.error(data.error || "Error al rechazar cuenta")
            }
        } catch (error) {
            console.error("Error rejecting account:", error)
            toast.error("Error al rechazar cuenta")
        } finally {
            setActionLoading(false)
        }
    }

    // const handleActivateAccount = async () => {
    //     setActionLoading(true)
    //     try {
    //         const response = await fetch(`/api/admin/stripe-connect/${userId}/activate`, {
    //             method: "PUT",
    //         })

    //         const data = await response.json()

    //         if (response.ok) {
    //             toast.success("Cuenta activada exitosamente")
    //             await fetchAccountStatus()
    //         } else {
    //             toast.error(data.error || "Error al activar cuenta")
    //         }
    //     } catch (error) {
    //         console.error("Error activating account:", error)
    //         toast.error("Error al activar cuenta")
    //     } finally {
    //         setActionLoading(false)
    //     }
    // }

    const handleDeleteAccount = async () => {
        setActionLoading(true)
        try {
            const response = await fetch(`/api/admin/stripe-connect/${userId}/delete`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Cuenta eliminada exitosamente")
                setDeleteDialogOpen(false)
                await fetchAccountStatus()
            } else {
                toast.error(data.error || "Error al eliminar cuenta")
            }
        } catch (error) {
            console.error("Error deleting account:", error)
            toast.error("Error al eliminar cuenta")
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <Badge className="bg-green-500">Activa</Badge>
            case "PENDING":
                return <Badge className="bg-yellow-500">Pendiente</Badge>
            case "RESTRICTED":
                return <Badge className="bg-orange-500">Restringida</Badge>
            case "REJECTED":
                return <Badge className="bg-red-500">Rechazada</Badge>
            default:
                return <Badge className="bg-gray-500">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        )
    }

    if (!accountStatus?.hasAccount) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Stripe Connect
                    </CardTitle>
                    <CardDescription>Gestión de pagos con Stripe</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Sin cuenta</AlertTitle>
                        <AlertDescription>
                            Este usuario no tiene una cuenta de Stripe Connect configurada.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-md shadow-lime-500">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Gestión de Stripe Connect
                    </span>
                    {getStatusBadge(accountStatus.account!.accountStatus)}
                </CardTitle>
                <CardDescription>
                    ID: {accountStatus.account!.stripeAccountId}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Capabilities Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        {accountStatus.account!.chargesEnabled ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                            <p className="text-sm font-medium">Cobros</p>
                            <p className="text-xs text-gray-500">
                                {accountStatus.account!.chargesEnabled ? "Habilitado" : "Deshabilitado"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        {accountStatus.account!.payoutsEnabled ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                            <p className="text-sm font-medium">Retiros</p>
                            <p className="text-xs text-gray-500">
                                {accountStatus.account!.payoutsEnabled ? "Habilitado" : "Deshabilitado"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        {accountStatus.account!.detailsSubmitted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                            <p className="text-sm font-medium">Configuración</p>
                            <p className="text-xs text-gray-500">
                                {accountStatus.account!.onboardingComplete ? "Completa" : "Pendiente"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Admin Actions */}
                <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Acciones de Administrador</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Reject Button */}
                        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                    disabled={accountStatus.account!.accountStatus === "REJECTED"}
                                >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Rechazar
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rechazar Cuenta</DialogTitle>
                                    <DialogDescription>
                                        Esta acción rechazará la cuenta y deshabilitará los cobros.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="reason">Motivo del rechazo (opcional)</Label>
                                        <Textarea
                                            id="reason"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Escribe el motivo del rechazo..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setRejectDialogOpen(false)}
                                        disabled={actionLoading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleRejectAccount}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Rechazando...
                                            </>
                                        ) : (
                                            "Confirmar Rechazo"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Activate Button */}
                        {/* <Button
                            variant="outline"
                            className="w-full border-green-500 text-green-600 hover:bg-green-50"
                            onClick={handleActivateAccount}
                            disabled={actionLoading || accountStatus.account!.accountStatus === "ACTIVE"}
                        >
                            {actionLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RotateCcw className="mr-2 h-4 w-4" />
                            )}
                            Activar
                        </Button> */}

                        {/* Delete Button */}
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full border-red-600 text-red-700 hover:bg-red-50 cursor-pointer hover:text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Eliminar Cuenta de Stripe Connect</DialogTitle>
                                    <DialogDescription>
                                        Esta acción es irreversible. Se eliminará la cuenta tanto de Stripe como de la base de datos.
                                    </DialogDescription>
                                </DialogHeader>
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Advertencia</AlertTitle>
                                    <AlertDescription>
                                        Al eliminar esta cuenta, el usuario no podrá recibir pagos y perderá todo el historial asociado.
                                    </AlertDescription>
                                </Alert>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteDialogOpen(false)}
                                        disabled={actionLoading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Eliminando...
                                            </>
                                        ) : (
                                            "Confirmar Eliminación"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-max text-teal-600 cursor-pointer hover:bg-green-100 hover:text-emerald-800"
                        onClick={fetchAccountStatus}
                        size="sm"
                    >
                        <Loader className="mr-2 h-4 w-4" />
                        Actualizar Estado
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
