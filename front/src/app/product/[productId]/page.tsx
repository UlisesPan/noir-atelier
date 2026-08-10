import { getProductById } from "@/services/services";
import { notFound } from "next/navigation";
import { IProduct } from "../../../interfaces/types";
import Image from "next/image";
import fallbackImage from "@/app/helpers/fallbackImage";
import AddToCartButton from "@/components/AddToCartButton/AddToCartButton";

interface ProductIdProps {
  params: Promise<{ productId: string }>;
}

const ProductId = async ({ params }: ProductIdProps) => {
  const { productId } = await params;

  let product: IProduct;

  try {
    product = await getProductById(productId);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="w-full">
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/6 bg-slate-900 shadow-lg">
            <div className="aspect-[4/5] w-full">
              <Image
                src={product.image || fallbackImage}
                alt={product.name}
                fill
                className="object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-slate-900 ">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-red-600">${product.price.toFixed(2)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {product.stock > 0 ? 'En stock' : 'Agotado'}
              </span>
            </div>

            <p className="text-slate-600 max-w-2xl">{product.description}</p>

            <div className="flex items-center gap-4">
              <AddToCartButton product={product} />
              <button className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductId;
