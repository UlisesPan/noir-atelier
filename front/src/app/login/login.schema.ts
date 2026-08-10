import * as Yup from 'yup'


export interface ILoginForm {
    email: string
    password: string

}

export const loginInitialValues: ILoginForm = {
    email: '',
    password: ''
}

export const loginSchema = Yup.object({
 
  email: Yup.string().
  email('Email invalido').
  required('El email es requerido'),
  password: Yup.string().
  min(6, 'La contraseña debe tener al menos 6 caracteres').
  required('La contraseña es requerida'),
});
