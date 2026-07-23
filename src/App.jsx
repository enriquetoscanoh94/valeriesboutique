import { useEffect, useRef, useState } from "react";

/* ==========================================================
   DATOS DE MUESTRA (imagenes generadas con IA para el demo)
   ⚠️ Precios de ejemplo: se reemplazan por los reales de Valerie's
   destacado: true = producto estrella (se muestra grande)
   ========================================================== */
const PRODUCTOS = [
  { id: 1, cat: "Vestidos de XV", cat_en: "Quinceañera",
    nombre: "Vestido de XV Princesa", nombre_en: "Princess Quince Gown",
    precio: 499, img: "productos/vestido-xv.jpg", destacado: true,
    desc: "Corte princesa con pedrería y tul en capas.",
    desc_en: "Princess cut with beading and layered tulle." },
  { id: 2, cat: "Novias", cat_en: "Bridal",
    nombre: "Vestido de Novia Encaje", nombre_en: "Lace Wedding Gown",
    precio: 699, img: "productos/vestido-novia.jpg", destacado: true,
    desc: "Encaje francés y cola larga desmontable.",
    desc_en: "French lace with detachable long train." },
  { id: 3, cat: "Niña", cat_en: "Girls",
    nombre: "Vestido de Niña Rosa", nombre_en: "Pink Girl Dress",
    precio: 89, img: "productos/vestido-nina.jpg" },
  { id: 4, cat: "Ramos", cat_en: "Bouquets",
    nombre: "Ramo de Novia", nombre_en: "Bridal Bouquet",
    precio: 75, img: "productos/ramo.jpg" },
  { id: 5, cat: "Accesorios", cat_en: "Accessories",
    nombre: "Corona Rose Gold", nombre_en: "Rose Gold Crown",
    precio: 45, img: "productos/corona.jpg" },
  { id: 6, cat: "Accesorios", cat_en: "Accessories",
    nombre: "Oso de Peluche XV", nombre_en: "Quince Teddy Bear",
    precio: 60, img: "productos/oso.jpg" },
];

const CATEGORIAS = [
  { es: "Vestidos de XV", en: "Quinceañera" },
  { es: "Novias", en: "Bridal" },
  { es: "Fiesta", en: "Party" },
  { es: "Niña", en: "Girls" },
  { es: "Bautizo", en: "Baptism" },
  { es: "Ramos", en: "Bouquets" },
  { es: "Accesorios", en: "Accessories" },
];

const OPINIONES = [
  { es: "Hermoso vestido y excelente atención. ¡Mi XV quedó perfecta!",
    en: "Beautiful dress and amazing service. My quince was perfect!",
    autor: "Mariana G." },
  { es: "Encontré el vestido de novia de mis sueños y me lo ajustaron a la medida.",
    en: "I found my dream wedding gown and they tailored it to fit me.",
    autor: "Jocelyn R." },
  { es: "Compré el paquete completo de bautizo. Todo coordinado y precioso.",
    en: "I bought the full baptism package. Everything matched and gorgeous.",
    autor: "Alejandra M." },
];

/* Textos en los dos idiomas */
const T = {
  es: {
    anuncio: "Recoge en tienda · Salinas, CA 📍  ·  Paga en 4 pagos sin interés",
    nav: ["Vestidos", "XV", "Novias", "Niña", "Ramos", "Accesorios"],
    heroKicker: "Valerie's Boutique · Salinas, California",
    heroTitulo1: "El vestido perfecto",
    heroTitulo2: "para tu celebración",
    heroTexto: "Vestidos de XV, novia, fiesta y niña · ramos · accesorios y mucho más.",
    verVestidos: "Ver vestidos",
    verAccesorios: "Ver accesorios",
    categorias: "Compra por celebración",
    estrellas: "Nuestros vestidos estrella",
    masProductos: "Más productos",
    agregar: "Agregar al carrito",
    verMas: "Ver detalles",
    pagos: "o 4 pagos de",
    nosotrosTitulo: "Una boutique, no una página web",
    nosotrosTexto: "En el corazón de Salinas atendemos cada celebración en persona. Ven, pruébate el vestido y llévate el look completo coordinado: vestido, ramo, corona y accesorios. Lo que ves aquí lo tienes en la tienda.",
    nosotrosBtn: "Cómo llegar",
    paqueteTitulo: "Paquetes para tu evento",
    paqueteTexto: "Arma tu paquete de XV, boda o bautizo con vestido y accesorios coordinados.",
    paqueteBtn: "Ver paquetes",
    opiniones: "Lo que dicen nuestras clientas",
    contacto: "Visítanos",
    horario: "Horario",
    pagoSeguro: "Pago 100% seguro con Stripe",
  },
  en: {
    anuncio: "Store pickup · Salinas, CA 📍  ·  Pay in 4 interest-free payments",
    nav: ["Dresses", "Quince", "Bridal", "Girls", "Bouquets", "Accessories"],
    heroKicker: "Valerie's Boutique · Salinas, California",
    heroTitulo1: "The perfect dress",
    heroTitulo2: "for your celebration",
    heroTexto: "Quince, bridal, party & girls dresses · bouquets · accessories and more.",
    verVestidos: "Shop dresses",
    verAccesorios: "Shop accessories",
    categorias: "Shop by celebration",
    estrellas: "Our signature gowns",
    masProductos: "More products",
    agregar: "Add to cart",
    verMas: "View details",
    pagos: "or 4 payments of",
    nosotrosTitulo: "A boutique, not just a website",
    nosotrosTexto: "In the heart of Salinas we help with every celebration in person. Come try the dress on and take home the full coordinated look: gown, bouquet, crown and accessories. What you see here, you'll find in the store.",
    nosotrosBtn: "Get directions",
    paqueteTitulo: "Packages for your event",
    paqueteTexto: "Build your quince, wedding or baptism package with matching dress and accessories.",
    paqueteBtn: "See packages",
    opiniones: "What our clients say",
    contacto: "Visit us",
    horario: "Hours",
    pagoSeguro: "100% secure payment with Stripe",
  },
};

/* ==========================================================
   Iconos SVG (nitidos en cualquier tamaño, mejor que emojis)
   ========================================================== */
function IconoBuscar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function IconoBolsa(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function IconoWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" {...props}>
      <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.42 9.42 0 0 1 1.46-11.9 9.36 9.36 0 0 1 13.24.02 9.4 9.4 0 0 1-6.67 16.3ZM20.07 3.9A11.4 11.4 0 0 0 3.5 18.9L2 24.5l5.73-1.5a11.36 11.36 0 0 0 5.32 1.35h.01a11.4 11.4 0 0 0 8.07-19.45Z" />
    </svg>
  );
}

/* ==========================================================
   Parallax con el mouse: guarda la posicion en --mx / --my
   (de -1 a 1) y cada capa la multiplica por su profundidad.
   Se suaviza con requestAnimationFrame para que se sienta fluido.
   ========================================================== */
function useParallaxMouse() {
  const ref = useRef(null);

  useEffect(() => {
    // Si la persona prefiere menos movimiento, no hay parallax
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = ref.current;
    let objetivoX = 0, objetivoY = 0; // a donde apunta el mouse
    let x = 0, y = 0;                 // posicion suavizada
    let raf;

    const alMover = (e) => {
      objetivoX = (e.clientX / window.innerWidth - 0.5) * 2;
      objetivoY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const animar = () => {
      x += (objetivoX - x) * 0.05;
      y += (objetivoY - y) * 0.05;
      hero.style.setProperty("--mx", x.toFixed(3));
      hero.style.setProperty("--my", y.toFixed(3));
      raf = requestAnimationFrame(animar);
    };

    window.addEventListener("mousemove", alMover);
    raf = requestAnimationFrame(animar);
    return () => {
      window.removeEventListener("mousemove", alMover);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

/* Capa de flores del hero: la div exterior hace el parallax
   y la imagen interior hace la entrada con zoom + desenfoque */
function CapaFlor({ src, clase, prof, escala, retraso, blur = "0px", opacidad = 1, petalos = false }) {
  return (
    <div className={`capa absolute pointer-events-none ${clase}`} style={{ "--prof": prof }}>
      <img
        src={src}
        alt=""
        className={`w-full h-auto ${petalos ? "petalos-caen" : "capa-img"}`}
        style={{ "--escala": escala, "--retraso": retraso, "--blur": blur, "--opacidad": opacidad }}
      />
    </div>
  );
}

/* Tarjeta de producto normal */
function TarjetaProducto({ p, t, lang, onAgregar }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="aspect-[3/4] overflow-hidden bg-crema">
        <img
          src={p.img}
          alt={lang === "es" ? p.nombre : p.nombre_en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-rosadorado tracking-wide mb-1">
          {lang === "es" ? p.cat : p.cat_en}
        </p>
        <h3 className="font-display text-lg text-negro leading-tight mb-1">
          {lang === "es" ? p.nombre : p.nombre_en}
        </h3>
        <p className="text-xl font-medium text-negro">${p.precio}.00</p>
        <p className="text-[11px] text-negro/65 mb-3">
          {t.pagos} ${(p.precio / 4).toFixed(2)} · Afterpay
        </p>
        <button
          onClick={onAgregar}
          className="w-full bg-negro text-white text-sm py-2.5 rounded-full hover:bg-rosadorado transition-colors"
        >
          {t.agregar}
        </button>
      </div>
    </article>
  );
}

export default function App() {
  const [lang, setLang] = useState("es");
  const [carrito, setCarrito] = useState(0);
  const t = T[lang];
  const heroRef = useParallaxMouse();

  const estrellas = PRODUCTOS.filter((p) => p.destacado);
  const resto = PRODUCTOS.filter((p) => !p.destacado);

  return (
    <div className="min-h-screen bg-crema text-negro font-sans">
      {/* ---------- Barra de anuncio ---------- */}
      <div className="bg-negro text-rosa text-center text-xs sm:text-sm py-2 px-4 tracking-wide border-b border-white/10">
        {t.anuncio}
      </div>

      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 bg-negro border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          <a href="#" className="flex items-center">
            <img src="logo-letrero.png" alt="Valerie's Boutique" className="h-16 w-auto" />
          </a>

          <nav className="hidden lg:flex gap-7 text-white/90 text-sm tracking-wide">
            {t.nav.map((item) => (
              <a key={item} href="#" className="hover:text-rosa transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-white">
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="text-xs border border-white/40 rounded-full px-3 py-1 hover:bg-white/10"
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
            <button className="hover:text-rosa transition-colors" aria-label="Buscar">
              <IconoBuscar />
            </button>
            <button className="relative hover:text-rosa transition-colors" aria-label="Carrito">
              <IconoBolsa />
              {carrito > 0 && (
                <span className="absolute -top-2 -right-2 bg-rosa text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {carrito}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================================
          HERO — Profundidad de flores + vestido
          Capas de atras hacia adelante: rama lejana → ramos en las
          esquinas → vestido estrella → petalos flotando → rosa
          gigante desenfocada al frente (profundidad de campo).
          El texto se revela con mascara.
          ========================================================== */}
      <section
        ref={heroRef}
        className="relative min-h-[68svh] sm:min-h-[92svh] overflow-hidden bg-negro flex items-center justify-center"
      >
        {/* Resplandor rosa de fondo */}
        <div className="hero-resplandor absolute inset-0" />

        {/* Capa lejana: rama con botones (se mueve poco, casi quieta) */}
        <CapaFlor
          src="flores/rama-botones.png"
          clase="top-[4%] left-[-4%] w-[55vw] md:w-[38vw] max-w-[520px]"
          prof={6} escala={1.35} retraso="0.25s" blur="2px" opacidad={0.55}
        />

        {/* Ramo esquina superior derecha (capa media) */}
        <CapaFlor
          src="flores/ramo-derecha.png"
          clase="top-[-10%] right-[-14%] w-[64vw] md:w-[38vw] max-w-[560px]"
          prof={14} escala={1.5} retraso="0.1s" opacidad={0.92}
        />

        {/* Ramo esquina inferior izquierda (capa cercana) */}
        <CapaFlor
          src="flores/ramo-izquierda.png"
          clase="bottom-[-14%] left-[-12%] w-[72vw] md:w-[46vw] max-w-[640px]"
          prof={20} escala={1.6} retraso="0s"
        />

        {/* Petalos flotando en medio */}
        <CapaFlor
          src="flores/petalos.png"
          clase="top-[8%] left-[16%] w-[42vw] md:w-[28vw] max-w-[380px]"
          prof={26} escala={1.7} retraso="0.55s" opacidad={0.5} petalos
        />
        <CapaFlor
          src="flores/petalos.png"
          clase="top-[34%] right-[10%] w-[32vw] md:w-[20vw] max-w-[280px]"
          prof={32} escala={1.8} retraso="0.75s" blur="3px" opacidad={0.3} petalos
        />

        {/* Rosa gigante al frente, desenfocada (profundidad de campo) */}
        <CapaFlor
          src="flores/rosa-grande.png"
          clase="bottom-[-16%] right-[-8%] w-[52vw] md:w-[32vw] max-w-[440px] hidden sm:block"
          prof={38} escala={2.1} retraso="0.2s" blur="7px" opacidad={0.9}
        />

        {/* Velo oscuro detras del texto (sobre las flores, bajo el texto) */}
        <div className="hero-scrim absolute inset-0 z-[5] pointer-events-none" />

        {/* Texto central con revelado de mascara */}
        <div className="relative z-10 text-center px-4 py-14 sm:py-24">
          <div className="mascara">
            <p className="text-rosa tracking-[0.35em] text-[11px] sm:text-xs uppercase mb-6" style={{ "--retraso": "0.8s" }}>
              {t.heroKicker}
            </p>
          </div>
          <h1 className="font-display italic font-medium text-white leading-[1.08] text-[clamp(2.6rem,7vw,5.5rem)] [text-wrap:balance] [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]">
            <span className="mascara"><span style={{ "--retraso": "0.95s" }}>{t.heroTitulo1}</span></span>
            <span className="mascara"><span style={{ "--retraso": "1.1s" }}>{t.heroTitulo2}</span></span>
          </h1>
          <div className="mascara mt-6">
            <p className="text-white/85 max-w-md mx-auto" style={{ "--retraso": "1.25s" }}>
              {t.heroTexto}
            </p>
          </div>
          <div className="aparece flex flex-wrap gap-4 justify-center mt-9" style={{ "--retraso": "1.5s" }}>
            <a
              href="#estrellas"
              className="bg-rosa text-negro font-medium px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-crema transition-colors"
            >
              {t.verVestidos}
            </a>
            <a
              href="#categorias"
              className="border border-white/40 text-white px-8 py-3.5 rounded-full text-sm tracking-wide hover:border-rosa hover:text-rosa transition-colors"
            >
              {t.verAccesorios}
            </a>
          </div>
        </div>

        {/* Linea que invita a bajar */}
        <div className="linea-scroll absolute bottom-6 left-1/2 -translate-x-1/2 w-px h-14" />
      </section>

      {/* ---------- Categorias: chips elegantes (grid en movil) ---------- */}
      <section id="categorias" className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-negro mb-10">
          {t.categorias}
        </h2>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3">
          {CATEGORIAS.map((c) => (
            <a
              key={c.es}
              href="#"
              className="font-display italic text-xl sm:text-2xl text-negro/85 border border-rosa-claro rounded-full px-6 py-2.5 hover:border-rosadorado hover:text-rosadorado hover:bg-rosa-claro/30 transition-colors"
            >
              {lang === "es" ? c.es : c.en}
            </a>
          ))}
        </div>
      </section>

      {/* ---------- Vestidos estrella (grandes, jerarquia) ---------- */}
      <section id="estrellas" className="bg-rosa-claro/40 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl sm:text-4xl text-center text-negro mb-12">
            {t.estrellas}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {estrellas.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col sm:grid sm:grid-cols-2"
              >
                <div className="aspect-[4/5] sm:aspect-auto overflow-hidden bg-crema">
                  <img
                    src={p.img}
                    alt={lang === "es" ? p.nombre : p.nombre_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <p className="text-xs text-rosadorado tracking-wide mb-2">
                    {lang === "es" ? p.cat : p.cat_en}
                  </p>
                  <h3 className="font-display text-2xl text-negro leading-tight mb-2">
                    {lang === "es" ? p.nombre : p.nombre_en}
                  </h3>
                  <p className="text-sm text-negro/65 mb-4">
                    {lang === "es" ? p.desc : p.desc_en}
                  </p>
                  <p className="text-2xl font-medium text-negro">${p.precio}.00</p>
                  <p className="text-[11px] text-negro/65 mb-4">
                    {t.pagos} ${(p.precio / 4).toFixed(2)} · Afterpay
                  </p>
                  <button
                    onClick={() => setCarrito(carrito + 1)}
                    className="bg-negro text-white text-sm py-2.5 rounded-full hover:bg-rosadorado transition-colors"
                  >
                    {t.agregar}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Mas productos (grid normal) ---------- */}
      <section id="destacados" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl sm:text-4xl text-center text-negro mb-12">
          {t.masProductos}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {resto.map((p) => (
            <TarjetaProducto
              key={p.id} p={p} t={t} lang={lang}
              onAgregar={() => setCarrito(carrito + 1)}
            />
          ))}
        </div>
      </section>

      {/* ---------- Nosotros (tienda fisica) ---------- */}
      <section className="bg-negro text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="flores/ramo-izquierda.png"
              alt=""
              className="w-full max-w-sm mx-auto drop-shadow-[0_10px_40px_rgba(217,139,169,0.25)]"
            />
          </div>
          <div>
            <h2 className="font-display italic text-3xl sm:text-4xl mb-4">{t.nosotrosTitulo}</h2>
            <p className="text-white/75 leading-relaxed mb-7 max-w-md">{t.nosotrosTexto}</p>
            <a
              href="https://maps.google.com/?q=19+W+Market+St+Salinas+CA+93901"
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-rosa text-rosa px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-rosa hover:text-negro transition-colors"
            >
              {t.nosotrosBtn}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Paquetes (panel oscuro con flores) ---------- */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-rosadorado to-negro rounded-3xl px-8 py-16 text-center text-white">
          {/* Decoracion floral distinta a la del hero */}
          <img
            src="flores/rama-botones.png"
            alt=""
            className="absolute -top-12 -right-10 w-56 opacity-40 pointer-events-none"
          />
          <img
            src="flores/petalos.png"
            alt=""
            className="absolute bottom-2 -left-6 w-48 opacity-30 pointer-events-none"
          />
          <div className="relative">
            <h2 className="font-display italic text-3xl sm:text-4xl mb-3">{t.paqueteTitulo}</h2>
            <p className="text-white/85 max-w-xl mx-auto mb-8">{t.paqueteTexto}</p>
            <a
              href="#"
              className="inline-block bg-crema text-negro font-medium px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-rosa transition-colors"
            >
              {t.paqueteBtn}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Opiniones (3 clientas) ---------- */}
      <section className="bg-rosa-claro/40 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-negro mb-12">{t.opiniones}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {OPINIONES.map((o) => (
              <figure key={o.autor} className="bg-white rounded-2xl p-7 shadow-sm text-left">
                <div className="text-rosadorado tracking-[0.2em] mb-3">★★★★★</div>
                <blockquote className="font-display italic text-lg text-negro/85 leading-snug mb-4">
                  “{lang === "es" ? o.es : o.en}”
                </blockquote>
                <figcaption className="text-sm text-rosadorado">— {o.autor}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-negro text-white/80">
        <div className="max-w-7xl mx-auto px-4 py-14 grid sm:grid-cols-3 gap-10">
          <div>
            <img src="logo-letrero.png" alt="Valerie's Boutique" className="h-24 w-auto mb-3" />
            <p className="text-sm text-white/60">{t.pagoSeguro}</p>
          </div>
          <div>
            <h3 className="font-display text-xl text-white mb-3">{t.contacto}</h3>
            <p className="text-sm">19 W Market St<br />Salinas, CA 93901</p>
            <p className="text-sm mt-2">📞 (831) 998-0610</p>
          </div>
          <div>
            <h3 className="font-display text-xl text-white mb-3">{t.horario}</h3>
            <p className="text-sm text-white/60">Lun – Sáb · 11am – 6pm</p>
            <div className="flex gap-4 mt-4 text-sm">
              <a href="https://www.instagram.com/valeries._boutique_/" className="hover:text-rosa">Instagram</a>
              <a href="https://www.tiktok.com/@valeries..boutique" className="hover:text-rosa">TikTok</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center text-xs text-white/40 py-4">
          © {new Date().getFullYear()} Valerie's Boutique · Salinas, CA
        </div>
      </footer>

      {/* ---------- Boton flotante de WhatsApp ---------- */}
      <a
        href="https://wa.me/18319980610"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <IconoWhatsApp />
      </a>
    </div>
  );
}
