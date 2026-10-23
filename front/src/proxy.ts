import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "na_session";

/** Lee el payload del JWT sin verificarlo: es solo un chequeo optimista de UX, la API valida de verdad. */
const readRole = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload.role ?? null;
  } catch {
    return null;
  }
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const role = token ? readRole(token) : null;
  const { pathname, search } = req.nextUrl;

  if (!role) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", pathname + search);
    const res = NextResponse.redirect(login);
    if (token) res.cookies.delete(SESSION_COOKIE);
    return res;
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"],
};
