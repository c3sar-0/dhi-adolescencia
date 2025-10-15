const PDF_PATH = "docs/informe.pdf";

/* ===== Acordeón con alturas dinámicas (soporta anidado) ===== */
function setOpen(item, open) {
  const trigger = item.querySelector(":scope > .trigger");
  const panel = item.querySelector(":scope > .panel");
  if (!trigger || !panel) return;

  if (open) {
    item.setAttribute("aria-expanded", "true");
    trigger.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = "none";
    const h = panel.scrollHeight;
    panel.style.maxHeight = h + "px";
  } else {
    item.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = "0px";
  }
}
function updateAncestorHeights(fromElement) {
  let node = fromElement.closest(".panel");
  while (node) {
    if (node.parentElement?.matches('.item[aria-expanded="true"]')) {
      node.style.maxHeight = "none";
      const h = node.scrollHeight;
      node.style.maxHeight = h + "px";
    }
    node = node.parentElement?.closest(".panel") || null;
  }
}
function initAccordion(root) {
  const items = Array.from(root.querySelectorAll(":scope > .item"));
  items.forEach((item) => {
    const trigger = item.querySelector(":scope > .trigger");
    const panel = item.querySelector(":scope > .panel");
    if (!trigger || !panel) return;

    setOpen(item, false);

    trigger.addEventListener("click", () => {
      const isOpen = item.getAttribute("aria-expanded") === "true";
      setOpen(item, !isOpen);
      updateAncestorHeights(item);
      refreshToggleAllLabel();
    });

    const nested = panel.querySelector(":scope .accordion");
    if (nested) initAccordion(nested);
  });
}
function toggleAll(open) {
  const allItems = Array.from(document.querySelectorAll(".accordion .item"));
  allItems.forEach((item) => setOpen(item, open));
  allItems.forEach((item) => updateAncestorHeights(item));
  allItems.forEach((item) => updateAncestorHeights(item));
}
function allAreOpen() {
  const allItems = Array.from(document.querySelectorAll(".accordion .item"));
  return (
    allItems.length > 0 &&
    allItems.every((i) => i.getAttribute("aria-expanded") === "true")
  );
}
function refreshToggleAllLabel() {
  document.getElementById("toggleAll").textContent = allAreOpen()
    ? "Contraer todo"
    : "Expandir todo";
}
const mainAcc = document.getElementById("accordion");
initAccordion(mainAcc);
document.getElementById("toggleAll").addEventListener("click", () => {
  toggleAll(!allAreOpen());
  refreshToggleAllLabel();
});
document.getElementById("printBtn").addEventListener("click", (e) => {
  e.preventDefault();
  // Crea y dispara un <a download>
  const a = document.createElement("a");
  a.href = PDF_PATH;
  a.download = "Informe_Desarrollo_Socioemocional.pdf"; // nombre sugerido
  document.body.appendChild(a);
  a.click();
  a.remove();
});
window.addEventListener("resize", () => {
  document
    .querySelectorAll('.accordion .item[aria-expanded="true"]')
    .forEach((item) => {
      const panel = item.querySelector(":scope > .panel");
      if (panel) {
        panel.style.maxHeight = "none";
        panel.style.maxHeight = panel.scrollHeight + "px";
        updateAncestorHeights(item);
      }
    });
});
refreshToggleAllLabel();

/* ===== Galería y Lightbox ===== */
// Utilidad: agregar una imagen a una galería por sección
// Uso: addImage('gal-b', { src: 'images/foto1.jpg', alt: 'Descripción', caption: 'Pie de foto' })
function addImage(galleryId, { src, alt = "", caption = "" }) {
  const gal = document.getElementById(galleryId);
  if (!gal) return;
  const fig = document.createElement("figure");
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.decoding = "async";
  img.dataset.caption = caption;
  img.dataset.gallery = galleryId;
  fig.appendChild(img);
  if (caption) {
    const fc = document.createElement("figcaption");
    fc.textContent = caption;
    fig.appendChild(fc);
  }
  gal.appendChild(fig);
}

// Lightbox simple con navegación por galería
const lb = {
  root: document.getElementById("lightbox"),
  img: document.getElementById("lb-img"),
  title: document.getElementById("lb-title"),
  caption: document.getElementById("lb-caption"),
  closeBtn: document.getElementById("lb-close"),
  nextBtn: document.getElementById("lb-next"),
  prevBtn: document.getElementById("lb-prev"),
  currentIndex: -1,
  currentList: [],
};

function openLightbox(list, index) {
  lb.currentList = list;
  lb.currentIndex = index;
  const el = lb.currentList[lb.currentIndex];
  lb.img.src = el.src;
  lb.img.alt = el.alt || "";
  lb.title.textContent = el.alt || "Imagen";
  lb.caption.textContent = el.dataset.caption || "";
  lb.root.classList.add("open");
}
function closeLightbox() {
  lb.root.classList.remove("open");
}
function nextImage() {
  if (!lb.currentList.length) return;
  lb.currentIndex = (lb.currentIndex + 1) % lb.currentList.length;
  openLightbox(lb.currentList, lb.currentIndex);
}
function prevImage() {
  if (!lb.currentList.length) return;
  lb.currentIndex =
    (lb.currentIndex - 1 + lb.currentList.length) % lb.currentList.length;
  openLightbox(lb.currentList, lb.currentIndex);
}

lb.closeBtn.addEventListener("click", closeLightbox);
lb.nextBtn.addEventListener("click", nextImage);
lb.prevBtn.addEventListener("click", prevImage);
lb.root.addEventListener("click", (e) => {
  if (e.target === lb.root) closeLightbox();
});
window.addEventListener("keydown", (e) => {
  if (!lb.root.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

// Delegación: click en cualquier imagen de .gallery abre el lightbox con su "lista" (por galería)
document.addEventListener("click", (e) => {
  const img = e.target.closest(".gallery img");
  if (!img) return;
  const galleryId = img.dataset.gallery || img.closest(".gallery")?.id;
  const gallery = document.getElementById(galleryId);
  if (!gallery) return;
  const imgs = Array.from(gallery.querySelectorAll("img"));
  const index = imgs.indexOf(img);
  openLightbox(imgs, index);
});

/* ===== EJEMPLOS (borralos o cámbialos por tus rutas) ===== */
// Intro
addImage("gal-intro", {
  src: "images/intro.webp",
  alt: "Mapa conceptual",
  caption: "Mapa conceptual del informe",
});

// B) Imagen corporal…
addImage("gal-a", {
  src: "images/identidad.webp",
  alt: "Esquema de imagen corporal",
  caption: "Imagen corporal y autoconcepto",
});
// addImage("gal-b", {
//   src: "images/autoestima.png",
//   alt: "Comparativas",
//   caption: "Comparaciones sociales y autoevaluación",
// });

// C) Neuro/FE
addImage("gal-c", {
  src: "images/regulacion.jpg",
  alt: "Funciones ejecutivas",
  caption: "Memoria de trabajo, control inhibitorio y flexibilidad",
});

// D) Pares
addImage("gal-d", {
  src: "images/comparaciones.webp",
  alt: "Grupos de pares",
  caption: "Influencia de pares en la autoestima",
});

/* ===== Helpers YouTube ===== */

// Extrae el ID de distintas formas de URL de YouTube
function ytIdFrom(urlOrId) {
  if (!urlOrId) return null;
  // Si ya es un ID “limpio”
  if (/^[\w-]{11}$/.test(urlOrId)) return urlOrId;

  try {
    const u = new URL(urlOrId);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      // /embed/ID
      const m = u.pathname.match(/\/embed\/([\w-]{11})/);
      if (m) return m[1];
    }
  } catch (e) {
    /* ignorar */
  }
  return null;
}

// Inserta un video con thumbnail → al click crea el iframe (lazy)
function addYouTube(targetId, { urlOrId, title = "Video", caption = "" } = {}) {
  const host = document.getElementById(targetId);
  if (!host) return;
  const id = ytIdFrom(urlOrId);
  if (!id) return;
  console.log("added");

  const fig = document.createElement("figure");

  // Contenedor responsive
  const wrap = document.createElement("div");
  wrap.className = "video";

  // Botón/thumbnail (no carga iframe aún)
  const btn = document.createElement("button");
  btn.className = "video-thumb";
  btn.setAttribute("aria-label", `Reproducir: ${title}`);

  const img = document.createElement("img");
  img.className = "thumb";
  // Miniatura de alta calidad (fallback a hqdefault si no existe)
  img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  img.alt = title;
  img.loading = "lazy";
  img.decoding = "async";

  const play = document.createElement("div");
  play.className = "play";

  btn.appendChild(img);
  btn.appendChild(play);
  wrap.appendChild(btn);
  fig.appendChild(wrap);

  if (caption) {
    const fc = document.createElement("figcaption");
    fc.textContent = caption;
    fig.appendChild(fc);
  }

  host.appendChild(fig);

  // Al hacer click, reemplazamos por el iframe (nocookie + autoplay)
  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.title = title;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    wrap.innerHTML = "";
    wrap.appendChild(iframe);

    // Recalcular alturas para que no haya overflow
    iframe.addEventListener("load", () => updateAncestorHeights(iframe), {
      once: true,
    });
    // Si cambia el layout (rotación, resize), ajustar
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => updateAncestorHeights(iframe));
      ro.observe(wrap);
    } else {
      // fallback simple en resize
      window.addEventListener("resize", () => updateAncestorHeights(iframe));
    }
    updateAncestorHeights(iframe);
  });

  // También recalculamos cuando llega la miniatura
  if (img.complete) updateAncestorHeights(img);
  else
    img.addEventListener("load", () => updateAncestorHeights(img), {
      once: true,
    });
}

/* ===== Ejemplos de uso (borrá o reemplazá) ===== */
addYouTube("media-b", {
  urlOrId: "yBltIlTI0xU",
  title: "Autoestima y autoconcepto",
  caption: "https://www.youtube.com/shorts/yBltIlTI0xU",
});

addYouTube("media-c", {
  urlOrId: "At93CuAl_HU",
  title: "Autoestima y autoconcepto",
  caption: "https://www.youtube.com/shorts/At93CuAl_HU",
});
