// Datos del negocio en un solo lugar. Si cambia un dato (telefono, direccion,
// redes...), se cambia aqui y se refleja en todo el sitio y en los envios.
// Modulo de datos puro: lo usan tanto el front como las rutas de /api.
export const business = {
  name: "Valerie's Boutique",

  // Telefono
  phone: "8319980610", // solo numeros (para tel: y APIs de envio)
  phoneDisplay: "(831) 998-0610", // como se muestra
  phoneLink: "tel:+18319980610", // enlace para llamar
  whatsapp: "18319980610", // para wa.me/...

  // Direccion
  street: "19 W Market St",
  city: "Salinas",
  state: "CA",
  zip: "93901",
  addressLine: "19 W Market St, Salinas, CA 93901",
  maps: "https://maps.google.com/?q=19+W+Market+St+Salinas+CA+93901",

  // Redes sociales
  instagram: "https://www.instagram.com/valeries._boutique_/",
  tiktok: "https://www.tiktok.com/@valeries..boutique",
}
