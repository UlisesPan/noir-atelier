"use client"
import { useEffect } from 'react'
import RegisterForm from './RegisterForm'
import { useRouter } from 'next/dist/client/components/navigation'
import { useAuth } from '@/context/AuthContext'

const Register = () => {
  const { dataUser, isReady } = useAuth()
    const router = useRouter()
  
    useEffect(() => {
      if (!isReady) return
      if (dataUser) {
        router.push("/")
      }
    }, [dataUser, isReady, router])

    if (!isReady) return null
    if (dataUser) return null
    
  return (
    <main className="min-h-screen bg-radial-gradient(circle_at_top_left,_rgba(207,12,12,0.14),_transparent_32%),#f7f5f3] flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-7xl grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-stretch">
        <div className="rounded-32px bg-slate-950 text-white p-10 shadow-[0_25px_70px_rgba(15,23,42,0.18)] flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-red-600">Milano Premium</span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">Regístrate y accede a lo mejor</h1>
            <p className="mt-4 text-gray-300 max-w-lg text-sm leading-7">Crea tu cuenta para recibir envíos gratuitos sobre $150, ofertas exclusivas y un checkout más rápido en cada compra.</p>
          </div>

          <div className="mt-10 grid gap-5 text-sm text-slate-300">
            <div className="rounded-[28px] bg-white/5 border border-white/10 p-6">
              <p className="font-semibold text-white">Envíos gratis</p>
              <p className="mt-2 text-gray-300">Disfruta envío sin costo en pedidos superiores a $150.</p>
            </div>
            <div className="rounded-[28px] bg-white/5 border border-white/10 p-6">
              <p className="font-semibold text-white">Ofertas exclusivas</p>
              <p className="mt-2 text-gray-300">Accede a promociones especiales solo para miembros.</p>
            </div>
            <div className="rounded-[28px] bg-white/5 border border-white/10 p-6">
              <p className="font-semibold text-white">Proceso rápido</p>
              <p className="mt-2 text-gray-300">Guarda tus datos para finalizar compras en un solo paso.</p>
            </div>
          </div>
        </div>

        <div className="rounded-32px bg-white border border-gray-200 shadow-[0_24px_70px_rgba(15,23,42,0.08)] p-8 md:p-10">
          <div className="max-w-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Crea tu cuenta</h2>
              <p className="mt-3 text-sm text-slate-500">Completa los datos y comienza a disfrutar de Milano con beneficios exclusivos.</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register
