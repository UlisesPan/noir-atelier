"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { getAllOrders } from "@/services/order";
import { Order } from "@/interfaces/order";
import { useRouter } from "next/navigation";
const Dashboard = () => {
  const { dataUser, isReady } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const summary = useMemo(() => {
    const completed = orders.filter((order) => /completado|entregad/i.test(order.status)).length;
    const products = orders.reduce((sum, order) => sum + order.products.length, 0);
    const lastOrder = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      completed,
      products,
      lastOrder,
    };
  }, [orders]);

  useEffect(() => {
    if (!isReady) return;
    if (!dataUser){
      router.push("/login");
    } 
  }, [dataUser, isReady, router]);

  useEffect(() => {
    if (!dataUser?.token) return;

    const getOrders = async () => {
      setLoading(true);
      try {
        const res = await getAllOrders(dataUser.token);
        setOrders(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [dataUser]);

  if (!dataUser) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(207,12,12,0.12),transparent_35%),#f7f5f3] px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <article className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.35em] text-red-500">Panel de usuario</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Hola, {dataUser.user.name}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Este es tu espacio personal. Controlá tus pedidos, revisá tus datos y buscá nuevas fragancias para seguir completando tu colección.
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-300">Cuenta</span>
                <p className="text-sm text-slate-300">{dataUser.user.email}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Pedidos totales</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{orders.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Productos comprados</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{summary.products}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Pedidos completados</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{summary.completed}</p>
              </div>
              
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_0.85fr]">
              <div className="rounded-3xl bg-red-50 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600">Último pedido</p>
                <div className="mt-4 space-y-2">
                  <p className="text-lg font-semibold text-slate-950">
                    {orders.length ? `Pedido #${summary.lastOrder?.id}` : "Aún no tenés pedidos"}
                  </p>
                  {orders.length ? (
                    <>
                      <p className="text-sm text-slate-600">
                        {new Date(summary.lastOrder.date).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-slate-600">Estado: Aprobado</p>
                      <p className="text-sm text-slate-600">Items: {summary.lastOrder.products.length}</p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-600">Comenzá tu primera compra y mantené tu perfil lleno de experiencias premium.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white/95 p-6 shadow-inner shadow-red-100/50">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Inspiración</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-950">Explorá lo siguiente</h2>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      Tu perfil crece con cada compra. Volvé a la tienda y descubrí productos pensados para tu estilo.
                    </p>
                  </div>
                  <Link href="/" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Volver a la tienda
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <aside className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Perfil</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Datos de contacto</h2>
              </div>
            </div>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-medium text-slate-900">Nombre</p>
                <p>{dataUser.user.name}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-medium text-slate-900">Teléfono</p>
                <p>{dataUser.user.phone}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-medium text-slate-900">Dirección</p>
                <p>{dataUser.user.address}</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Pedidos recientes</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Tus últimas compras</h2>
              </div>
              <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">{orders.length} pedidos</span>
            </div>

            {loading ? (
              <p className="mt-6 text-sm text-slate-500">Cargando pedidos...</p>
            ) : orders.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">Todavía no tenés pedidos. Comenzá a comprar para completar tu perfil.</p>
            ) : (
              <div className="mt-6 grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-slate-950">
                          {new Date(order.date).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className='rounded-full px-3 py-1 text-sm font-semibold'>Aprobado </span>
                        <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 border border-slate-200">{order.products.length} items</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-600">
                        {order.products.map((product) => product.name).slice(0, 3).join(", ")}
                        {order.products.length > 3 ? "..." : ""}
                      </p>
                      <Link href="/" className="text-sm font-semibold text-red-600 transition hover:text-red-700">
                        Seguir comprando
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
