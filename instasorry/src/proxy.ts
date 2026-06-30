import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const publicPaths = ["/", "/login", "/register", "/pricing", "/privacidade", "/termos", "/contato"];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith("/api/auth"));

  if (!isLoggedIn && !isPublic && !pathname.startsWith("/api/webhooks")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
