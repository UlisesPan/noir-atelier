import { IProduct } from "../interfaces/product";

const baseUrl = process.env.NEXT_PUBLIC_BACK_URL
export const getProducts = async () => {
  try{

    const response = await fetch(`${baseUrl}/products`);
    const data: IProduct[] = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

export const getProductById = async (id: string): Promise<IProduct> => {
try {
    const response = await getProducts();
    const product = response.filter((product) => product.id === Number(id));
    if (!product || product.length === 0) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product[0];
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw error;
  }
}