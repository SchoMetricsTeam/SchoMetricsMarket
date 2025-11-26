-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SELLER', 'BUYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'RESTRICTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('PLASTICO', 'PAPEL', 'VIDRIO', 'ORGANICO', 'ALUMINIO');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('AVAILABLE', 'PENDING', 'PURCHASED');

-- CreateEnum
CREATE TYPE "ReportTarget" AS ENUM ('Vendedor', 'Comprador');

-- CreateEnum
CREATE TYPE "ReportUserType" AS ENUM ('Comprador', 'Vendedor');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDIENTE', 'REVISION', 'COMPLETADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "userType" "UserType" NOT NULL DEFAULT 'SELLER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "rfc" TEXT,
    "cct" TEXT,
    "avatarUrl" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recyclable_materials" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "materialType" "MaterialType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "status" "MaterialStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "recyclable_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecyclableMaterialImage" (
    "id" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "RecyclableMaterialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecyclableMaterialImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_purchases" (
    "id" TEXT NOT NULL,
    "purchaseFolio" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerRFC" TEXT NOT NULL,
    "buyerPhone" TEXT NOT NULL,
    "buyerAddress" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "materialTitle" TEXT NOT NULL,
    "materialType" "MaterialType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "platformFeeAmount" DOUBLE PRECISION,
    "sellerAmount" DOUBLE PRECISION,
    "transporterName" TEXT NOT NULL,
    "transporterPhone" TEXT NOT NULL,
    "transporterCredential" TEXT NOT NULL,
    "collectionDate" TIMESTAMP(3) NOT NULL,
    "collectionTime" TEXT NOT NULL,
    "collectionAddress" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeTransferId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_connect_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeAccountId" TEXT NOT NULL,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING',
    "chargesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "payoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "detailsSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "onboardingLink" TEXT,
    "onboardingExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stripe_connect_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetType" "ReportTarget" NOT NULL,
    "reportUserType" "ReportUserType" NOT NULL,
    "reportStatus" "ReportStatus" NOT NULL DEFAULT 'PENDIENTE',
    "sellerName" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "cct" TEXT,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "ownerIdentifier" TEXT NOT NULL,
    "ownerUserType" TEXT NOT NULL,
    "ownerRFC" TEXT NOT NULL,
    "ownerCCT" TEXT,
    "ownerCity" TEXT,
    "ownerState" TEXT,
    "ownerPostalCode" TEXT,
    "ownerAddress" TEXT,
    "ownerPhone" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_identifier_key" ON "users"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_rfc_key" ON "profiles"("rfc");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_cct_key" ON "profiles"("cct");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "recyclable_materials_folio_key" ON "recyclable_materials"("folio");

-- CreateIndex
CREATE INDEX "RecyclableMaterialImage_RecyclableMaterialId_idx" ON "RecyclableMaterialImage"("RecyclableMaterialId");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_connect_accounts_userId_key" ON "stripe_connect_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_connect_accounts_stripeAccountId_key" ON "stripe_connect_accounts"("stripeAccountId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recyclable_materials" ADD CONSTRAINT "recyclable_materials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecyclableMaterialImage" ADD CONSTRAINT "RecyclableMaterialImage_RecyclableMaterialId_fkey" FOREIGN KEY ("RecyclableMaterialId") REFERENCES "recyclable_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_purchases" ADD CONSTRAINT "material_purchases_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_purchases" ADD CONSTRAINT "material_purchases_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_purchases" ADD CONSTRAINT "material_purchases_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "recyclable_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_connect_accounts" ADD CONSTRAINT "stripe_connect_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
