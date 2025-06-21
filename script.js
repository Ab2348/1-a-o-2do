// script.js
document.addEventListener("DOMContentLoaded", () => {
  /* ====== elementos ====== */
  const contenedorSvg   = document.getElementById("contenedor-svg");
  const modal           = document.getElementById("modal-estrellas");
  const modalContenido  = document.querySelector(".modal-contenido");
  const botonesEstrella = document.querySelectorAll(".boton-estrella");

  /* ---- Mostrar modal ---- */
  contenedorSvg.addEventListener("click", () => {
    modal.classList.remove("oculto");
  });

  /* ---- Cerrar modal ---- */
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("oculto");
  });
  modalContenido.addEventListener("click", (e) => e.stopPropagation());

  /* ---- Clic en estrella ---- */
  botonesEstrella.forEach((boton) => {
  boton.addEventListener("click", () => {
    const numero   = boton.getAttribute("data-estrella");
    const estrella = document.querySelector(`.estrella-${numero}`);
    if (!estrella) return;

    /* ---------- 1. Oculta el modal ---------- */
    modal.classList.add("oculto");

    /* ---------- 2. Calcula vector y escala ---------- */
    const rect = estrella.getBoundingClientRect();

    /* Centro de la estrella en píxeles */
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    /* Centro de la ventana */
    const vx = window.innerWidth  / 2;
    const vy = window.innerHeight / 2;

    /* Traslación necesaria */
    const dx = vx - cx;
    const dy = vy - cy;

    /* Escala destino: 60 % del lado menor del viewport */
    const ladoObjetivo = Math.min(window.innerWidth, window.innerHeight) * 0.60;
    const s = (ladoObjetivo / rect.width).toFixed(3);   // 3 decimales bastan

    /* ---------- 3. Configura variables CSS ---------- */
    estrella.style.setProperty("--dx", `${dx}px`);
    estrella.style.setProperty("--dy", `${dy}px`);
    estrella.style.setProperty("--s",  s);

    /* ---------- 4. Reinicia animación si ya se usó ---------- */
    estrella.classList.remove("animar-estrella");
    void estrella.offsetWidth;  // fuerza reflow
    estrella.classList.add("animar-estrella");

    /* ---------- 5. Cuando acabe, desaparece del DOM ---------- */
    const fin = () => {
      estrella.style.display = "none";
      estrella.removeEventListener("animationend", fin);
    };
    estrella.addEventListener("animationend", fin, { once: true });
  });
});
});
