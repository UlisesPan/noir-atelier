import { IRegisterForm } from "@/app/register/register.schema"
import { ILoginForm } from "@/app/login/login.schema"

const baseUrl = process.env.NEXT_PUBLIC_BACK_URL

export const registerUser = async (userData: IRegisterForm) => {
    try {
        const response = await fetch(`${baseUrl}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
      
        throw error;
    }
}

export const loginUser = async (userData: ILoginForm) => {
  const response = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Error en el login');
  }

  return data;
}