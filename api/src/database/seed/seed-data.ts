import { Gender, ScentNotes } from '../../modules/products/product.entity';

/** Las ilustraciones viven en el front (public/products), generadas por front/scripts/generate-bottles.mjs. */
const img = (slug: string) => `/products/${slug}.svg`;

export const categories = [
  { name: 'Amaderadas', slug: 'amaderadas', description: 'Cedro, sándalo y vetiver: profundidad y carácter.' },
  { name: 'Cítricas', slug: 'citricas', description: 'Bergamota, limón y neroli para días luminosos.' },
  { name: 'Orientales', slug: 'orientales', description: 'Ámbar, vainilla y especias cálidas y envolventes.' },
  { name: 'Florales', slug: 'florales', description: 'Rosa, jazmín e iris en composiciones elegantes.' },
  { name: 'Acuáticas', slug: 'acuaticas', description: 'Frescura marina y mineral para todo el año.' },
];

interface SeedProduct {
  name: string;
  category: string;
  description: string;
  notes: ScentNotes;
  price: number;
  compareAtPrice?: number;
  stock: number;
  volumeMl: number;
  gender: Gender;
  image: string;
  featured?: boolean;
}

export const products: SeedProduct[] = [
  {
    name: 'Obsidiana Nocturna',
    category: 'amaderadas',
    description:
      'Nuestra firma. Un amaderado oscuro y magnético que abre con pimienta negra y se asienta sobre un fondo ahumado de cuero y oud. Pensado para la noche.',
    notes: { top: ['Pimienta negra', 'Cardamomo'], heart: ['Cuero', 'Iris'], base: ['Oud', 'Vetiver ahumado'] },
    price: 189000,
    stock: 14,
    volumeMl: 100,
    gender: Gender.MASCULINE,
    image: img('obsidiana-nocturna'),
    featured: true,
  },
  {
    name: 'Cedro de Patagonia',
    category: 'amaderadas',
    description:
      'Inspirado en los bosques del sur. Cedro seco y resinas frescas con un toque verde de ciprés. Elegante y sereno para el uso diario.',
    notes: { top: ['Ciprés', 'Bergamota'], heart: ['Cedro', 'Salvia'], base: ['Musgo de roble', 'Ámbar gris'] },
    price: 142000,
    stock: 22,
    volumeMl: 100,
    gender: Gender.UNISEX,
    image: img('cedro-de-patagonia'),
  },
  {
    name: 'Sándalo Imperial',
    category: 'amaderadas',
    description:
      'Cremoso, lácteo y profundamente cálido. El sándalo de Mysore se encuentra con la haba tonka en una estela que perdura todo el día.',
    notes: { top: ['Higo', 'Pimienta rosa'], heart: ['Sándalo', 'Leche de coco'], base: ['Haba tonka', 'Almizcle'] },
    price: 215000,
    compareAtPrice: 245000,
    stock: 6,
    volumeMl: 75,
    gender: Gender.UNISEX,
    image: img('sandalo-imperial'),
    featured: true,
  },
  {
    name: 'Vetiver Absoluto',
    category: 'amaderadas',
    description:
      'Un vetiver terroso y elegante, con matices de pomelo y un fondo mineral. Un clásico moderno para quien busca sobriedad.',
    notes: { top: ['Pomelo', 'Jengibre'], heart: ['Vetiver de Haití', 'Geranio'], base: ['Pachulí', 'Sílex'] },
    price: 158000,
    stock: 3,
    volumeMl: 100,
    gender: Gender.MASCULINE,
    image: img('vetiver-absoluto'),
  },
  {
    name: 'Bergamota del Sur',
    category: 'citricas',
    description:
      'Chispeante y luminosa. Bergamota de Calabria, limón siciliano y un corazón aromático de romero. Ideal para el verano.',
    notes: { top: ['Bergamota', 'Limón'], heart: ['Romero', 'Neroli'], base: ['Almizcle blanco', 'Cedro'] },
    price: 98000,
    stock: 30,
    volumeMl: 100,
    gender: Gender.UNISEX,
    image: img('bergamota-del-sur'),
  },
  {
    name: 'Neroli Solar',
    category: 'citricas',
    description:
      'La flor del naranjo amargo bajo el sol del mediodía. Fresco, limpio y sutilmente floral, con un fondo de almizcle suave.',
    notes: { top: ['Mandarina', 'Petitgrain'], heart: ['Neroli', 'Azahar'], base: ['Almizcle', 'Ámbar claro'] },
    price: 112000,
    compareAtPrice: 128000,
    stock: 18,
    volumeMl: 75,
    gender: Gender.FEMININE,
    image: img('neroli-solar'),
  },
  {
    name: 'Yuzu & Té Verde',
    category: 'citricas',
    description:
      'Una composición minimalista de inspiración japonesa: yuzu vibrante, té matcha y madera de hinoki. Frescura con calma.',
    notes: { top: ['Yuzu', 'Lima'], heart: ['Té verde', 'Jazmín'], base: ['Hinoki', 'Almizcle'] },
    price: 104000,
    stock: 25,
    volumeMl: 100,
    gender: Gender.UNISEX,
    image: img('yuzu-te-verde'),
  },
  {
    name: 'Ámbar Dorado',
    category: 'orientales',
    description:
      'Cálido y envolvente como una tarde de otoño. Ámbar resinoso, benjuí y vainilla de Madagascar con un toque de canela.',
    notes: { top: ['Canela', 'Naranja amarga'], heart: ['Ámbar', 'Benjuí'], base: ['Vainilla', 'Labdanum'] },
    price: 176000,
    stock: 12,
    volumeMl: 100,
    gender: Gender.UNISEX,
    image: img('ambar-dorado'),
    featured: true,
  },
  {
    name: 'Vainilla Negra',
    category: 'orientales',
    description:
      'Una vainilla adulta y nada empalagosa: ahumada, con ron especiado y tabaco dulce. Sensual y adictiva.',
    notes: { top: ['Ron', 'Pimienta rosa'], heart: ['Tabaco', 'Vainilla negra'], base: ['Cacao', 'Haba tonka'] },
    price: 198000,
    stock: 9,
    volumeMl: 75,
    gender: Gender.FEMININE,
    image: img('vainilla-negra'),
  },
  {
    name: 'Especias de Marrakech',
    category: 'orientales',
    description:
      'Un viaje por los mercados del norte de África: azafrán, cardamomo y rosa de Damasco sobre un fondo de oud suave.',
    notes: { top: ['Azafrán', 'Cardamomo'], heart: ['Rosa de Damasco', 'Clavo'], base: ['Oud', 'Pachulí'] },
    price: 229000,
    stock: 4,
    volumeMl: 50,
    gender: Gender.UNISEX,
    image: img('especias-de-marrakech'),
  },
  {
    name: 'Rosa Velada',
    category: 'florales',
    description:
      'Una rosa contemporánea, aterciopelada y ligeramente empolvada. Frambuesa y pimienta rosa le dan un brillo inesperado.',
    notes: { top: ['Frambuesa', 'Pimienta rosa'], heart: ['Rosa turca', 'Peonía'], base: ['Pachulí', 'Almizcle'] },
    price: 165000,
    stock: 16,
    volumeMl: 100,
    gender: Gender.FEMININE,
    image: img('rosa-velada'),
    featured: true,
  },
  {
    name: 'Jazmín de Medianoche',
    category: 'florales',
    description:
      'Jazmín sambac en plena floración nocturna, con tuberosa y un fondo cremoso de sándalo. Opulento y luminoso.',
    notes: { top: ['Mandarina verde', 'Ylang-ylang'], heart: ['Jazmín sambac', 'Tuberosa'], base: ['Sándalo', 'Vainilla'] },
    price: 172000,
    stock: 11,
    volumeMl: 75,
    gender: Gender.FEMININE,
    image: img('jazmin-de-medianoche'),
  },
  {
    name: 'Iris Poudré',
    category: 'florales',
    description:
      'Iris de Florencia y violeta sobre un fondo de cuero suave. Sofisticado, empolvado y con un aire retro.',
    notes: { top: ['Violeta', 'Bergamota'], heart: ['Iris', 'Heliotropo'], base: ['Cuero suave', 'Almizcle'] },
    price: 188000,
    stock: 0,
    volumeMl: 50,
    gender: Gender.UNISEX,
    image: img('iris-poudre'),
  },
  {
    name: 'Brisa Atlántica',
    category: 'acuaticas',
    description:
      'Sal marina, algas y madera a la deriva. La sensación de una caminata por la costa en una mañana de invierno.',
    notes: { top: ['Sal marina', 'Limón'], heart: ['Algas', 'Lavanda'], base: ['Madera flotante', 'Ámbar gris'] },
    price: 118000,
    stock: 20,
    volumeMl: 100,
    gender: Gender.MASCULINE,
    image: img('brisa-atlantica'),
  },
  {
    name: 'Agua de Glaciar',
    category: 'acuaticas',
    description:
      'Frío, mineral y cristalino. Menta, notas ozónicas y un fondo de cedro blanco inspirado en los hielos patagónicos.',
    notes: { top: ['Menta', 'Notas ozónicas'], heart: ['Salvia', 'Lirio de agua'], base: ['Cedro blanco', 'Almizcle'] },
    price: 109000,
    compareAtPrice: 125000,
    stock: 27,
    volumeMl: 100,
    gender: Gender.UNISEX,
    image: img('agua-de-glaciar'),
  },
  {
    name: 'Laguna Azul',
    category: 'acuaticas',
    description:
      'Una fragancia acuática con corazón floral: loto, pepino y un fondo de almizcles limpios. Fresca y femenina.',
    notes: { top: ['Pepino', 'Pera'], heart: ['Flor de loto', 'Muguet'], base: ['Almizcle blanco', 'Madera de cachemira'] },
    price: 96000,
    stock: 19,
    volumeMl: 75,
    gender: Gender.FEMININE,
    image: img('laguna-azul'),
  },
];
