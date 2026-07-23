export const categories = [
  { slug: "xv", name: { es: "Vestidos de XV", en: "Quinceañera" }, description: { es: "Vestidos protagonistas para una noche inolvidable.", en: "Statement gowns for an unforgettable night." } },
  { slug: "novias", name: { es: "Novias", en: "Bridal" }, description: { es: "Siluetas románticas para el gran día.", en: "Romantic silhouettes for the big day." } },
  { slug: "nina", name: { es: "Niña", en: "Girls" }, description: { es: "Vestidos delicados para sus momentos especiales.", en: "Delicate dresses for her special moments." } },
  { slug: "ramos", name: { es: "Ramos", en: "Bouquets" }, description: { es: "Flores coordinadas con tu celebración.", en: "Flowers coordinated with your celebration." } },
  { slug: "accesorios", name: { es: "Accesorios", en: "Accessories" }, description: { es: "Los detalles que completan el look.", en: "The details that complete the look." } },
]

export const products = [
  {
    id: "vestido-xv-princesa",
    category: "xv",
    name: { es: "Vestido de XV Princesa", en: "Princess Quince Gown" },
    description: {
      es: "Corte princesa con pedrería, corsé estructurado y tul en capas. Una silueta luminosa creada para hacer una entrada inolvidable.",
      en: "Princess cut with beading, a structured corset and layered tulle. A luminous silhouette made for an unforgettable entrance.",
    },
    price: 499,
    images: ["productos/vestido-xv.webp", "productos/vestido-xv.jpg"],
    sizes: ["4", "6", "8", "10", "12", "14"],
    colors: [{ name: { es: "Rosa", en: "Pink" }, value: "rosa", hex: "#d98ba9" }, { name: { es: "Vino", en: "Wine" }, value: "vino", hex: "#722f45" }],
    featured: true,
    badge: { es: "Favorito de XV", en: "Quince favorite" },
  },
  {
    id: "vestido-novia-encaje",
    category: "novias",
    name: { es: "Vestido de Novia Encaje", en: "Lace Wedding Gown" },
    description: {
      es: "Encaje floral, escote romántico y cola larga desmontable. Elegancia clásica con una caída ligera y favorecedora.",
      en: "Floral lace, romantic neckline and detachable long train. Classic elegance with a light, flattering drape.",
    },
    price: 699,
    images: ["productos/vestido-novia.webp", "productos/vestido-novia.jpg"],
    sizes: ["4", "6", "8", "10", "12"],
    colors: [{ name: { es: "Marfil", en: "Ivory" }, value: "marfil", hex: "#f7f2e8" }, { name: { es: "Blanco", en: "White" }, value: "blanco", hex: "#ffffff" }],
    featured: true,
    badge: { es: "Colección novia", en: "Bridal collection" },
  },
  {
    id: "vestido-nina-rosa",
    category: "nina",
    name: { es: "Vestido de Niña Rosa", en: "Pink Girl Dress" },
    description: {
      es: "Vestido de fiesta en tul rosa con falda de volumen suave y detalles florales.",
      en: "Pink tulle party dress with a softly voluminous skirt and floral details.",
    },
    price: 89,
    images: ["productos/vestido-nina.webp", "productos/vestido-nina.jpg"],
    sizes: ["2", "4", "6", "8", "10"],
    colors: [{ name: { es: "Rosa", en: "Pink" }, value: "rosa", hex: "#e7a6bb" }],
    featured: false,
  },
  {
    id: "ramo-novia-romantico",
    category: "ramos",
    name: { es: "Ramo de Novia Romántico", en: "Romantic Bridal Bouquet" },
    description: {
      es: "Composición floral en tonos blush y crema, terminada con cinta satinada.",
      en: "Floral composition in blush and cream tones, finished with a satin ribbon.",
    },
    price: 75,
    images: ["productos/ramo.webp", "productos/ramo.jpg"],
    sizes: [],
    colors: [{ name: { es: "Blush", en: "Blush" }, value: "blush", hex: "#e8b7bd" }],
    featured: false,
  },
  {
    id: "corona-rose-gold",
    category: "accesorios",
    name: { es: "Corona Rose Gold", en: "Rose Gold Crown" },
    description: {
      es: "Corona de acabado rose gold con cristales luminosos y ajuste cómodo.",
      en: "Rose gold finish crown with luminous crystals and a comfortable fit.",
    },
    price: 45,
    images: ["productos/corona.webp", "productos/corona.jpg"],
    sizes: [],
    colors: [{ name: { es: "Rose gold", en: "Rose gold" }, value: "rose-gold", hex: "#b76e79" }],
    featured: false,
  },
  {
    id: "oso-peluche-xv",
    category: "accesorios",
    name: { es: "Oso de Peluche XV", en: "Quince Teddy Bear" },
    description: {
      es: "Oso con vestido de XV coordinado, perfecto para regalo o decoración.",
      en: "Teddy bear with a coordinated quince dress, perfect as a gift or decoration.",
    },
    price: 60,
    images: ["productos/oso.webp", "productos/oso.jpg"],
    sizes: [],
    colors: [{ name: { es: "Rosa", en: "Pink" }, value: "rosa", hex: "#d98ba9" }],
    featured: false,
  },
]

export const getCategory = (slug) => categories.find((category) => category.slug === slug)
export const getProduct = (id) => products.find((product) => product.id === id)
export const getProductsByCategory = (slug) => products.filter((product) => product.category === slug)
