import {
  AccountStatus,
  MaterialStatus,
  MaterialType,
} from "@/generated/prisma/client";

export interface UserTotalRecyclableMaterials {
  recyclableMaterialsCount: number;
  recentRecyclableMaterials: RecyclableMaterialItem[];
}

export interface RecyclableMaterialImageItem {
  id: string;
  url: string; // URL pública de S3
  s3Key?: string; // Opcional, solo para referencia interna si es necesario
  order: number;
}

export interface RecyclableMaterialUserData {
  id: string;
  identifier: string;
  name: string;
  role: string;
  userType: string;
  createdAt: string;
  recyclableMaterials: RecyclableMaterialItem[];
}

// NUEVA INTERFAZ: Define la estructura de los datos del usuario vendedor
export interface MaterialPublisherInfo {
  name: string;
  identifier: string;
  userType: string;
  profile: {
    address?: string | null;
    postalCode?: string | null;
    cct?: string | null;
    rfc?: string | null;
  } | null;
}

export interface RecyclableMaterialItem {
  id: string;
  title: string;
  folio: string;
  materialType: MaterialType;
  quantity: number;
  city: string;
  state: string;
  postalCode: string;
  address: string;
  location: string;
  schedule: string;
  images: RecyclableMaterialImageItem[];
  status: MaterialStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: MaterialPublisherInfo; // PROPIEDAD AÑADIDA: Incluye el objeto del usuario
}

export interface SellerUserProfileData {
  id: string;
  identifier: string;
  name: string;
  role: string;
  userType: string;
  createdAt: string;
  profile: {
    id: string; // Añadido por consistencia
    email: string;
    phone?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    address?: string;
    rfc?: string;
    cct?: string;
    publicAvatarDisplayUrl?: string; // Esta será la fileKey de S3
    signedAvatarUrl?: string; // URL firmada para mostrar la imagen
  } | null; // Profile puede ser null si no existe
  stripeAccount: {
    id: string;
    stripeAccountId: string;
    accountStatus: AccountStatus; //
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    onboardingComplete: boolean;
    onboardingLink: string;
    onboardingExpiresAt: string;
    createdAt: string;
    updatedAt: string;
  };
}

// ===== Company Types ====== //
export interface BuyerUserProfileData {
  id: string;
  identifier: string;
  name: string;
  role: string;
  userType: string;
  createdAt: string;
  profile: {
    id: string; // Añadido por consistencia
    email: string;
    city?: string;
    state?: string;
    postalCode?: string;
    address?: string;
    rfc?: string;
    cct?: string;
    publicAvatarDisplayUrl?: string; // Esta será la fileKey de S3
    signedAvatarUrl?: string; // URL firmada para mostrar la imagen
  } | null; // Profile puede ser null si no existe
}

// Material Sale
export interface SellerSalesData {
  id: string;
  purchaseFolio: string;
  totalAmount: number;
  paymentStatus: string;
  buyerName: string;
  buyerRFC: string;
  buyerAddress: string;
  buyerPhone: string;
  transporterName: string;
  transporterPhone: string;
  transporterCredential: string;
  collectionDate: string;
  collectionTime: string;
  createdAt: string;
  material: {
    id: string;
    folio: string;
    title: string;
    materialType: string;
    quantity: number;
    city: string;
    state: string;
    address: string;
    postalCode: string;
    location: string;
    schedule: string;
    status: string;
    user: {
      id: string;
      identifier: string;
      name: string;
      userType: string;
      profile: {
        address: string;
        postalCode: string;
        cct: string;
        rfc: string;
        city: string;
        state: string;
      };
    };
    images: Array<{
      id: string;
      url: string;
      order: number;
    }>;
  };
  buyer: {
    id: string;
    identifier: string;
    name: string;
    profile: {
      address: string;
      rfc: string;
      city: string;
      state: string;
    };
  };
}
// Material Purchased
export interface BuyerPurchaseData {
  id: string;
  purchaseFolio: string;
  totalAmount: number;
  paymentStatus: string;
  buyerName: string;
  buyerRFC: string;
  buyerAddress: string;
  buyerPhone: string;
  transporterName: string;
  transporterPhone: string;
  transporterCredential: string;
  collectionDate: string;
  collectionTime: string;
  createdAt: string;
  material: {
    id: string;
    title: string;
    materialType: string;
    quantity: number;
    city: string;
    state: string;
    address: string;
    postalCode: string;
    location: string;
    schedule: string;
    status: string;
    user: {
      id: string;
      identifier: string;
      name: string;
      userType: string;
      profile: {
        address: string;
        postalCode: string;
        cct: string;
        rfc: string;
        city: string;
        state: string;
      };
    };
    images: Array<{
      id: string;
      url: string;
      order: number;
    }>;
  };
  buyer: {
    id: string;
    identifier: string;
    name: string;
    profile: {
      address: string;
      rfc: string;
      city: string;
      state: string;
    };
  };
}

// TYPES FOR ADMIN

export interface AdminUserProfileData {
  id: string;
  identifier: string;
  name: string;
  role: string;
  userType: string;
  createdAt: string;
  profile: {
    id: string; // Añadido por consistencia
    email: string;
    city?: string;
    state?: string;
    postalCode?: string;
    address?: string;
    rfc?: string;
    cct?: string;
    publicAvatarDisplayUrl?: string; // Esta será la fileKey de S3
    signedAvatarUrl?: string; // URL firmada para mostrar la imagen
  } | null; // Profile puede ser null si no existe
}

// Types for All Data user ADMIN section
// Define a type for the user data to be returned
export interface AllDataUser {
  id: string;
  identifier: string;
  name: string;
  role: string;
  userType: string;
  createdAt: string;
  profile: {
    id: string; // Añadido por consistencia
    email: string;
    city?: string;
    state?: string;
    postalCode?: string;
    address?: string;
    rfc?: string;
    cct?: string;
    phone?: string;
    publicAvatarDisplayUrl?: string; // Esta será la fileKey de S3
    signedAvatarUrl?: string; // URL firmada para mostrar la imagen
  } | null; // Profile puede ser null si no existe
  recyclableMaterialUserData: RecyclableMaterialUserData[];
}

// Material Purchased

export interface PurchaseData {
  id: string;
  purchaseFolio: string;
  totalAmount: number;
  paymentStatus: string;
  buyerName: string;
  buyerRFC: string;
  buyerAddress: string;
  buyerPhone: string;
  transporterName: string;
  transporterPhone: string;
  transporterCredential: string;
  collectionDate: string;
  collectionTime: string;
  createdAt: string;
  material: {
    id: string;
    title: string;
    materialType: string;
    quantity: number;
    city: string;
    state: string;
    address: string;
    postalCode: string;
    location: string;
    schedule: string;
    status: string;
    user: {
      id: string;
      name: string;
      userType: string;
      profile: {
        address: string;
        postalCode: string;
        cct: string;
        rfc: string;
        city: string;
        state: string;
      };
    };
    images: Array<{
      id: string;
      url: string;
      order: number;
    }>;
  };
  buyer: {
    id: string;
    name: string;
    profile: {
      address: string;
      rfc: string;
      city: string;
      state: string;
    };
  };
}
