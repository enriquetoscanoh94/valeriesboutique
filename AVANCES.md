# Avances — Valerie's Boutique

Registro del progreso del ecommerce. Última actualización: **17 de agosto de 2026**.

---

## 🎯 Meta del proyecto

Tienda en línea real de Valerie's Boutique (19 W Market St, Salinas, CA · tel. 831 998-0610) con:

- Login de clientes y panel de administración para la dueña.
- Catálogo que la dueña pueda editar sola (subir productos y fotos).
- Cobro con tarjeta y pagos a plazos (Stripe).
- Envío a todo Estados Unidos + recoger en tienda.

## 🧱 Arquitectura (decisión técnica)

El sitio vive en **GitHub Pages** (hosting estático: solo sirve archivos, no corre código de servidor).
Por eso el "cerebro" de fondo se apoya en **Firebase**:

- **Authentication** → login (Google + correo/contraseña).
- **Firestore** → base de datos (productos, pedidos, usuarios).
- **Storage** → fotos de los productos.
- **Cloud Functions** → mini-servidor seguro para cobrar con **Stripe** (la llave secreta nunca puede ir en el navegador).

Stack del sitio: **React + Vite + Tailwind v4 + React Router**.

---

## ✅ Fase 1 — Infraestructura Firebase (COMPLETA)

| Elemento | Estado |
|---|---|
| Proyecto Firebase `valeries-boutique` | ✅ Creado |
| Plan **Blaze** (pago por uso) con alerta de gasto de $5 y $300 de crédito gratis | ✅ Activo |
| App web registrada + claves conectadas en `src/firebase.js` | ✅ Conectado |
| **Authentication**: Google + Correo/contraseña | ✅ Habilitado |
| **Firestore** (base de datos, región nam5/EE. UU.) | ✅ Creado |
| **Storage** (bucket de fotos, us-east1) | ✅ Creado |

> El plan Blaze pide tarjeta pero tiene una capa gratis amplia; para una boutique el gasto normalmente es $0. Se puede volver al plan gratis o cambiar la tarjeta cuando se quiera.

## ✅ Fase 2 — Login (COMPLETA)

| Elemento | Estado |
|---|---|
| `src/context/AuthContext.jsx` (login Google + correo, registro, cerrar sesión, detección de admin) | ✅ |
| Página de cuenta `src/pages/AccountPage.jsx` en la ruta `/cuenta` | ✅ |
| Ícono de "Cuenta" en el header (escritorio) y en el menú móvil | ✅ |
| Textos del login en español e inglés | ✅ |
| **Reglas de seguridad de Firestore** publicadas | ✅ |
| Reglas de seguridad de Storage (`storage.rules`) escritas | 🟡 Pendiente de publicar (ver nota) |

**Cómo funciona el login:**
- Cualquiera puede crear una cuenta con Google o con correo/contraseña.
- La dueña entra con `valeriesboutiqueadmin@gmail.com` y el sistema la reconoce como **Administradora**.

**Reglas de Firestore publicadas:**
- **Productos:** los ve cualquiera; solo la admin los crea/edita/borra.
- **Pedidos:** los crea quien inició sesión; solo la admin los lee.
- **Perfiles:** cada usuario ve/edita únicamente el suyo.

## ✅ Fase 3 — Productos en la base de datos + panel admin (COMPLETA)

| Elemento | Estado |
|---|---|
| `src/context/ProductsContext.jsx`: lee productos de Firestore **en vivo** y los **mezcla** con el catálogo base | ✅ |
| Todas las páginas (inicio, categoría, producto, carrito, checkout) leen desde ese contexto | ✅ |
| Panel de administración en la ruta `/admin` (solo la dueña puede entrar) | ✅ |
| Formulario "Agregar producto": nombre, categoría, subcategoría, precio, tallas, colores, descripción, **foto** y destacado | ✅ |
| Subida de fotos a **Storage** + guardado del producto en **Firestore** | ✅ |
| Lista de productos agregados con opción de **borrar** | ✅ |
| Botón al panel desde la cuenta (cuando entra la admin) | ✅ |
| **Reglas de Storage publicadas** | ✅ |

**Enfoque (importante):** los 52 productos de muestra siguen en el código (no se tocaron, cero riesgo). Los productos que la dueña agregue se guardan en Firestore y **aparecen mezclados al instante** en la tienda. Por ahora el panel administra los productos nuevos; editar los de muestra queda para más adelante.

**Cómo agrega productos la dueña:**
1. Entra a su cuenta (`/cuenta`) con Google.
2. Toca **"Panel de administración"**.
3. Llena el formulario, sube una foto y da **"Agregar producto"**. Aparece solito en el catálogo.

---

## 🔜 Lo que sigue

- **Fase 4 — Pagos con Stripe:** Cloud Functions + Stripe Checkout (tarjeta y pagos a plazos).
- **Mejora futura:** poder editar/borrar también los 52 productos de muestra desde el panel.
- **Pendiente por confirmar:** paquetería de envío (¿USPS o UPS?).

---

## 🛠️ Notas para desarrollo

- Correr el sitio en local: `npm run dev` → se abre en `http://localhost:5173/valeriesboutique/`
  (el sitio usa el prefijo `/valeriesboutique/` por GitHub Pages, no la raíz).
- Compilar para producción: `npm run build`
- Archivos clave nuevos: `src/firebase.js`, `src/context/AuthContext.jsx`, `src/pages/AccountPage.jsx`, `firestore.rules`, `storage.rules`.
