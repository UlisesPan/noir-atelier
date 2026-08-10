"use client";
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/order";
import { Order } from "@/interfaces/order";

const Dashboard = () => {
  const { dataUser } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!dataUser) return
    const getOrders = async () => {
      
      const res = await getAllOrders(dataUser.token)
      setOrders(res)
      setLoading(false)
    }
    getOrders()

  }, [dataUser])

  if (!dataUser) return null
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(207,12,12,0.12),transparent_35%),#f7f5f3] px-4 py-10">
      <div className="max-w-7xl mx-auto grid gap-8">
        ...
        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="grid gap-6">
            <div className="rounded-4xl bg-white border border-gray-200 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Resumen de pedidos</h2>
                  <p className="mt-2 text-sm text-slate-500">Revisa rápidamente el estado de tus compras más recientes.</p>
                </div>
                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                  {orders.length} pedidos
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Pedidos completados</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">{orders.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">En espera</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">0</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Envío gratis</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">A partir de $150</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl bg-white border border-gray-200 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-slate-950">Pedidos recientes</h2>

              {loading ? (
                <p className="mt-4 text-sm text-slate-500">Cargando pedidos...</p>
              ) : orders.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No tenés pedidos registrados aún.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Pedido #{order.id}</p>
                      <p className="mt-1 text-sm text-slate-700">
                        Fecha: {new Date(order.date).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">Estado: {order.status}</p>
                      <p className="mt-1 text-sm text-slate-700">Items: {order.products.length}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          ...
        </section>
      </div>
    </main>
  );
  
}

export default Dashboard
