// Genera las ilustraciones SVG de los frascos de Noir Atelier en /public/products.
// Uso: node scripts/generate-bottles.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'products');

/** Fondos por familia olfativa: [claro, oscuro]. */
const FAMILIES = {
  amaderadas: ['#E9E1D6', '#C9B9A4'],
  citricas: ['#F4EEDB', '#E3D3A4'],
  orientales: ['#EEDFD0', '#C99A73'],
  florales: ['#F3E4E1', '#D9B3AE'],
  acuaticas: ['#E3EAEC', '#AFC2C8'],
};

const PRODUCTS = [
  { slug: 'obsidiana-nocturna', name: 'Obsidiana', sub: 'Nocturna', family: 'amaderadas', shape: 'square', cap: 'cube', liquid: ['#2B2622', '#0E0C0B'], capColor: 'gold', dark: true },
  { slug: 'cedro-de-patagonia', name: 'Cedro', sub: 'de Patagonia', family: 'amaderadas', shape: 'tall', cap: 'cylinder', liquid: ['#B98A55', '#7A5631'], capColor: 'wood' },
  { slug: 'sandalo-imperial', name: 'Sándalo', sub: 'Imperial', family: 'amaderadas', shape: 'round', cap: 'sphere', liquid: ['#E2C08F', '#B78B52'], capColor: 'gold' },
  { slug: 'vetiver-absoluto', name: 'Vetiver', sub: 'Absoluto', family: 'amaderadas', shape: 'flask', cap: 'cube', liquid: ['#7F8461', '#4E5238'], capColor: 'black' },
  { slug: 'bergamota-del-sur', name: 'Bergamota', sub: 'del Sur', family: 'citricas', shape: 'square', cap: 'cylinder', liquid: ['#F2D77A', '#D9AE3B'], capColor: 'gold' },
  { slug: 'neroli-solar', name: 'Neroli', sub: 'Solar', family: 'citricas', shape: 'arch', cap: 'sphere', liquid: ['#F6C98A', '#E59A52'], capColor: 'ivory' },
  { slug: 'yuzu-te-verde', name: 'Yuzu', sub: '& Té Verde', family: 'citricas', shape: 'tall', cap: 'stone', liquid: ['#D6DE9A', '#A3B25A'], capColor: 'ivory' },
  { slug: 'ambar-dorado', name: 'Ámbar', sub: 'Dorado', family: 'orientales', shape: 'round', cap: 'cube', liquid: ['#E59A3C', '#A8561C'], capColor: 'gold' },
  { slug: 'vainilla-negra', name: 'Vainilla', sub: 'Negra', family: 'orientales', shape: 'flask', cap: 'sphere', liquid: ['#5A3A2A', '#24150F'], capColor: 'gold', dark: true },
  { slug: 'especias-de-marrakech', name: 'Especias', sub: 'de Marrakech', family: 'orientales', shape: 'arch', cap: 'cylinder', liquid: ['#B5452B', '#6E1F14'], capColor: 'gold', dark: true },
  { slug: 'rosa-velada', name: 'Rosa', sub: 'Velada', family: 'florales', shape: 'square', cap: 'sphere', liquid: ['#EDB3B8', '#C9727E'], capColor: 'ivory' },
  { slug: 'jazmin-de-medianoche', name: 'Jazmín', sub: 'de Medianoche', family: 'florales', shape: 'tall', cap: 'cube', liquid: ['#5B4A7A', '#2C2142'], capColor: 'gold', dark: true },
  { slug: 'iris-poudre', name: 'Iris', sub: 'Poudré', family: 'florales', shape: 'round', cap: 'stone', liquid: ['#CFC3E0', '#9E8DBD'], capColor: 'ivory' },
  { slug: 'brisa-atlantica', name: 'Brisa', sub: 'Atlántica', family: 'acuaticas', shape: 'flask', cap: 'cylinder', liquid: ['#6E9DB4', '#2F5F78'], capColor: 'black' },
  { slug: 'agua-de-glaciar', name: 'Agua', sub: 'de Glaciar', family: 'acuaticas', shape: 'square', cap: 'stone', liquid: ['#CFE6EC', '#8DBBC8'], capColor: 'ivory' },
  { slug: 'laguna-azul', name: 'Laguna', sub: 'Azul', family: 'acuaticas', shape: 'arch', cap: 'sphere', liquid: ['#8FC9C8', '#3F8C8C'], capColor: 'ivory' },
];

const CAP_FILLS = {
  gold: ['#E9D29B', '#B08D57', '#7A5D33'],
  black: ['#4A4643', '#1C1A19', '#000000'],
  ivory: ['#FFFFFF', '#E8E1D6', '#BDB3A5'],
  wood: ['#B88A5E', '#7E5634', '#4F3420'],
};

/** Silueta del cuerpo del frasco, centrada en `cx`, con la base en `baseY`. Devuelve path + caja. */
const bodyShape = (shape, cx, baseY) => {
  switch (shape) {
    case 'tall': {
      const w = 230, h = 440, x = cx - w / 2, y = baseY - h;
      return { d: rr(x, y, w, h, 26), x, y, w, h };
    }
    case 'round': {
      const r = 190, cy = baseY - r;
      return { d: `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`, x: cx - r, y: cy - r, w: 2 * r, h: 2 * r };
    }
    case 'flask': {
      const w = 320, h = 380, x = cx - w / 2, y = baseY - h, c = 70;
      return { d: `M${x + c},${y} H${x + w - c} L${x + w},${y + c} V${y + h - 18} Q${x + w},${y + h} ${x + w - 18},${y + h} H${x + 18} Q${x},${y + h} ${x},${y + h - 18} V${y + c} Z`, x, y, w, h };
    }
    case 'arch': {
      const w = 300, h = 400, x = cx - w / 2, y = baseY - h;
      return { d: `M${x},${y + w / 2} A${w / 2},${w / 2} 0 0,1 ${x + w},${y + w / 2} V${y + h - 20} Q${x + w},${y + h} ${x + w - 20},${y + h} H${x + 20} Q${x},${y + h} ${x},${y + h - 20} Z`, x, y, w, h };
    }
    default: {
      const w = 340, h = 360, x = cx - w / 2, y = baseY - h;
      return { d: rr(x, y, w, h, 22), x, y, w, h };
    }
  }
};

const rr = (x, y, w, h, r) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;

const capShape = (cap, cx, topY, id) => {
  const fill = `url(#cap-${id})`;
  switch (cap) {
    case 'sphere':
      return `<circle cx="${cx}" cy="${topY - 62}" r="62" fill="${fill}"/><ellipse cx="${cx - 20}" cy="${topY - 84}" rx="18" ry="11" fill="#fff" opacity=".45"/>`;
    case 'cylinder':
      return `<rect x="${cx - 46}" y="${topY - 150}" width="92" height="150" rx="10" fill="${fill}"/><rect x="${cx - 30}" y="${topY - 142}" width="10" height="132" rx="5" fill="#fff" opacity=".3"/>`;
    case 'stone':
      return `<path d="M${cx - 82},${topY - 8} C${cx - 96},${topY - 70} ${cx - 40},${topY - 118} ${cx + 10},${topY - 110} C${cx + 70},${topY - 104} ${cx + 98},${topY - 52} ${cx + 80},${topY - 8} Z" fill="${fill}"/>`;
    default:
      return `<rect x="${cx - 70}" y="${topY - 120}" width="140" height="120" rx="8" fill="${fill}"/><rect x="${cx - 56}" y="${topY - 110}" width="12" height="100" rx="6" fill="#fff" opacity=".3"/>`;
  }
};

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const bottle = (raw, cx, baseY, id) => {
  const p = { ...raw, name: escapeXml(raw.name), sub: escapeXml(raw.sub) };
  const b = bodyShape(p.shape, cx, baseY);
  const [capLight, capMid, capDark] = CAP_FILLS[p.capColor];
  const neckY = b.y - 34;
  const glass = 16;
  const liquidTop = b.y + b.h * 0.16;
  const labelW = Math.min(b.w - 70, 210);
  const labelH = 118;
  const labelY = b.y + b.h * 0.5 - labelH / 2 + (p.shape === 'arch' ? 30 : 10);
  const ink = '#1C1A19';

  return `
  <defs>
    <linearGradient id="liquid-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.liquid[0]}"/><stop offset="1" stop-color="${p.liquid[1]}"/>
    </linearGradient>
    <linearGradient id="cap-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${capLight}"/><stop offset=".55" stop-color="${capMid}"/><stop offset="1" stop-color="${capDark}"/>
    </linearGradient>
    <linearGradient id="shine-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="body-${id}"><path d="${b.d}"/></clipPath>
  </defs>
  <ellipse cx="${cx}" cy="${baseY + 6}" rx="${b.w * 0.62}" ry="22" fill="#000" opacity=".16" filter="url(#blur)"/>
  <rect x="${cx - 34}" y="${neckY}" width="68" height="40" rx="6" fill="url(#cap-${id})"/>
  ${capShape(p.cap, cx, neckY + 4, id)}
  <path d="${b.d}" fill="#fff" fill-opacity=".38" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
  <g clip-path="url(#body-${id})">
    <rect x="${b.x + glass}" y="${liquidTop}" width="${b.w - glass * 2}" height="${b.y + b.h - liquidTop - glass}" rx="10" fill="url(#liquid-${id})"/>
    <rect x="${b.x + glass}" y="${liquidTop}" width="${b.w - glass * 2}" height="6" fill="#fff" opacity=".35"/>
    <rect x="${b.x + 26}" y="${b.y}" width="34" height="${b.h}" fill="url(#shine-${id})"/>
    <rect x="${b.x + b.w - 52}" y="${b.y}" width="12" height="${b.h}" fill="url(#shine-${id})" opacity=".6"/>
    <rect x="${b.x}" y="${b.y + b.h - glass - 4}" width="${b.w}" height="${glass + 4}" fill="#fff" opacity=".25"/>
  </g>
  <g>
    <rect x="${cx - labelW / 2}" y="${labelY}" width="${labelW}" height="${labelH}" rx="3" fill="${p.dark ? '#141211' : '#FBF8F3'}" stroke="${capMid}" stroke-width="2"/>
    <rect x="${cx - labelW / 2 + 7}" y="${labelY + 7}" width="${labelW - 14}" height="${labelH - 14}" rx="2" fill="none" stroke="${capMid}" stroke-width="1" opacity=".7"/>
    <text x="${cx}" y="${labelY + 30}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="4" fill="${p.dark ? capLight : ink}" opacity=".8">NOIR ATELIER</text>
    <text x="${cx}" y="${labelY + 66}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="${p.dark ? '#F4EEE6' : ink}">${p.name}</text>
    <text x="${cx}" y="${labelY + 90}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="16" fill="${p.dark ? '#D8CFC4' : ink}" opacity=".85">${p.sub}</text>
  </g>`;
};

const svg = (p) => {
  const [bgLight, bgDark] = FAMILIES[p.family];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="${escapeXml(`${p.name} ${p.sub}`)}">
  <defs>
    <radialGradient id="bg" cx=".5" cy=".38" r=".85">
      <stop offset="0" stop-color="${bgLight}"/><stop offset="1" stop-color="${bgDark}"/>
    </radialGradient>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect y="820" width="800" height="180" fill="#000" opacity=".04"/>
  <g transform="translate(400 830) scale(1.22) translate(-400 -790)">${bottle(p, 400, 790, 'a')}</g>
</svg>
`;
};

mkdirSync(OUT, { recursive: true });
for (const p of PRODUCTS) writeFileSync(join(OUT, `${p.slug}.svg`), svg(p));

// Composición de tres frascos para el hero.
const pick = (slug) => PRODUCTS.find((p) => p.slug === slug);
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1000" role="img" aria-label="Colección Noir Atelier">
  <defs><filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter></defs>
  <g transform="translate(-40 60) scale(.82)">${bottle(pick('rosa-velada'), 400, 1000, 'h1')}</g>
  <g transform="translate(560 60) scale(.82)">${bottle(pick('ambar-dorado'), 400, 1000, 'h3')}</g>
  <g transform="translate(300 0)">${bottle(pick('obsidiana-nocturna'), 300, 930, 'h2')}</g>
</svg>
`;
writeFileSync(join(OUT, 'hero.svg'), hero);
console.log(`Generados ${PRODUCTS.length} frascos + hero en ${OUT}`);
