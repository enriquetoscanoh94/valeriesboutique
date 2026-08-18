# Avances — Valerie's Boutique

Registro del progreso del ecommerce. Última actualización: **18 de agosto de 2026**.

## 🌐 Sitio en vivo: **https://valeriesboutiques.com**

---

## 🎯 Meta del proyecto

Tienda en línea real de Valerie's Boutique (19 W Market St, Salinas, CA · tel. 831 998-0610) con:

- Login de clientes y panel de administración para la dueña.
- Catálogo que la dueña pueda editar sola (subir productos y fotos).
- Cobro con tarjeta y pagos a plazos (Stripe).
- Envío a todo Estados Unidos con **tarifa real de USPS** + recoger en tienda.

## 🧱 Arquitectura (actual)

- **Hosting:** **Vercel** (deploy automático en cada `git push` a `main`).
- **Frontend:** React + Vite + Tailwind v4 + React Router.
- **Backend seguro:** **rutas API en Vercel** (`/api/...`) para lo que necesita llaves secretas (Stripe, envíos).
- **Firebase:** Authentication (login), Firestore (base de datos), Storage (fotos).

---

## ✅ Fase 1 — Infraestructura Firebase (COMPLETA)

- Proyecto `valeries-boutique`, plan **Blaze** (alerta de gasto $5, $300 de crédito).
- **Authentication** (Google + correo/contraseña), **Firestore** y **Storage** activos.
- Reglas de seguridad de Firestore y Storage **publicadas**.

## ✅ Fase 2 — Login (COMPLETA)

- Página `/cuenta` con login/registro (Google + correo), detección de **Administradora**.
- La dueña entra con `valeriesboutiqueadmin@gmail.com` y ve su panel.

## ✅ Fase 3 — Productos en base de datos + panel admin (COMPLETA)

- `/admin`: la dueña agrega productos con foto (van a Firestore + Storage) y aparecen al instante.
- Los 52 productos de muestra siguen en el código (intactos); los nuevos se mezclan en vivo.

## ✅ Migración a Vercel (COMPLETA)

- Sitio movido de GitHub Pages a **Vercel**, en la cuenta de la clienta, conectado al GitHub del desarrollador.
- URL limpia en la raíz, llaves en variables de entorno, `vercel.json` con ruteo SPA + cabeceras de seguridad.

## ✅ Dominio propio (COMPLETO)

- **https://valeriesboutiques.com** comprado en **GoDaddy**, conectado a Vercel por DNS (A + CNAME), con **SSL**.
- Autorizado en Firebase para que el login funcione en el dominio nuevo.

## ✅ Fase 4 — Pagos con Stripe (FUNCIONA EN MODO PRUEBA)

- `api/checkout.js` crea la sesión de pago (precios verificados en el servidor); botón "Pagar" redirige a Stripe; página `/pago-exitoso`.
- **Probado de punta a punta:** el checkout abre la página de pago de Stripe de "valerie's boutique", con tarjeta + pagos a plazos (Affirm/Klarna).
- Se prueba con la tarjeta `4242 4242 4242 4242`.
- **Dormido para después:** `api/stripe-webhook.js` + `api/_firebaseAdmin.js` (guardar pedidos en Firestore).
- **Para cobro REAL:** activar la cuenta de Stripe (datos del negocio + banco) y cambiar a las llaves reales.

## ✅ Fase 5 — Envíos con tarifa real de USPS (FUNCIONA EN MODO PRUEBA)

- **Con Shippo** (se descartó EasyPost porque escondía la API key tras fondear el wallet).
- `api/_shipping.js` cotiza USPS vía Shippo; `api/shipping.js` es el endpoint; `api/checkout.js` suma el envío al pago de Stripe. En el checkout hay botón **"Calcular envío (USPS)"**.
- **Doble protección para no perder dinero:** los **pesos se redondean hacia arriba** + un **colchón fijo de $2** al cliente (`HANDLING_BUFFER_USD`, fácil de cambiar). Ej.: costo real $5.83 → cliente paga $8.
- **La dueña puede poner el peso real** de cada producto al agregarlo (campo "Peso aprox. en libras"); si lo deja vacío, se usa un estimado por tipo.
- **Probado en producción:** tarifas reales que cambian por peso y destino.
- **Token de PRUEBA de Shippo** en Vercel (`SHIPPO_API_KEY`). Para producción: pedir el **Live Token** (Settings > API, ~1 día hábil, ya solicitado) y cambiarlo en Vercel.

## ✅ Fase 6 — Pedidos + etiquetas en el panel admin (LISTO, modo prueba)

- **Webhook de Stripe ACTIVO:** cada pago se guarda como pedido en Firestore (dirección en piezas + peso). Usa **cuenta de servicio de Firebase** (`FIREBASE_SERVICE_ACCOUNT`) y el **secreto del webhook** (`STRIPE_WEBHOOK_SECRET`), ambos en Vercel.
- **Sección "Pedidos":** la dueña ve todas las ventas pagadas (cliente, dirección, productos, monto, estado).
- **Botón "Comprar e imprimir etiqueta":** compra la etiqueta USPS más barata (Shippo, ruta `api/buy-label`, solo admin), abre el **PDF** y guarda el **rastreo**; el pedido pasa a "Enviado". **Sin entrar a Shippo.**
- **Falta para etiquetas REALES:** el **Live Token de Shippo** + método de pago en Shippo para el franqueo. En prueba las etiquetas son de ensayo (gratis).

## ✅ Fase 7 — Panel reorganizado + detalles (LISTO)

- **Panel con pestañas** y encabezado fijo: **Resumen** (ventas del mes, pedidos por enviar, # productos) · **Productos** · **Pedidos**. Cada sección es una página independiente bajo un `AdminLayout` (la protección de admin vive en un solo lugar).
- **Colores propios:** al agregar un producto, si el color no está en la paleta, la dueña escribe el nombre y elige el tono.
- **Formulario solo en español** (se quitaron los campos de inglés innecesarios; guarda el mismo texto para ambos idiomas).
- **Detalles de UX:** aviso claro en rojo si falta elegir talla/color; el **Estado** del envío es una lista de los 50 estados de EE.UU.

## 🧹 Calidad de código

- **Datos del negocio centralizados** en `src/data/business.js` (tel, dirección, ZIP, redes): se cambia en un solo lugar y se refleja en todo el sitio y en las etiquetas.
- **Panel admin con carga diferida** (`React.lazy`): un cliente que solo compra no descarga el código del panel.
- Lint limpio, build sin errores.

---

## 🔜 Lo que sigue

1. **Activar cobro real** de Stripe (cuenta del negocio + banco + llaves reales).
2. **Live Token de Shippo** (solicitado, ~1 día) → cambiarlo en Vercel + método de pago en Shippo para etiquetas reales.
3. **Impuestos (tax) — PENDIENTE:** decidir entre **Stripe Tax** automático (correcto por dirección; requiere permiso de vendedor de California) o **tasa fija** (ej. 9.25%). En EE.UU. el impuesto se suma en el checkout, no por producto.
4. **Mejoras opcionales:** editar los 52 productos base desde el panel, historial de pedidos para el cliente, buscador real.

---

## 🛠️ Notas para desarrollo

- Correr en local: `npm run dev` → `http://localhost:5173/` (en la raíz, sin subcarpeta).
- Compilar: `npm run build` · Revisar código: `npm run lint`
- Variables de entorno: `.env` local (protegido en git) + panel de Vercel. Plantilla en `.env.example`.
- Deploy: automático al hacer `git push` a `main` (Vercel).
- Rutas API (carpeta `/api`): `checkout.js`, `shipping.js`, `buy-label.js`, `stripe-webhook.js` + helpers `_firebaseAdmin.js` y `_shipping.js`.
- Datos del negocio: `src/data/business.js`. Estados de EE.UU.: `src/data/usStates.js`. Catálogo base: `src/data/catalog.js`.
