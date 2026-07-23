# Valerie's Boutique — Plan del proyecto

Tienda en línea (e-commerce) para boutique de eventos en Salinas, CA.

---

## 1. Datos del negocio

| Dato | Valor |
|---|---|
| Nombre | Valerie's Boutique |
| Dirección | 19 W Market St, Salinas, CA 93901 |
| Teléfono | (831) 998-0610 |
| WhatsApp | (831) 998-0610 (mismo número) |
| Correo | *pendiente* (se crea con el dominio) |
| Horario | Lun – Vie · 12pm – 7pm · Sáb · 12pm – 5pm · Domingo cerrado |
| Instagram | @valeries._boutique_ |
| TikTok | @valeries..boutique |
| Giro | XV, novias, fiesta, niña, bautizo, ramos, accesorios, brindis |

**Logo:** `valeries_logo_negro.png` y `valeries_logo_transparente.png` (retocados, 2358×2286).

**Colores de marca:** rosa `#d98ba9` · rose gold `#b76e79` · negro `#141414` · crema/blanco `#fdfbfa`.

---

## 2. Decisiones clave

- **Modelo:** tienda única (solo el admin sube productos; el cliente compra).
- **Todo producto lleva foto + descripción + precio.** La página vende sola, sin depender de contestar mensajes.
- **Solo venta** (sin renta).
- **Bilingüe** español / inglés (botón ES/EN).
- **Pago:** Stripe Checkout + **pagos a plazos** (Afterpay / Klarna / Affirm, incluidos en Stripe).
- **Entrega:** envíos a domicilio en todo Estados Unidos + recoger en boutique.
- **Soporte:** FAQ + botón flotante de WhatsApp (no chat en vivo).
- **Login:** con Google.
- **Roles:** admin (Enrique/Valerie) y cliente.
- **Visitas:** no se requiere cita para entrar y mirar productos.
- **Pruebas de vestidos:** solo con cita; cargo de $50, descontable al comprar u ordenar un vestido y no reembolsable si no hay compra.

---

## 3. Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Lenguaje | JavaScript (TS más adelante) |
| Estilos | Tailwind CSS v4 |
| Ruteo | React Router |
| Estado carrito | useState / Zustand |
| Auth | Firebase Auth (Google) |
| Base de datos | Firestore |
| Fotos | Firebase Storage |
| Backend seguro | Firebase Cloud Functions (llave Stripe + validar precios) |
| Pagos | Stripe Checkout (+ BNPL) |
| Deploy | Firebase Hosting |

**Seguridad (reglas de oro):**
1. La llave secreta de Stripe vive en Cloud Functions, nunca en el frontend.
2. El precio se valida en el servidor (no se confía en el navegador).
3. El rol admin se verifica en las reglas de Firestore (no ocultando botones).
4. Reglas Firestore: productos/categorías = todos leen, solo admin escribe; pedidos = cada quien ve los suyos, admin ve todos.
5. Storage: solo admin sube fotos.

---

## 4. Modelo de datos (Firestore)

### `productos`
```
nombre_es, nombre_en, descripcion_es, descripcion_en (obligatorios)
precio (obligatorio)
categoria (obligatorio)
fotos [] (al menos 1)
material, silueta, escote, detalles (atributos opcionales)
maneja_tallas (bool)
tallas { "4": 3, "6": 5, ... }  (si maneja_tallas)
stock (número)                  (si NO maneja tallas)
colores [ {nombre, hex} ]
destacado (bool), activo (bool), fecha_creado
```

### `categorias`
```
nombre_es, nombre_en, slug, orden, imagen, padre
```

### `usuarios`
```
uid, nombre, email, rol ("cliente"|"admin"), telefono, fecha_creado
```

### `pedidos`
```
usuario_id
productos [ {producto_id, nombre, precio, talla, color, cantidad, foto} ]
subtotal, envio, total
metodo_entrega ("recoger"|"envio"), direccion_envio
datos_cliente { nombre, telefono, email, fecha_evento, tipo_evento, comentarios }
estado ("pagado"→"preparando"→"listo/enviado"→"entregado")
tipo_pago ("completo"|"plazos"), stripe_id, fecha
```

---

## 5. Mapa de páginas

**Públicas:** `/` (Home) · `/categoria/:slug` (lista + filtros) · `/producto/:id` · `/carrito` · `/checkout` · `/confirmacion/:id` · `/promociones` · `/nosotros` · `/contacto` · `/faq`

**Cliente (login):** `/mis-pedidos` · `/pedido/:id` · `/wishlist` (v2)

**Admin:** `/admin` · `/admin/productos` · `/admin/productos/nuevo` · `/admin/productos/:id` · `/admin/pedidos` · `/admin/pedidos/:id` · `/admin/categorias`

**Fijos:** header (logo, menú, buscador, carrito, ES/EN, login) · footer (dirección, horario, redes, pago seguro) · botón WhatsApp flotante.

---

## 6. Categorías del menú

Vestidos (XV, fiesta, novia, niña) · Bautizo y niños (ropones, trajes) · Ramos (XV, novia, damas, mini) · Accesorios (coronas, tiaras, lazos, cojines, velas, biblias, rosarios, arras, velas de unión, velos, cojines de anillos) · Álbumes y cajas (álbumes de fotos, cajas, cajas de dinero, libros de firmas) · Corsages · Brindis (copas, jarras, cuchillo para pastel) · Osos/peluches.

---

## 7. Estado del proyecto

- [x] Investigación de competencia (5 boutiques de California con carrito)
- [x] Logo retocado (negro + transparente)
- [x] Proyecto React + Vite + Tailwind creado
- [x] **Home construido** (bilingüe, navegación móvil, 6 productos IA de muestra, WhatsApp, footer)
- [x] Página de categoría (lista + ordenamiento)
- [x] Página de producto (galería + tallas + colores)
- [x] Carrito local persistente
- [ ] Checkout
- [ ] Firebase (Auth Google + Firestore + Storage)
- [ ] Panel admin (subir productos)
- [ ] Stripe (Cloud Functions + pagos a plazos)
- [ ] Pedidos
- [ ] Envío UPS (al final)
- [ ] Deploy (Firebase Hosting)

## 8. Pendiente de la clienta

- Correo con dominio · Política de devoluciones · ¿Apartados/anticipos? · ¿Ajustes/alteraciones? · Guía de tallas · Reglas completas de tienda · Texto de "Nosotros" · Fotos y precios reales de los productos · método y tarifas de envío.

---

> ⚠️ Las 6 imágenes actuales son generadas con IA (muestra) y los precios son de ejemplo. Se reemplazan por los productos y precios reales de Valerie's a través del panel de admin.
