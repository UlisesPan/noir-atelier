import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api-error";
import { apiFetch } from "@/lib/server/api";
import { clearSessionCookie, getCurrentUser, setSessionCookie } from "@/lib/server/session";
import type { User } from "@/lib/types";

type AuthResponse = { user: User; token: string };

const errorResponse = (error: unknown) => {
  if (error instanceof ApiError) return NextResponse.json({ message: error.message }, { status: error.status });
  return NextResponse.json({ message: "No pudimos conectar con el servidor" }, { status: 502 });
};

/** POST /api/auth/login | /api/auth/register | /api/auth/logout */
export async function POST(req: NextRequest, ctx: RouteContext<"/api/auth/[action]">) {
  const { action } = await ctx.params;

  if (action === "logout") {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  }
  if (action !== "login" && action !== "register") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const { user, token } = await apiFetch<AuthResponse>(`/auth/${action}`, {
      method: "POST",
      body: JSON.stringify(await req.json()),
    });
    await setSessionCookie(token);
    // El token NO se devuelve al navegador: queda solo en la cookie httpOnly.
    return NextResponse.json({ user }, { status: action === "register" ? 201 : 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

/** GET /api/auth/session → usuario actual o null */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/auth/[action]">) {
  const { action } = await ctx.params;
  if (action !== "session") return NextResponse.json({ message: "Not found" }, { status: 404 });
  const user = await getCurrentUser();
  return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
