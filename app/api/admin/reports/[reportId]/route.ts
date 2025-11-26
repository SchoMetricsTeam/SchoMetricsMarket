import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ReportStatus, UserType } from "@/generated/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { reportId } = await params;
    const body = await request.json();
    const { reportStatus } = body;

    // Validate the report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Reporte no encontrado" },
        { status: 404 }
      );
    }

    // Update report in a transaction
    const updatedReportStatus = await prisma.$transaction(async (tx) => {
      // Update report status if provided
      if (
        reportStatus &&
        Object.values(ReportStatus).includes(reportStatus as ReportStatus)
      ) {
        await tx.report.update({
          where: { id: reportId },
          data: { reportStatus: reportStatus as ReportStatus },
        });
      }

      return report;
    });

    return NextResponse.json({
      success: true,
      purchase: updatedReportStatus,
      message: "Estados actualizados correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar estados del reporte:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar estados del reporte" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!(await params).reportId) {
      return new NextResponse("Report ID is required", { status: 400 });
    }

    // Aquí iría la lógica de autenticación para asegurar que solo un admin puede borrar
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const report = await prisma.report.delete({
      where: {
        id: (await params).reportId,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.log("[REPORT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
