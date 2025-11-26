import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { reportSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ReportStatus } from "@/generated/prisma/client";

// CREAR UN NUEVO REPORTE
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const validatedData = reportSchema.parse(body); // Valida con Zod

    const getCurrentUser = await prisma.user.findUnique({
      where: {
        id: session.id as string,
      },
      include: {
        profile: true,
      },
    });

    if (!getCurrentUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const report = await prisma.report.create({
      data: {
        title: validatedData.title,
        targetType: validatedData.targetType,
        reportUserType: validatedData.reportUserType,
        reportStatus: ReportStatus.PENDIENTE,
        sellerName: validatedData.sellerName,
        rfc: validatedData.rfc,
        cct: validatedData.cct,
        ownerName: getCurrentUser.name,
        ownerEmail: getCurrentUser.profile?.email || "",
        ownerIdentifier: getCurrentUser.identifier,
        ownerUserType: getCurrentUser.userType,
        ownerRFC: getCurrentUser.profile?.rfc || "",
        ownerCCT: getCurrentUser.profile?.cct || "",
        ownerCity: getCurrentUser.profile?.city || "",
        ownerState: getCurrentUser.profile?.state || "",
        ownerPostalCode: getCurrentUser.profile?.postalCode || "",
        ownerAddress: getCurrentUser.profile?.address || "",
        ownerPhone: getCurrentUser.profile?.phone || "",
        content: validatedData.content,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    // Si la validación de Zod falla, enviará un error 400
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("[REPORTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
