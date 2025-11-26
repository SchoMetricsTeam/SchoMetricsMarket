// /lib/schemas.ts
import { z } from "zod";

// Schema de validación para el formulario de compra
export const PurchaseFormSchema = z.object({
  //   companyRFC: z
  //     .string()
  //     .min(12, "El RFC debe tener al menos 12 caracteres")
  //     .max(13, "El RFC no debe exceder 13 caracteres")
  //     .regex(/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/, "Formato de RFC inválido")
  //     .or(z.literal("")),
  buyerPhone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^[\d\s\-()+ ]+$/, "Formato de teléfono inválido"),
  transporterName: z
    .string()
    .min(1, "El nombre del transportista es requerido"),
  transporterPhone: z
    .string()
    .min(10, "El teléfono del transportista debe tener al menos 10 dígitos")
    .regex(/^[\d\s\-()+ ]+$/, "Formato de teléfono inválido"),
  transporterCredential: z
    .string()
    .min(1, "La credencial del transportista es requerida"),
  collectionDate: z.date({
    required_error: "La fecha de recolección es requerida",
  }),
  collectionTime: z.string().min(1, "La hora de recolección es requerida"),
  // transferImage: z
  //   .instanceof(File)
  //   .refine(
  //     (file) => file.size <= MAX_FILE_SIZE,
  //     `La imagen del baucher excede el tamaño máximo permitido de ${
  //       MAX_FILE_SIZE / (1024 * 1024)
  //     }MB.`
  //   )
  //   .refine(
  //     (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
  //     "La imagen del baucher debe ser JPG, PNG o WEBP."
  //   ),
});

// Tipo inferido del schema
export type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;

// Props para el componente PurchaseForm
export interface PurchaseFormProps {
  material: RecyclableMaterialItem;
  onClose: () => void;
  onSuccess: () => void;
}

// Definición de tipos para el material
export interface RecyclableMaterialItem {
  id: string;
  title: string;
  folio: string;
  materialType: "PLASTICO" | "PAPEL" | "VIDRIO" | "ORGANICO" | "ALUMINIO";
  quantity: number;
  city: string;
  state: string;
  address: string;
  schedule: string;
  status: "AVAILABLE" | "PURCHASED";
}

// Schema para validación de PaymentIntent
export const PaymentIntentSchema = z.object({
  materialId: z.string().min(1, "ID de material requerido"),
  materialType: z.enum(["PLASTICO", "PAPEL", "VIDRIO", "ORGANICO", "ALUMINIO"]),
  quantity: z.number().positive("La cantidad debe ser positiva"),
  purchaseData: PurchaseFormSchema,
});

// Schema para confirmación de pago
export const PaymentConfirmationSchema = z.object({
  paymentIntentId: z.string().min(1, "PaymentIntent ID es requerido"),
});

// Schema para registro de compra
export const MaterialPurchaseSchema = z.object({
  materialId: z.string().min(1, "ID de material requerido"),
  amount: z.number().positive("El monto debe ser positivo"),
  purchaseData: PurchaseFormSchema,
  paymentIntentId: z.string().min(1, "PaymentIntent ID es requerido"),
});

// Tipos para respuestas de API
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface PaymentConfirmationResponse {
  status: string;
  paymentIntentId: string;
  message: string;
  amount?: number;
  metadata?: Record<string, any>;
  purchase?: {
    id: string;
    folio: string;
    materialTitle: string;
    quantity: number;
    totalAmount: number;
  };
  requiresManualReview?: boolean;
  lastPaymentError?: string;
}

export interface PurchaseResponse {
  success: boolean;
  purchase: any; // Tipo completo de MaterialPurchase con relaciones
  message: string;
}

// Tipo para datos del perfil de BUYER
export interface BuyerUserProfileData {
  id: string;
  name: string;
  identifier: string;
  userType: string;
  profile?: {
    id: string;
    email?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    address?: string;
    phone?: string;
    rfc?: string;
    avatarUrl?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// SCHEMAS FOR REPORTS

export const reportSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "El título debe tener al menos 5 caracteres.",
    })
    .max(100, {
      message: "El título no puede exceder los 100 caracteres.",
    }),
  targetType: z.enum(["Vendedor", "Comprador"], {
    required_error: "Debes seleccionar a quién va dirigido el reporte.",
  }),
  reportUserType: z.enum(["Comprador", "Vendedor"], {
    required_error: "Debes seleccionar tu rol.",
  }),
  sellerName: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  rfc: z
    .string()
    .min(12, {
      message: "El RFC debe tener al menos 12 caracteres.",
    })
    .max(13, {
      message: "El RFC NO debe tener mas de 13 caracteres.",
    }),

  // Puedes añadir validaciones más estrictas con .regex() si lo necesitas
  cct: z.string().optional(),
  content: z
    .string()
    .min(20, {
      message: "El contenido del reporte debe tener al menos 20 caracteres.",
    })
    .max(5000, {
      message: "El contenido no puede exceder los 5000 caracteres.",
    }),
});
