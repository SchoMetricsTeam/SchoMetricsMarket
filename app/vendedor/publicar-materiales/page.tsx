// "use client"
// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { CheckCircle, XCircle, AlertCircle, Loader2, CreditCard, ArrowRight, Edit } from "lucide-react"
// import { useSearchParams } from "next/navigation"
// import NewRecyclableMaterialForm from "./components/NewRecyclableMaterial"
// import { SellerNavigation } from "@/app/components/seller/SellerNavigation"

// interface AccountStatus {
//   hasAccount: boolean
//   accountStatus: string | null
//   chargesEnabled: boolean
//   payoutsEnabled: boolean
//   detailsSubmitted: boolean
//   onboardingComplete: boolean
//   requirementsCurrentlyDue: string[]
//   requirementsEventuallyDue: string[]
// }

// export default function NewRecyclableMaterialPage() {
//   const searchParams = useSearchParams()
//   const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [creatingAccount, setCreatingAccount] = useState(false)
//   const [generatingLink, setGeneratingLink] = useState(false)
//   const [showSuccess, setShowSuccess] = useState(false)

//   useEffect(() => {
//     if (searchParams.get("success") === "true") {
//       setShowSuccess(true)
//       setTimeout(() => setShowSuccess(false), 5000)
//     }
//     fetchAccountStatus()
//   }, [searchParams])

//   const fetchAccountStatus = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("/api/seller/stripe-connect/account-status")
//       const data = await response.json()

//       if (data.success) {
//         setAccountStatus(data)
//       }
//     } catch (error) {
//       console.error("Error fetching account status:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateAccount = async () => {
//     try {
//       setCreatingAccount(true)
//       const response = await fetch("/api/seller/stripe-connect/create-account", {
//         method: "POST",
//       })

//       const data = await response.json()

//       if (data.success) {
//         await fetchAccountStatus()
//       } else {
//         alert(data.error || "Error al crear cuenta")
//       }
//     } catch (error) {
//       console.error("Error creating account:", error)
//       alert("Error al crear cuenta de vendedor")
//     } finally {
//       setCreatingAccount(false)
//     }
//   }

//   const handleStartOnboarding = async () => {
//     try {
//       setGeneratingLink(true)
//       const response = await fetch("/api/seller/stripe-connect/onboarding-link", {
//         method: "POST",
//       })

//       const data = await response.json()

//       if (data.success && data.url) {
//         window.location.href = data.url
//       } else {
//         alert(data.error || "Error al generar enlace")
//       }
//     } catch (error) {
//       console.error("Error generating onboarding link:", error)
//       alert("Error al generar enlace de configuración")
//     } finally {
//       setGeneratingLink(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-950">
//         <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
//           <Loader2 className="h-8 w-8 animate-spin text-lime-500" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#06001b]">
//       <SellerNavigation />
//       <div className="flex flex-col justify-center items-center mt-5 p-4">
//         <div className="mb-10 mt-5 p-3 w-full flex flex-col justify-center items-center text-center">
//           <div className="p-2 mb-3 bg-sellerBaseColor/5 rounded-lg border border-sellerBaseColor/30">
//             <Edit className="h-6 w-6 text-sellerBaseColor" />
//           </div>
//           <h1 className="text-4xl font-bold text-sellerBaseColor">
//             Publicar Materiales Reciclables
//           </h1>
//           <p className="text-zinc-300 text-lg leading-relaxed">
//             Crea nuevas publicaciones de venta para materiales reciclables
//           </p>
//         </div>

//         {showSuccess && (
//           <Alert className="bg-lime-500/10 border-lime-500 w-max my-5">
//             <CheckCircle className="h-4 w-4 text-lime-500" />
//             <AlertDescription className="text-lime-500">
//               ¡Configuración completada exitosamente! Tu cuenta está lista para recibir pagos.
//             </AlertDescription>
//           </Alert>
//         )}

//         <Card className="mb-6 w-full md:w-1/2 border-4 border-sellerBaseColor/20 shadow-md shadow-indigo-500 hover:border-sellerBaseColor transition-all ease-linear duration-300">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CreditCard className="h-5 w-5 text-lime-500" />
//               Estado de tu Cuenta de Pagos
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {!accountStatus?.hasAccount ? (
//               <div className="space-y-4">
//                 <Alert className="bg-[#fff8f8] border-red-600">
//                   <AlertCircle className="h-4 w-4 text-rose-700" />
//                   <AlertDescription className="text-rose-700">
//                     Aún no has creado una cuenta de vendedor. Necesitas configurar tu cuenta de Stripe Connect para recibir pagos
//                     cuando las empresas compren tus materiales.
//                   </AlertDescription>
//                 </Alert>

//                 <div className="bg-zinc-100 p-4 rounded-lg">
//                   <h3 className="font-semibold text-orange-500 mb-2">¿Cómo funciona?</h3>
//                   <ul className="space-y-2 text-sm text-zinc-400">
//                     <li className="flex items-start gap-2">
//                       <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
//                       <span>Los Compradores pagan el 100% del precio del material.</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
//                       <span>
//                         Recibes el <strong className="text-orange-500">80%</strong> del monto total.
//                       </span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
//                       <span>
//                         SchoMetrics retiene el <strong className="text-sellerBaseColor">20%</strong> como comisión de
//                         plataforma.
//                       </span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
//                       <span>Los pagos se depositan directamente en tu cuenta bancaria.</span>
//                     </li>
//                   </ul>
//                 </div>

//                 <Button
//                   onClick={handleCreateAccount}
//                   disabled={creatingAccount}
//                   className="w-full bg-orange-700 hover:bg-orange-600 cursor-pointer"
//                 >
//                   {creatingAccount ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creando cuenta...
//                     </>
//                   ) : (
//                     <>
//                       Crear Cuenta de Vendedor
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </>
//                   )}
//                 </Button>
//               </div>
//             ) : (
//               <div className="">
//                 <div className="space-y-4">
//                   <div className="grid gap-3">
//                     <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
//                       <span className="text-sm font-medium">Estado de la Cuenta</span>
//                       <Badge
//                         variant={accountStatus.accountStatus === "ACTIVE" ? "default" : "secondary"}
//                         className={accountStatus.accountStatus === "ACTIVE" ? "bg-lime-500 text-white uppercase" : "text-orange-500 font-bold uppercase"}
//                       >
//                         {accountStatus.accountStatus === "ACTIVE" ? "Activa" : "Pendiente"}
//                       </Badge>
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
//                       <span className="text-sm font-medium">Aceptar Pagos</span>
//                       {accountStatus.chargesEnabled ? (
//                         <CheckCircle className="h-5 w-5 text-lime-500" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-500" />
//                       )}
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
//                       <span className="text-sm font-medium">Recibir Transferencias</span>
//                       {accountStatus.payoutsEnabled ? (
//                         <CheckCircle className="h-5 w-5 text-lime-500" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-500" />
//                       )}
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
//                       <span className="text-sm font-medium">Información Completa</span>
//                       {accountStatus.detailsSubmitted ? (
//                         <CheckCircle className="h-5 w-5 text-lime-500" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-500" />
//                       )}
//                     </div>
//                   </div>

//                   {!accountStatus.onboardingComplete && (
//                     <>
//                       {accountStatus.requirementsCurrentlyDue.length > 0 && (
//                         <Alert>
//                           <AlertCircle className="h-4 w-4" />
//                           <AlertDescription>
//                             <p className="font-semibold mb-2">Requisitos pendientes para completar la configuración:</p>
//                             <ul className="list-disc list-inside text-sm space-y-1">
//                               {accountStatus.requirementsCurrentlyDue.map((req) => (
//                                 <li key={req}>{req}</li>
//                               ))}
//                             </ul>
//                           </AlertDescription>
//                         </Alert>
//                       )}

//                       <Button
//                         onClick={handleStartOnboarding}
//                         disabled={generatingLink}
//                         className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
//                       >
//                         {generatingLink ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Generando enlace...
//                           </>
//                         ) : (
//                           <>
//                             {accountStatus.detailsSubmitted ? "Actualizar Información" : "Completar Configuración"}
//                             <ArrowRight className="ml-2 h-4 w-4" />
//                           </>
//                         )}
//                       </Button>
//                     </>
//                   )}

//                   {accountStatus.onboardingComplete && (
//                     <>
//                       <Alert className="bg-lime-500/10 border-lime-500">
//                         <CheckCircle className="h-4 w-4 text-lime-500" />
//                         <AlertDescription className="text-lime-500">
//                           ¡Tu cuenta está completamente configurada! Ya puedes recibir pagos por tus ventas. Recibirás el
//                           80% del monto de cada venta directamente en tu cuenta bancaria.
//                         </AlertDescription>
//                       </Alert>
//                       <Card>
//                         <CardHeader>
//                           <CardTitle>Información sobre los Pagos</CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-3 text-sm text-zinc-400">
//                           <div className="flex items-start gap-2">
//                             <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
//                             <p>
//                               Los pagos se procesan de forma segura a través de Stripe, uno de los sistemas de pago más confiables del
//                               mundo.
//                             </p>
//                           </div>
//                           <div className="flex items-start gap-2">
//                             <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
//                             <p>
//                               Recibes el 80% del precio de venta. El 20% restante es la comisión de SchoMetrics por proporcionar la
//                               plataforma.
//                             </p>
//                           </div>
//                           <div className="flex items-start gap-2">
//                             <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
//                             <p>
//                               Los pagos se depositan directamente en tu cuenta bancaria según el calendario de pagos de Stripe
//                               (generalmente 2-7 días hábiles).
//                             </p>
//                           </div>
//                           <div className="flex items-start gap-2">
//                             <div className="h-2 w-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
//                             <p>Puedes ver el historial completo de tus ventas y pagos en tu panel de control de Stripe.</p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <NewRecyclableMaterialForm />
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



"use client"
import { useEffect, useState, Suspense } from "react" // 1. Importar Suspense
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, Loader2, CreditCard, ArrowRight, Edit } from "lucide-react"
import { useSearchParams } from "next/navigation"
import NewRecyclableMaterialForm from "./components/NewRecyclableMaterial"
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

// 2. Componente de Carga reutilizable (Tu diseño original)
function PageLoader() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-lime-500" />
      </div>
    </div>
  )
}

// 3. Componente interno que contiene la lógica y useSearchParams
function NewRecyclableMaterialContent() {
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
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-[#06001b]">
      <SellerNavigation />
      <div className="flex flex-col justify-center items-center mt-5 p-4">
        <div className="mb-10 mt-5 p-3 w-full flex flex-col justify-center items-center text-center">
          <div className="p-2 mb-3 bg-sellerBaseColor/5 rounded-lg border border-sellerBaseColor/30">
            <Edit className="h-6 w-6 text-sellerBaseColor" />
          </div>
          <h1 className="text-4xl font-bold text-sellerBaseColor">
            Publicar Materiales Reciclables
          </h1>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Crea nuevas publicaciones de venta para materiales reciclables
          </p>
        </div>

        {showSuccess && (
          <Alert className="bg-lime-500/10 border-lime-500 w-max my-5">
            <CheckCircle className="h-4 w-4 text-lime-500" />
            <AlertDescription className="text-lime-500">
              ¡Configuración completada exitosamente! Tu cuenta está lista para recibir pagos.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 w-full md:w-1/2 border-4 border-sellerBaseColor/20 shadow-md shadow-indigo-500 hover:border-sellerBaseColor transition-all ease-linear duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-lime-500" />
              Estado de tu Cuenta de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!accountStatus?.hasAccount ? (
              <div className="space-y-4">
                <Alert className="bg-[#fff8f8] border-red-600">
                  <AlertCircle className="h-4 w-4 text-rose-700" />
                  <AlertDescription className="text-rose-700">
                    Aún no has creado una cuenta de vendedor. Necesitas configurar tu cuenta de Stripe Connect para recibir pagos
                    cuando las empresas compren tus materiales.
                  </AlertDescription>
                </Alert>

                <div className="bg-zinc-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-500 mb-2">¿Cómo funciona?</h3>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <span>Los Compradores pagan el 100% del precio del material.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <span>
                        Recibes el <strong className="text-orange-500">80%</strong> del monto total.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <span>
                        SchoMetrics retiene el <strong className="text-sellerBaseColor">20%</strong> como comisión de
                        plataforma.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <span>Los pagos se depositan directamente en tu cuenta bancaria.</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleCreateAccount}
                  disabled={creatingAccount}
                  className="w-full bg-orange-700 hover:bg-orange-600 cursor-pointer"
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
              <div className="">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
                      <span className="text-sm font-medium">Estado de la Cuenta</span>
                      <Badge
                        variant={accountStatus.accountStatus === "ACTIVE" ? "default" : "secondary"}
                        className={accountStatus.accountStatus === "ACTIVE" ? "bg-lime-500 text-white uppercase" : "text-orange-500 font-bold uppercase"}
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
                        className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
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
                    <>
                      <Alert className="bg-lime-500/10 border-lime-500">
                        <CheckCircle className="h-4 w-4 text-lime-500" />
                        <AlertDescription className="text-lime-500">
                          ¡Tu cuenta está completamente configurada! Ya puedes recibir pagos por tus ventas. Recibirás el
                          80% del monto de cada venta directamente en tu cuenta bancaria.
                        </AlertDescription>
                      </Alert>
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
                      <NewRecyclableMaterialForm />
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 4. Componente Principal Exportado (El Wrapper)
export default function NewRecyclableMaterialPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NewRecyclableMaterialContent />
    </Suspense>
  )
}