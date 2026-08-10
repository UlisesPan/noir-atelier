'use client'
import { ErrorMessage, Field, Form, Formik } from "formik"
import { loginInitialValues, loginSchema } from "./login.schema"
import { loginUser } from "@/services/auth"
import { useAuth } from "@/context/AuthContext"

const LoginForm = () => {
  const { setDataUser } = useAuth()

  return (
    <Formik
      initialValues={loginInitialValues}
      validationSchema={loginSchema}
      onSubmit={async (values) => {
          try {
    const response = await loginUser(values);
    if (!response?.login) {
      alert('Credenciales inválidas');
    }
    setDataUser(response);
  } catch  {
     alert('Error al iniciar sesión');
  }
      }}
    >
      <Form className="grid gap-6">
        <div className="grid gap-4">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <Field
            type="email"
            id="email"
            name="email"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            placeholder="tu@correo.com"
            autoComplete="email"
          />
          <ErrorMessage name="email" component="div" className="text-sm text-red-600" />
        </div>

        <div className="grid gap-4">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
          <Field
            type="password"
            id="password"
            name="password"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            placeholder="********"
            autoComplete="current-password"
          />
          <ErrorMessage name="password" component="div" className="text-sm text-red-600" />
        </div>

        <button
          className="inline-flex justify-center rounded-2xl bg-red-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-200"
          type="submit"
        >
          Iniciar sesión
        </button>

        <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">¿Necesitas ayuda?</p>
          <p className="mt-2">Si olvidaste tu contraseña, puedes recuperarla desde el link de acceso.</p>
        </div>

        <div className="flex flex-col gap-1 text-sm text-slate-500">
          <a className="text-red-700 hover:text-red-900" href="/register">¿No tienes cuenta? Regístrate</a>
          <a className="text-slate-500 hover:text-slate-800" href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </Form>
    </Formik>
  )
}

export default LoginForm
