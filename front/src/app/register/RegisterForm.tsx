'use client'

import { Formik } from "formik"
import { initialValues, registerSchema } from "./register.schema"
import { ErrorMessage, Field, Form } from "formik"
import { registerUser } from "@/services/auth"

const RegisterForm = () => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={async (values) => {
        await registerUser(values)
      }}
    >
      <Form className="grid gap-6" noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">Nombre</label>
            <Field
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="Tu nombre"
            />
            <ErrorMessage name="name" component="div" className="text-sm text-red-600" />
          </div>

          <div className="grid gap-3">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <Field
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="tu@correo.com"
            />
            <ErrorMessage name="email" component="div" className="text-sm text-red-600" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
            <Field
              type="password"
              id="password"
              name="password"
              required
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="********"
              autoComplete="new-password"
            />
            <ErrorMessage name="password" component="div" className="text-sm text-red-600" />
          </div>

          <div className="grid gap-3">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirmar contraseña</label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-600" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <label htmlFor="address" className="text-sm font-medium text-slate-700">Dirección</label>
            <Field
              type="text"
              id="address"
              name="address"
              required
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="Tu dirección"
            />
            <ErrorMessage name="address" component="div" className="text-sm text-red-600" />
          </div>

          <div className="grid gap-3">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700">Teléfono</label>
            <Field
              type="text"
              id="phone"
              name="phone"
              required
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="011 1234 5678"
            />
            <ErrorMessage name="phone" component="div" className="text-sm text-red-600" />
          </div>
        </div>

        <button className="inline-flex justify-center rounded-2xl bg-red-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-200" type="submit">
          Registrarme
        </button>

        <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Regístrate rápido</p>
          <p className="mt-2">Luego podrás acceder a tu historial de pedidos y ofertas exclusivas sin demoras.</p>
        </div>

        <div className="text-sm text-slate-500">
          ¿Ya tenés cuenta? <a href="/login" className="font-semibold text-red-700 hover:text-red-900">Iniciá sesión</a>
        </div>
      </Form>
    </Formik>
  )
}

export default RegisterForm
