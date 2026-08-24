import Link from "next/link";
import { IProduct } from "../../interfaces/product";
import Image from "next/image";
import fallbackImage  from "../../app/helpers/fallbackImage";


export const CardComponent = ({ name, price, stock, image, id }: IProduct) => {
  const imageSrc = image || fallbackImage;

  return (
    <Link href={`/product/${id}`} className="block group cursor-pointer">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
          <div className="h-80 w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={name}
              width={500}
              height={500}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
            <p className="text-sm text-slate-400">{stock > 0 ? "En stock" : "Agotado"}</p>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-semibold text-red-500">${price.toFixed(2)}</span>
           
          </div>
        </div>
      </div>
    </Link>
  );
};
  

