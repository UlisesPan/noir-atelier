import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/server/api";
import { getToken } from "@/lib/server/session";

/**
 * Proxy autenticado hacia la API: el navegador llama a /api/proxy/<ruta> y Next
 * agrega el JWT de la cookie httpOnly. Así el token nunca queda expuesto al cliente.
 */
async function handler(req: NextRequest, ctx: RouteContext<"/api/proxy/[...path]">) {
  const { path } = await ctx.params;
  const token = await getToken();
  const target = `${API_URL}/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;

  const hasBody = !["GET", "HEAD"].includes(req.method);
  try {
    const res = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });
    return new NextResponse(res.status === 204 ? null : await res.text(), {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "No pudimos conectar con el servidor" }, { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
