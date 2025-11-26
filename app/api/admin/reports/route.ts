import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { NextResponse } from "next/server";
import { UserType } from "@/generated/prisma/client";

// OBTENER TODOS LOS REPORTES (PARA ADMIN)
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== UserType.ADMIN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("[REPORTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
