import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/auth";

// Rutas que requieren que el usuario esté autenticado, sin importar su rol.
const authenticatedRoutes = ["/vendedor/", "/comprador/"];

// Rutas específicas para el rol SELLER
const protectedSellerRoutes = [
  "/vendedor/perfil",
  "/vendedor/publicar-materiales",
  "/vendedor/materiales-publicados",
  "/vendedor/mis-ventas",
  "/vendedor/tratamiento-del-material",
];

// Rutas específicas para el rol BUYER
const protectedBuyerRoutes = [
  "/comprador/perfil",
  "/comprador/materiales-disponibles",
  "/comprador/materiales-comprados",
];

// Rutas específicas para el rol ADMIN
const protectedAdminRoutes = [
  "/admin/perfil",
  "/admin/lista-de-usuarios",
  "/admin/materiales-comprados",
  "/admin/materiales-disponibles",
];

// Rutas de inicio de sesión (para usuarios ya autenticados)
const loginProtectedRoutes = [
  "/iniciar-sesion/vendedor",
  "/iniciar-sesion/comprador",
  "/admin/auth/login-admin",
];
// ADMIN Rutas de registro
const adminRegisterProtectedRoutes = [
  "/admin/auth/registro-admin",
  "/admin/auth/registro-usuario",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener el token directamente de las cookies de la solicitud
  const token = request.cookies.get("token")?.value;
  const session = token ? await decrypt(token) : null;

  // Protección para las rutas de registro de ADMIN
  // Esta debe ser una de las primeras verificaciones.
  const isRegisterAdminRoute = adminRegisterProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isRegisterAdminRoute && (!session || session.role !== "ADMIN")) {
    const url = new URL("/admin/auth/login-admin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 1. Proteger todas las rutas que requieren autenticación
  const requiresAuth = authenticatedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresAuth && !session) {
    let loginUrl = "/"; // URL de fallback

    if (pathname.startsWith("/vendedor")) {
      loginUrl = "/iniciar-sesion/vendedor";
    } else if (pathname.startsWith("/comprador")) {
      loginUrl = "/iniciar-sesion/comprador";
    } else if (pathname.startsWith("/admin")) {
      loginUrl = "/admin/auth/login-admin";
    }

    const url = new URL(loginUrl, request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Si hay sesión, procedemos a las validaciones por rol
  if (session) {
    // 2. Protección de rutas de Inicio de Sesión para usuarios que ya están autenticados
    if (loginProtectedRoutes.some((route) => pathname.startsWith(route))) {
      switch (session.userType) {
        case "SELLER":
          return NextResponse.redirect(
            new URL("/vendedor/materiales-publicados", request.url)
          );
        case "BUYER":
          return NextResponse.redirect(
            new URL("/comprador/materiales-disponibles", request.url)
          );
        case "ADMIN":
          return NextResponse.redirect(new URL("/admin/perfil", request.url));
        default:
          return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 3. Protección de rutas por rol
    const isSellerRoute = protectedSellerRoutes.some((route) =>
      pathname.startsWith(route)
    );
    // Lógica de rol
    if (isSellerRoute && session.userType !== "SELLER") {
      // Si no es SELLER, no puede acceder a estas rutas.
      return NextResponse.redirect(new URL("/", request.url)); // Redirige a la página principal o a una de "acceso denegado"
    }

    const isBuyerRoute = protectedBuyerRoutes.some((route) =>
      pathname.startsWith(route)
    );
    // Lógica de rol
    if (isBuyerRoute && session.userType !== "BUYER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const isAdminRoute = protectedAdminRoutes.some((route) =>
      pathname.startsWith(route)
    );
    // Lógica de rol
    if (isAdminRoute && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
