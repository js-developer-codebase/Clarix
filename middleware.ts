import { auth } from "./src/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isSuperAdminRoute = nextUrl.pathname.startsWith("/super-admin");

  // Allow open routes (public)
  if (!isDashboardRoute && !isSuperAdminRoute && !isAuthRoute) return;

  // If on login page and logged in, redirect to appropriate dashboard
  if (isAuthRoute) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role;
      return Response.redirect(new URL(role === "SUPER_ADMIN" ? "/super-admin" : "/dashboard", nextUrl));
    }
    return;
  }

  // If not logged in and trying to access protected routes
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // Role-based protection
  const userRole = req.auth?.user?.role;

  if (isSuperAdminRoute && userRole !== "SUPER_ADMIN") {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  if (isDashboardRoute && userRole === "SUPER_ADMIN") {
    return Response.redirect(new URL("/super-admin", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
