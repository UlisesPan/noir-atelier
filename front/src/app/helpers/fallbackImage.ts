const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="100%" height="100%" fill="#f3f4f6" />
      <text x="50%" y="50%" font-size="32" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
        Sin imagen
      </text>
    </svg>
  `);

export default fallbackImage;