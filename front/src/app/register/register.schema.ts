import * as Yup from 'yup'


export interface IRegisterForm {
    name: string
    email: string
    password: string
    confirmPassword: string
    address: string
    phone: string
}

export const initialValues: IRegisterForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: ''
}

export const registerSchema = Yup.object({
  name: Yup.string().required('Este campo es obligatorio'),
  email: Yup.string().email('Email invalido').required('Este campo es obligatorio'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Este campo es obligatorio'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden').required('Este campo es obligatorio'),
  address: Yup.string().required('Este campo es obligatorio'),
  phone: Yup.string().required('Este campo es obligatorio')
})
