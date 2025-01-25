import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.has("auth-token");
  // Permitir acceso solo si hay token, excepto en la ruta raíz
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configuración del matcher para aplicar el middleware a todas las rutas excepto "/"
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$).*)",
  ],
};
