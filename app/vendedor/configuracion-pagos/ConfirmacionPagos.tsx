"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, Loader2, CreditCard, ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { SellerNavigation } from "@/app/components/seller/SellerNavigation"

interface AccountStatus {
    hasAccount: boolean
    accountStatus: string | null
    chargesEnabled: boolean
    payoutsEnabled: boolean
    detailsSubmitted: boolean
    onboardingComplete: boolean
    requirementsCurrentlyDue: string[]
    requirementsEventuallyDue: string[]
}

export default function ConfiguracionPagosPage() {
    const searchParams = useSearchParams()
    const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [creatingAccount, setCreatingAccount] = useState(false)
    const [generatingLink, setGeneratingLink] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 5000)
        }
        fetchAccountStatus()
    }, [searchParams])

    const fetchAccountStatus = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/seller/stripe-connect/account-status")
            const data = await response.json()

            if (data.success) {
                setAccountStatus(data)
            }
        } catch (error) {
            console.error("Error fetching account status:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAccount = async () => {
        try {
            setCreatingAccount(true)
            const response = await fetch("/api/seller/stripe-connect/create-account", {
                method: "POST",
            })

            const data = await response.json()

            if (data.success) {
                await fetchAccountStatus()
            } else {
                alert(data.error || "Error al crear cuenta")
            }
        } catch (error) {
            console.error("Error creating account:", error)
            alert("Error al crear cuenta de vendedor")
        } finally {
            setCreatingAccount(false)
        }
    }

    const handleStartOnboarding = async () => {
        try {
            setGeneratingLink(true)
            const response = await fetch("/api/seller/stripe-connect/onboarding-link", {
                method: "POST",
            })

            const data = await response.json()

            if (data.success && data.url) {
                window.location.href = data.url
            } else {
                alert(data.error || "Error al generar enlace")
            }
        } catch (error) {
            console.error("Error generating onboarding link:", error)
            alert("Error al generar enlace de configuración")
        } finally {
            setGeneratingLink(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-lime-500" />
                </div>
            </div>
        )
    }

    return (
        <div className="">
            <SellerNavigation />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-lime-500 mb-2">Configuración de Pagos</h1>
                <p className="text-zinc-400">Configura tu cuenta para recibir pagos por la venta de materiales reciclables</p>
            </div>

            {showSuccess && (
                <Alert className="mb-6 bg-zinc-700 border-lime-500">
                    <CheckCircle className="h-4 w-4 text-lime-500" />
                    <AlertDescription className="text-lime-500">
                        ¡Configuración completada exitosamente! Tu cuenta está lista para recibir pagos.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-lime-500" />
                        Estado de tu Cuenta de Pagos
                    </CardTitle>
                    <CardDescription>
                        Necesitas completar la configuración de Stripe Connect para recibir pagos del 80% de las ventas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!accountStatus?.hasAccount ? (
                        <div className="space-y-4">
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Aún no has creado una cuenta de vendedor. Necesitas configurar Stripe Connect para recibir pagos
                                    cuando las empresas compren tus materiales.
                                </AlertDescription>
                            </Alert>

                            <div className="bg-zinc-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lime-500 mb-2">¿Cómo funciona?</h3>
                                <ul className="space-y-2 text-sm text-zinc-400">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-lime-500 mt-0.5 shrink-0" />
                                        <span>Los Compradores pagan el 100% del precio del material</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-lime-500 mt-0.5 shrink-0" />
                                        <span>
                                            Recibes el <strong className="text-lime-500">80%</strong> del monto total
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-lime-500 mt-0.5 shrink-0" />
                                        <span>
                                            SchoMetrics retiene el <strong className="text-zinc-300">20%</strong> como comisión de
                                            plataforma
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-lime-500 mt-0.5 shrink-0" />
                                        <span>Los pagos se depositan directamente en tu cuenta bancaria</span>
                                    </li>
                                </ul>
                            </div>

                            <Button
                                onClick={handleCreateAccount}
                                disabled={creatingAccount}
                                className="w-full bg-lime-500 hover:bg-lime-600"
                            >
                                {creatingAccount ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    <>
                                        Crear Cuenta de Vendedor
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
                                    <span className="text-sm font-medium">Estado de la Cuenta</span>
                                    <Badge
                                        variant={accountStatus.accountStatus === "ACTIVE" ? "default" : "secondary"}
                                        className={accountStatus.accountStatus === "ACTIVE" ? "bg-lime-500 text-white" : ""}
                                    >
                                        {accountStatus.accountStatus === "ACTIVE" ? "Activa" : "Pendiente"}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
                                    <span className="text-sm font-medium">Aceptar Pagos</span>
                                    {accountStatus.chargesEnabled ? (
                                        <CheckCircle className="h-5 w-5 text-lime-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
                                    <span className="text-sm font-medium">Recibir Transferencias</span>
                                    {accountStatus.payoutsEnabled ? (
                                        <CheckCircle className="h-5 w-5 text-lime-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
                                    <span className="text-sm font-medium">Información Completa</span>
                                    {accountStatus.detailsSubmitted ? (
                                        <CheckCircle className="h-5 w-5 text-lime-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            </div>

                            {!accountStatus.onboardingComplete && (
                                <>
                                    {accountStatus.requirementsCurrentlyDue.length > 0 && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                <p className="font-semibold mb-2">Requisitos pendientes para completar la configuración:</p>
                                                <ul className="list-disc list-inside text-sm space-y-1">
                                                    {accountStatus.requirementsCurrentlyDue.map((req) => (
                                                        <li key={req}>{req}</li>
                                                    ))}
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        onClick={handleStartOnboarding}
                                        disabled={generatingLink}
                                        className="w-full bg-lime-500 hover:bg-lime-600"
                                    >
                                        {generatingLink ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generando enlace...
                                            </>
                                        ) : (
                                            <>
                                                {accountStatus.detailsSubmitted ? "Actualizar Información" : "Completar Configuración"}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}

                            {accountStatus.onboardingComplete && (
                                <Alert className="bg-lime-500/10 border-lime-500">
                                    <CheckCircle className="h-4 w-4 text-lime-500" />
                                    <AlertDescription className="text-lime-500">
                                        ¡Tu cuenta está completamente configurada! Ya puedes recibir pagos por tus ventas. Recibirás el
                                        80% del monto de cada venta directamente en tu cuenta bancaria.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Información sobre los Pagos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-400">
                    <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <p>
                            Los pagos se procesan de forma segura a través de Stripe, uno de los sistemas de pago más confiables del
                            mundo.
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <p>
                            Recibes el 80% del precio de venta. El 20% restante es la comisión de SchoMetrics por proporcionar la
                            plataforma.
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <p>
                            Los pagos se depositan directamente en tu cuenta bancaria según el calendario de pagos de Stripe
                            (generalmente 2-7 días hábiles).
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <p>Puedes ver el historial completo de tus ventas y pagos en tu panel de control de Stripe.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
