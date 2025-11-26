import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/generated/prisma";
import { getSession } from "@/lib/auth"; // Assuming getSession can identify the logged-in user
import { getPublicSupabaseUrl } from "@/lib/supabase-service";
import { UserType } from "@/generated/prisma/client";

// Define a type for the user data to be returned
interface AllDataUser {
  id: string;
  name: string;
  identifier: string;
  userType: string;
  avatarUrl?: string | null; // This will be the signed URL
  totalRecyclableMaterial: number;
  totalPurchasesMade: number;
  totalMaterialsSold: number;
  memberSince: string; // ISO date string
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    // Optional: Add role check if only specific users (e.g., admins or all authenticated users) can see DATA
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";
    const userTypeFilter = searchParams.get("userType") || "all"; // 'all', 'SELLER', 'BUYER', 'ADMIN'
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    // Only add OR condition if searchTerm is present
    if (searchTerm) {
      whereClause.OR = [
        {
          identifier: {
            contains: searchTerm /* mode: "insensitive" removed */,
          },
        },
      ];
    }

    if (userTypeFilter !== "all") {
      whereClause.userType = userTypeFilter;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        identifier: true,
        userType: true,
        createdAt: true,
        profile: {
          select: {
            avatarUrl: true, // This is the fileKey
          },
        },
        _count: {
          select: {
            recyclableMaterials: true,
            purchasesMade: true,
            materialsSold: true,
          },
        },
      },
      orderBy: {
        userType: "desc", // Example: order by userType
      },
      skip,
      take: limit,
    });

    const totalUsers = await prisma.user.count({ where: whereClause });

    const formattedUsers: AllDataUser[] = await Promise.all(
      users.map(async (user) => {
        let signedAvatarUrl: string | null = null;
        if (user.profile?.avatarUrl) {
          try {
            signedAvatarUrl = getPublicSupabaseUrl(user.profile.avatarUrl);
          } catch (e) {
            console.error(
              `Error al generar URL firmada para ${user.profile.avatarUrl}:`,
              e
            );
            // Mantener signedAvatarUrl como null si falla la generación
          }
        }
        return {
          id: user.id,
          name: user.name,
          identifier: user.identifier,
          userType: user.userType,
          avatarUrl: signedAvatarUrl,
          totalRecyclableMaterial: user._count.recyclableMaterials,
          totalPurchasesMade: user._count.purchasesMade,
          totalMaterialsSold: user._count.materialsSold,
          memberSince: user.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener los datos de los usuarios:", error);
    // Devolver el error de Prisma si es una PrismaClientValidationError para más detalles en el cliente
    if (error instanceof prisma.$executeRawUnsafe) {
      return NextResponse.json(
        {
          error:
            "Error de validación de Prisma al obtener los datos de los usuarios.",
          details: error.toString(),
        },
        { status: 400 } // Bad Request podría ser más apropiado para errores de validación
      );
    }
    return NextResponse.json(
      {
        error:
          "Error interno del servidor al obtener los datos de los usuarios.",
      },
      { status: 500 }
    );
  }
}
