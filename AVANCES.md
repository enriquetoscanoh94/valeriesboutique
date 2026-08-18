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
- `api/_shipping.js` cotiza USPS vía Shippo con **pesos estimados redondeados hacia arriba** (para no perder dinero); `api/shipping.js` es el endpoint; `api/checkout.js` suma el envío al pago de Stripe. En el checkout hay botón **"Calcular envío (USPS)"**.
- **Probado en producción:** devuelve tarifas reales que cambian por peso y destino (ej. $5.83, $10.01, $14.31 según el caso).
- **Token de PRUEBA de Shippo** en Vercel (`SHIPPO_API_KEY`). Para tarifas de producción, pedir el **Live Token** en Shippo (Settings > API > "Request Live Token", ~1 día hábil) y cambiarlo en Vercel.
- **Regla de oro:** al enviar, la dueña **pesa el paquete real** y compra la etiqueta con ese peso.
- **Pendiente (opcional):** botón "Comprar e imprimir etiqueta" en el panel de Compras.

---

## 🔜 Lo que sigue

1. **Terminar envíos** con Shippo (tarifas reales USPS, sin tarjeta).
2. **Activar cobro real** de Stripe (cuenta del negocio + banco + llaves reales).
3. **Vista "Compras" en el panel admin** (activar webhook → pedidos en Firestore) + botón imprimir etiqueta.
4. **Precio con impuestos por producto** (falta confirmar la tasa, Salinas CA ~9.25%).
5. **Mejoras:** editar los 52 productos base desde el panel, historial de pedidos del cliente, buscador real.

---

## 🛠️ Notas para desarrollo

- Correr en local: `npm run dev` → `http://localhost:5173/` (ya en la raíz, sin subcarpeta).
- Compilar: `npm run build`
- Variables de entorno: `.env` local (protegido en git) + panel de Vercel. Plantilla en `.env.example`.
- Deploy: automático al hacer `git push` a `main` (Vercel).
- Rutas API (Vercel, carpeta `/api`): `checkout.js`, `stripe-webhook.js` (dormido), `shipping.js`, más helpers `_firebaseAdmin.js` y `_shipping.js`.
