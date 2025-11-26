"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  CreditCard,
  Loader2,
  X,
  AlertTriangle,
  Truck,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  FolderKanbanIcon
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"
import { MATERIAL_PRICES, MATERIAL_TYPE_LABELS } from "@/lib/constants"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import {
  PurchaseFormSchema,
  type PurchaseFormData,
  type PurchaseFormProps,
  type BuyerUserProfileData,
  type RecyclableMaterialItem,
} from "@/lib/schemas"
import { useRouter } from "next/navigation"
import useUserSession from "@/hooks/useUserSession"
import { cn } from "@/lib/utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// --- Componente de Pago Stripe Rediseñado ---
function StripePaymentForm({
  totalPrice,
  material,
  formData,
  onSuccess,
  onCancel,
}: {
  totalPrice: number
  material: RecyclableMaterialItem
  formData: PurchaseFormData
  onSuccess: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>("")
  const [paymentError, setPaymentError] = useState<string>("")
  const router = useRouter()
  const session = useUserSession()

  // (Lógica original de useEffect y handleSubmit intacta para mantener funcionalidad)
  useEffect(() => {
    if (!material || !material.materialType) {
      setPaymentError("Información del material no válida")
      return
    }

    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materialId: material.id,
            materialType: material.materialType,
            quantity: material.quantity,
            purchaseData: formData,
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Error al crear PaymentIntent")

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          throw new Error("Respuesta inválida del servidor")
        }
      } catch (error) {
        setPaymentError(error instanceof Error ? error.message : "Error al inicializar el pago")
        toast.error("Error al inicializar el pago")
      }
    }
    createPaymentIntent()
  }, [material, formData])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPaymentError("")

    if (!stripe || !elements || !clientSecret) return
    setIsProcessing(true)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setIsProcessing(false)
      return
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: session.session?.name,
          phone: formData.buyerPhone,
        },
      },
    })

    if (error) {
      setPaymentError(error.message || "Error al procesar el pago")
      toast.error(error.message || "Error al procesar el pago")
      setIsProcessing(false)
      return
    }

    if (!paymentIntent) {
      setPaymentError("No se pudo obtener el PaymentIntent")
      setIsProcessing(false)
      return
    }

    if (paymentIntent.status === "requires_capture" || paymentIntent.status === "succeeded") {
      try {
        const confirmResponse = await fetch("/api/stripe/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        })

        if (!confirmResponse.ok) throw new Error("Error al confirmar el pago")

        const purchaseResponse = await fetch("/api/buyer/purchase-material", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materialId: material.id,
            amount: totalPrice,
            purchaseData: formData,
            paymentIntentId: paymentIntent.id,
          }),
        })

        if (!purchaseResponse.ok) throw new Error("Error al registrar la compra")

        toast.success("¡Pago procesado con éxito!")
        onSuccess()
        router.push(`/comprador/materiales-comprados/${session.session?.id}`)
      } catch (error) {
        setPaymentError(error instanceof Error ? error.message : "Error al procesar la compra")
        toast.error("Error crítico al finalizar la compra.")
      }
    } else {
      setPaymentError(`Estado inesperado: ${paymentIntent.status}`)
    }
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Resumen Final de Pago */}
      <div className="bg-linear-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200/60 shadow-inner">
        <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total a Pagar</p>
            <h2 className="text-4xl font-extrabold text-teal-700 mt-1">${totalPrice.toFixed(2)}</h2>
          </div>
          <div className="text-right">
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 mb-1 border-none px-3 py-1">
              {material.quantity} kg
            </Badge>
            <p className="text-xs text-slate-400">MXN</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Transacción encriptada de extremo a extremo</span>
        </div>
      </div>

      {paymentError && (
        <div className="flex items-center gap-3 p-4 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl text-red-600 animate-pulse">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{paymentError}</p>
        </div>
      )}

      {/* Input de Tarjeta Estilizado */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-700">Detalles de la Tarjeta</Label>
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1e293b",
                  fontFamily: "system-ui, sans-serif",
                  "::placeholder": { color: "#94a3b8" },
                  iconColor: "#0d9488",
                },
                invalid: { color: "#ef4444", iconColor: "#ef4444" },
              },
            }}
          />
        </div>
        <div className="flex items-center justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
          {/* Iconos de tarjetas simulados con texto o puedes importar SVGs */}
          <span className="text-xs font-bold text-slate-400 flex gap-2  items-center">
            <CreditCard className="w-6 h-6" /> 4141 4141 4141 4141
          </span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="h-12 rounded-xl border-slate-200 hover:bg-slate-200 text-slate-600 font-medium transition-all cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !clientSecret}
          className="h-12 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all transform hover:-translate-y-0.5 font-bold text-lg cursor-pointer"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Procesando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Pagar Ahora <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>
      </div>
    </form>
  )
}

// --- Componente Principal PurchaseForm ---
export function PurchaseForm({ material, onClose, onSuccess }: PurchaseFormProps) {
  const [formData, setFormData] = useState<Partial<PurchaseFormData>>({})
  const [errors, setErrors] = useState<Partial<Record<keyof PurchaseFormData, string>>>({})
  const [showPayment, setShowPayment] = useState(false)
  const [profile, setProfile] = useState<BuyerUserProfileData | null>(null)

  const totalPrice = material?.materialType ? MATERIAL_PRICES[material.materialType] * (material.quantity || 0) : 0

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/buyer/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) { console.error(error) }
    }
    fetchProfileData()
  }, [])

  const handleInputChange = (field: keyof PurchaseFormData, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const validation = PurchaseFormSchema.safeParse(formData)

    if (!validation.success) {
      const newErrors: Partial<Record<keyof PurchaseFormData, string>> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as keyof PurchaseFormData] = err.message
      })
      setErrors(newErrors)
      toast.error("Revisa los campos requeridos")
      return
    }

    const collectionDate = validation.data.collectionDate
    const minDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

    if (collectionDate < minDate) {
      setErrors({ collectionDate: "La recolección debe ser al menos 24 horas después" })
      return
    }
    setShowPayment(true)
  }

  if (!material) return null

  // --- UI Estructura Principal ---
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div
        className={cn(
          "bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative flex flex-col",
          "scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        )}
      >

        {/* Header con Gradiente Sutil */}
        <div className="sticky top-0 z-50 bg-zinc-100 backdrop-blur border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-700 to-emerald-600">
              {showPayment ? "Finalizar Compra" : "Datos Generales y Recolección"}
            </h2>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              {showPayment ? "Paso 2 de 2" : "Paso 1 de 2"}
              <span className="flex gap-1">
                <span className={`h-1.5 w-6 rounded-full transition-colors ${!showPayment ? 'bg-teal-500' : 'bg-slate-200'}`}></span>
                <span className={`h-1.5 w-6 rounded-full transition-colors ${showPayment ? 'bg-teal-500' : 'bg-slate-200'}`}></span>
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-8">
          {showPayment ? (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                totalPrice={totalPrice}
                material={material}
                formData={formData as PurchaseFormData}
                onSuccess={() => { onSuccess(); onClose(); }}
                onCancel={() => setShowPayment(false)}
              />
            </Elements>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right-8 duration-500">

              {/* Resumen del Material (Hero) */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-teal-200/50 transition-colors"></div>

                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm mb-2 px-3 py-1">
                      {material.materialType ? MATERIAL_TYPE_LABELS[material.materialType] : "Reciclaje"}
                    </Badge>
                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                      {material.quantity || 0} <span className="text-lg text-slate-500 font-medium">kg</span>
                    </h3>
                    <p className="text-slate-500 text-sm">Disponible para compra inmediata</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Precio Total</p>
                    <span className="text-2xl font-bold text-teal-700 block">${totalPrice.toFixed(2)}</span>
                    <span className="text-xs text-slate-400">MXN</span>
                  </div>
                </div>
              </div>

              {/* Sección 1: Datos del Comprador */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><User className="h-4 w-4" /></div>
                  <h3>Mis Datos (Empresa o Comprador Individual)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider">Mi Nombre</Label>
                    <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center gap-2">
                      <span className="truncate uppercase text-emerald-600" title={profile?.name.toUpperCase() || "Cargando..."}>{profile?.name.toUpperCase() || "Cargando..."}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider">Mi Dirección</Label>
                    <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sky-400 shrink-0" />
                      <span className="truncate text-sm" title={profile?.profile?.address || "Cargando..."}>{profile?.profile?.address || "..."}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider">Mi RFC</Label>
                    <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-xl text-blue-600 font-extrabold tracking-wide flex items-center gap-2">
                      <span className="truncate text-sm">{profile?.profile?.rfc?.toUpperCase() || "..."}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="buyerPhone">Mi Teléfono de Contacto</Label>
                    <Input
                      id="buyerPhone"
                      placeholder="(XXX) XXX-XXXX"
                      value={formData.buyerPhone || ""}
                      onChange={(e) => handleInputChange("buyerPhone", e.target.value)}
                      className={`h-11 rounded-xl bg-white transition-all focus:scale-[1.01] ${errors.buyerPhone ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 hover:border-teal-300 focus:border-teal-500"}`}
                    />
                    {errors.buyerPhone && <p className="text-xs text-red-500 font-medium ml-1">{errors.buyerPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Sección 2: Logística */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600"><Truck className="h-4 w-4" /></div>
                  <h3>Logística de Recolección</h3>
                </div>
                <p className="text-xs text-zinc-500">El "Transportista" es la persona en cargada de acudir al lugar determinado y realizar la recolección del material que está siendo comprado, es necesario proporcionar la información solicitada en la parte de abajo para validar la compra segura, el "Vendedor" tendra acceso a esa información y el "Transportista" tendrá que demostrar la veracidad de la información de acuerdo a los datos proporcionados a continuación.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="transporterName">Nombre del Transportista</Label>
                    <Input
                      id="transporterName"
                      value={formData.transporterName || ""}
                      onChange={(e) => handleInputChange("transporterName", e.target.value)}
                      className={`h-11 rounded-xl transition-all focus:scale-[1.01] ${errors.transporterName ? "border-red-400" : ""}`}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transporterPhone">Teléfono del Chofer</Label>
                    <Input
                      id="transporterPhone"
                      value={formData.transporterPhone || ""}
                      onChange={(e) => handleInputChange("transporterPhone", e.target.value)}
                      className={`h-11 rounded-xl transition-all focus:scale-[1.01] ${errors.transporterPhone ? "border-red-400" : ""}`}
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label htmlFor="transporterCredential">CURP / Matrícula de Trabajo / RFC</Label>
                    <Input
                      id="transporterCredential"
                      title="Proporciona la CURP, RFC, Matrícula de Trabajo o dato similar para validar a la persona que hará la recolección"
                      value={formData.transporterCredential || ""}
                      onChange={(e) => handleInputChange("transporterCredential", e.target.value)}
                      className={`h-11 rounded-xl transition-all focus:scale-[1.01] ${errors.transporterCredential ? "border-red-400" : ""}`}
                      placeholder="Proporciona la CURP, RFC, Matrícula de Trabajo o dato similar"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Fecha */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-2">
                  <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><Clock className="h-4 w-4" /></div>
                  <h3>Agenda de Recolección</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Fecha de Recolección</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal h-11 rounded-xl border-slate-200 hover:bg-slate-50 ${!formData.collectionDate && "text-muted-foreground"} ${errors.collectionDate ? "border-red-400" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                          {formData.collectionDate ? format(formData.collectionDate, "PPP", { locale: es }) : "Seleccionar día"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-none" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.collectionDate}
                          onSelect={(date) => date && handleInputChange("collectionDate", date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 bg-white rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.collectionDate && <p className="text-xs text-red-500 ml-1">{errors.collectionDate}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Hora Estimada</Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={formData.collectionTime || ""}
                        onChange={(e) => handleInputChange("collectionTime", e.target.value)}
                        className={`h-11 rounded-xl pl-10 ${errors.collectionTime ? "border-red-400" : ""}`}
                      />
                      <Clock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex gap-4">
                <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-xl h-12 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 rounded-xl h-12 bg-teal-800 text-white hover:bg-teal-900 shadow-lg shadow-slate-900/20 font-bold text-lg transition-all hover:scale-[1.02] cursor-pointer">
                  Continuar al Pago
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}