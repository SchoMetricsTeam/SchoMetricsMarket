import { NextRequest, NextResponse } from "next/server";
import prisma from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { getPublicSupabaseUrl } from "@/lib/supabase-service";
import {
  MaterialStatus,
  MaterialType,
  UserType,
} from "@/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId } = await params;

    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener los materiales publicados por el usuario (Seller)
    const publishedRecyclableMaterials =
      await prisma.recyclableMaterial.findMany({
        where: {
          userId: userId,
        },
        include: {
          images: {
            orderBy: { order: "asc" },
            select: { id: true, s3Key: true, order: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    // Transformar los datos para el frontend
    const formattedPublishedRecyclableMaterials =
      publishedRecyclableMaterials.map((published) => ({
        id: published.id,
        userId: published.userId,
        title: published.title,
        materialType: published.materialType as MaterialType,
        quantity: published.quantity,
        city: published.city,
        state: published.state,
        postalCode: published.postalCode,
        address: published.address,
        latitude: published.latitude,
        longitude: published.longitude,
        schedule: published.schedule,
        images: published.images.map((img) => ({
          id: img.id,
          url: getPublicSupabaseUrl(img.s3Key),
          order: img.order,
        })),
        status: published.status as MaterialStatus,
        createdAt: published.createdAt.toISOString(),
        updatedAt: published.updatedAt.toISOString(),
      }));

    return NextResponse.json(formattedPublishedRecyclableMaterials);
  } catch (error) {
    console.error("Error al obtener materiales reciclables publicados:", error);
    return NextResponse.json(
      { error: "Error al obtener materiales reciclables publicados" },
      { status: 500 }
    );
  }
}
