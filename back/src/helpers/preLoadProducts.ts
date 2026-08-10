import { AppDataSource } from "../config/dataSource";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product.repository";

interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  stock: number;
}

const productsToPreLoad: IProduct[] = [
  {
    name: "Armani Code Eau de Toilette",
    price: 150000,
    description:
      "Experience power and elegance with the iPhone 11: capture stunning moments with its dual-camera system, enjoy exceptional performance, and immerse yourself in a brilliant Liquid Retina display. Discover a world of possibilities in the palm of your hand!",
    image:
      "https://imgs.search.brave.com/RHLobVP9Y5eh00dYsB4xM8ZRUjaHuss1yYD9mSK0EiA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/MzFQYW5YcDV2a0wu/anBn",
    categoryId: 1,
    stock: 10,
  },
  {
name: "Versace Eros Flame EDP",
price: 308000,
description: "Una fragancia intensa y sofisticada con notas de chinotto, limón y pimienta negra. Diseñada para hombres que buscan dejar una huella de elegancia, pasión y magnetismo natural en cada paso.",
image: "https://imgs.search.brave.com/D9zX1MpXZ-7ZhXixq5W9ezxrwETqG3IFMbkFUHIOXg4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzgzMDAwNC1DQlQ5/MjcwMDMxMTAxNl8w/OTIwMjUtRS53ZWJw",
categoryId: 2,
stock: 15,
},
{
name: "Jean Paul Gaultier Le Male Elixir",
price: 319800,
description: "Una fragancia audaz y opulenta que intensifica la legendaria lavanda con notas sensuales de ciruela y haba tonka. Ideal para quienes buscan una presencia inolvidable y llena de energía.",
image: "https://imgs.search.brave.com/HFBQI63olvftdKUxXM_K6xZWEHvWiiBCYymAygif4ns/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iZWF1/dHlob3VzZS5jb20v/Y2RuL3Nob3AvZmls/ZXMvMDNoYzN1aG41/ay5wbmc_dj0xNzY0/MzYyNTcxJndpZHRo/PTE2MDA",
categoryId: 2,
stock: 8,
},
{
name: "Dolce & Gabbana Light Blue",
price: 287000,
description: "Una fragancia aromática, chispeante y fresca que evoca el espíritu del verano mediterráneo. Combina notas de mandarina, bergamota y romero para un aroma casual y elegante.",
image: "https://imgs.search.brave.com/cKXSqsLUC1vnne1VjMFofhcc3gJYcQbcqPdgFZ-4D8w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YmF0aXRpZW5kYS5j/b20vYmF0aWNsb3Vk/L2ltYWdlcy9wcm9k/dWN0X3BpY3R1cmVf/YzEyNDI4NjliZDlm/NDcyZTg5Njk0YzZm/Mzc2ODkwNjFfNjM4/ODQ1MzgyNDk1MTMw/MzU5XzBfbS5qcGc",
categoryId: 2,
stock: 20,
},
{
name: "Antonio Banderas Blue Seduction",
price: 46570,
description: "Un perfume equilibrado que mezcla frescura acuática con toques amaderados. Es la elección perfecta para el día a día, emanando un aire de lujo sutil y carisma relajado.",
image: "https://imgs.search.brave.com/fZFKXi6bUYzk0Zq_ihU5kjmV6z_oWR-MIK-ZIBysJdg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzgxODc0Ny1NTEE1/MjA4MTE3OTM1NF8x/MDIwMjItRS53ZWJw",
categoryId: 2,
stock: 25,
},
{
    name: "Bleu de Chanel Eau de Parfum",
    price: 350000,
    description: "Una fragancia amaderada aromática con un espíritu decidido. Un aroma atemporal y profundo que combina la frescura de los cítricos con notas de cedro y sándalo.",
    image: "https://imgs.search.brave.com/Qqy8DuRh9TNWxfZOcHRjXa9FXZqhC5iv0YQkGt0TMz8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/MjFiM0tYdVRRcUwu/anBn",
    categoryId: 2,
    stock: 12,
},
{
    name: "Dior Sauvage Eau de Toilette",
    price: 330000,
    description: "Un acto de creación inspirado en los grandes espacios abiertos. Una composición radiante y fresca, marcada por la bergamota de Calabria y el ambroxan.",
    image: "https://imgs.search.brave.com/TZFYEusFglDWzRgjF357W4zXN4hRf3dwTdBL38edJHI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5kb3VnbGFzLmRl/L21lZGlhcy9ZMHBY/bjc4NzY5NzAtMC1k/Z2wtREUuanBnP2Nv/bnRleHQ9YldGemRH/VnlmR2x0WVdkbGMz/d3hNekl3TnpkOGFX/MWhaMlV2YW5CbFoz/eGhSMDEzVERKbk0x/bFRPREpPZW1zeFRY/cGpNMDVxUlhwTmFr/VjVUbWs1V2sxSVFs/bGlhbU0wVG5wWk5V/NTZRbVpOUmpscldq/SjNkRkpGVlhWaGJr/SnVmRFZqTTJOaE5H/VTRPREJqTnpkaE1X/WmpZVGM1TjJFeE1U/a3pZVGxoTlRnd01E/aG1OREZsWVdSbU9U/bGtNRGd5WkRKak1X/WTVPV014WWpZNE1U/TXlNRE0mZ3JpZD10/cnVlJmltUG9saWN5/PWdyYXlTY2FsZWQ",
    categoryId: 2,
    stock: 10,
},
{
    name: "Paco Rabanne One Million EDT",
    price: 290000,
    description: "Un perfume audaz y seductor con notas de mandarina roja, menta, canela y cuero. Representa el poder, la riqueza y el lujo en una icónica botella en forma de lingote de oro.",
    image: "https://imgs.search.brave.com/GJjT-NWBs9CS_J2XDYx5ZFmvBWJ-8aPRgz0ya0wsI6Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzg1MjE0NC1NTEE4/MTI3MTM5ODQwM18x/MjIwMjQtRS53ZWJw",
    categoryId: 2,
    stock: 14,
},
{
    name: "Yves Saint Laurent La Nuit de L'Homme",
    price: 310000,
    description: "Una fragancia llena de tensiones y contrastes olfativos. La elegancia se une a la virilidad en una mezcla magnética de cardamomo, cedro y cumarina.",
    image: "https://imgs.search.brave.com/4s9j14HB7tkXLFCjRZbgR2pquTpNbG_E2SqymzT0ngM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zaW1w/bGljaXR5YXIudnRl/eGFzc2V0cy5jb20v/YXJxdWl2b3MvaWRz/LzE2MTIxMC04MDAt/YXV0bz92PTYzODIx/MzE1NTQ0NzUwMDAw/MCZ3aWR0aD04MDAm/aGVpZ2h0PWF1dG8m/YXNwZWN0PXRydWU",
    categoryId: 2,
    stock: 7,
},
{
    name: "Acqua Di Gio Profondo EDP",
    price: 325000,
    description: "Una interpretación marina e intensa de Giorgio Armani. Notas acuáticas combinadas con mandarina verde, bergamota y esencias minerales para una frescura profunda.",
    image: "https://imgs.search.brave.com/shvLx2lRA_Xo2EfF_VkrsYv0PAhg6BRqjQcGehrTa7k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hY2Ru/LXVzLm1pdGllbmRh/bnViZS5jb20vc3Rv/cmVzLzUyNS83MjEv/cHJvZHVjdHMvMTMt/NDUxMjNmNmI2Y2Yw/NzE0ZmYzMTc3NDkw/MTUwODc3OTktNDgw/LTAud2VicA",
    categoryId: 2,
    stock: 9,
},
{
    name: "Tom Ford Ombré Leather EDP",
    price: 450000,
    description: "Libre por naturaleza, salvaje y visceral. Un perfume de cuero texturizado combinado con notas florales de jazmín sambac y un fondo ambarino que evoca el calor del desierto.",
    image: "https://imgs.search.brave.com/PuznKq04Pi7MIzAR3W3H3N3C4Rls3MS87HVZYTU81g4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzk2MDI4OS1NTEE1/MDc3MzQwOTc0NF8w/NzIwMjItRS53ZWJw",
    categoryId: 2,
    stock: 5,
},
{
    name: "Montblanc Explorer EDP",
    price: 195000,
    description: "Una invitación a un viaje sin escalas, combinando bergamota italiana, vetiver de Haití y pachulí de Sulawesi para el hombre aventurero y moderno.",
    image: "https://imgs.search.brave.com/aclC0Oy1nXC2Js-mFtFcieR1Evoujrg3FgeG5EBoQcU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iZWx2/aXNoLmNvbS9jZG4v/c2hvcC9maWxlcy9J/TUctNjYxNS1lMTU4/MjAxNjAxNjQyNy5q/cGc_dj0xNzA3ODk4/MDEwJndpZHRoPTM2/MA",
    categoryId: 2,
    stock: 18,
},
{
    name: "Hermès Terre d'Hermès EDT",
    price: 340000,
    description: "Una narrativa simbólica en torno a la materia y su transformación. Un perfume mineral y amaderado que une los elementos de la tierra con notas de pomelo, cedro y sílex.",
    image: "https://imgs.search.brave.com/-gQ_CZWaBPtibjwsPboe75B5LM8pypOudw9XMo9HRmk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2VwaG9yYS5jb20u/YnIvZHcvaW1hZ2Uv/djIvQkZKQ19QUkQv/b24vZGVtYW5kd2Fy/ZS5zdGF0aWMvLS9T/aXRlcy1tYXN0ZXJD/YXRhbG9nX1NlcGhv/cmEvcHRfQlIvZHc1/YjBiZjE2Mi9pbWFn/ZXMvaGktcmVzLUJS/LzMzNDYxMzE0MDAw/MDNfMTUwMHB4Lmpw/Zz9zdz01NTYmc2g9/NjgwJnNtPWZpdA",
    categoryId: 2,
    stock: 11,
},
{
    name: "Prada Luna Rossa Carbon EDT",
    price: 280000,
    description: "Una fragancia fougère enérgica con un carácter metálico y vibrante. Combina lavanda, notas verdes de bergamota de Italia con un corazón mineral de pachulí.",
    image: "https://imgs.search.brave.com/RzgehFfGTMIyb38yTXiVB5HUvuaacXaVVZcPdqO4MlU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWZh/ZHV0eWZyZWUuY29t/L2Nkbi9zaG9wL2Zp/bGVzL3ByYWRhLWVh/dS1kZS10b2lsZXR0/ZS0xMDBtbC1wcmFk/YS1sdW5hLXJvc3Nh/LWNhcmJvbi1lZHQt/MzU2MDM1NzE0NzQ1/MjUucG5nP3Y9MTc1/MDE5NTQ5MyZ3aWR0/aD0xMDgw",
    categoryId: 2,
    stock: 13,
},
{
    name: "Jean Paul Gaultier Le Male Le Parfum",
    price: 335000,
    description: "Una estela elegante e intensa con el sello de un oficial. Notas orientales amaderadas que combinan cardamomo en la salida con lavanda en el corazón y una estela adictiva de vainilla.",
    image: "https://imgs.search.brave.com/KS5AwHDie9XDkH_nmhjm-ZbXF63wdSTvAT__FzF0zUg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWNzLmF2ZW5pZGEu/Y29tL2F2ZW5pZGEv/cHJvZHVjdHMvcGhv/dG9zL2JlLzg5OC83/NzczYWQ5ODk4MGUw/ODQwZmY0N2JlNTUy/OTAwOWU0YV9sLg",
    categoryId: 2,
    stock: 16,
},
{
    name: "Carolina Herrera Bad Boy EDT",
    price: 295000,
    description: "Una expresión aromática de la dualidad masculina. Una fragancia audaz pero sofisticada que combina notas de pimienta negra y blanca con la bergamota verde y la madera de cedro.",
    image: "https://imgs.search.brave.com/_hb5uN7UzVm5pDMT-b2BUJ11ap9jXuXZtaYEFBpfb1A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzg5OTkwMi1NTEE0/OTkyOTY1ODIwOV8w/NTIwMjItRS53ZWJw",
    categoryId: 2,
    stock: 10,
}
];

export const preLoadProducts = async () => {
  const products = await ProductRepository.find();
  if (!products.length)
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Product)
      .values(productsToPreLoad)
      .execute();
  console.log("Products preloaded");
};
