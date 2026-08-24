'use client'
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import LoginForm from "./LoginForm"

const Login = () => {
  const { dataUser, isReady } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered") === "1"

  useEffect(() => {
    if (!isReady) return
    if (dataUser) {
      router.push("/")
    }
  }, [dataUser, isReady, router])

  if (!isReady) return null
  if (dataUser) return null

  return (
    <main className="min-h-screen  flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-6xl grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
        <div className="hidden lg:flex flex-col justify-center rounded-[32px] bg-slate-950 text-white p-10 shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-red-600">Milano</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">Bienvenido de vuelta</h1>
          <p className="mt-4 text-gray-300 max-w-lg text-sm leading-7">Accede a tu cuenta y continúa explorando fragancias exclusivas, ofertas especiales y tu historial de pedidos en un solo lugar.</p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-[28px] bg-white/5 border border-white/10 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-red-300">Compras más rápidas</h2>
              <p className="mt-2 text-sm text-slate-300">Guarda tus datos y completa tu checkout en segundos.</p>
            </div>
            <div className="rounded-[28px] bg-white/5 border border-white/10 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-red-300">Ofertas exclusivas</h2>
              <p className="mt-2 text-sm text-slate-300">Recibe promociones especiales directamente en tu cuenta.</p>
            </div>
            <div className="rounded-[28px] bg-white/5 border border-white/10 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-red-300">Soporte dedicado</h2>
              <p className="mt-2 text-sm text-slate-300">Resolvemos tus dudas rápidamente para que compres con confianza.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white border border-gray-200 shadow-[0_24px_70px_rgba(15,23,42,0.08)] p-8 md:p-10">
          <div className="max-w-xl">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-red-700">Cuenta segura</span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Iniciar sesión</h2>
              <p className="mt-3 text-sm text-slate-500">Ingresa con tu correo y contraseña para continuar con tu experiencia Milano.</p>
            </div>

            {registered && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Cuenta creada correctamente. Iniciá sesión para continuar.
              </div>
            )}

            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login