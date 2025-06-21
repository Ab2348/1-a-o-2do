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

    // 1. Oculta el modal
    modal.classList.add("oculto");

    // 2. Calcula vector y escala (300% fijo)
    const rect = estrella.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const vx   = window.innerWidth  / 2;
    const vy   = window.innerHeight / 2;
    const dx   = vx - cx;
    const dy   = vy - cy;
    const s    = 3; // escala 300%

    estrella.style.setProperty("--dx", `${dx}px`);
    estrella.style.setProperty("--dy", `${dy}px`);
    estrella.style.setProperty("--s",  s);

    // 3. Asegura estado limpio
    estrella.style.display = ""; 
    estrella.classList.remove("intro-estrella", "trasladar-estrella", "desaparecer-estrella");

    // 4. Etapa 1: shrink & restore
    estrella.classList.add("intro-estrella");
    estrella.addEventListener("animationend", function step2(e) {
      if (e.animationName !== "intro-shrink-restore") return;
      estrella.removeEventListener("animationend", step2);

      // 5. Etapa 2: translación al centro + crecimiento
      estrella.classList.remove("intro-estrella");
      estrella.classList.add("trasladar-estrella");
      estrella.addEventListener("animationend", function step3(e2) {
        if (e2.animationName !== "trasladar-crecer") return;
        estrella.removeEventListener("animationend", step3);

        // 6. Etapa 3: fade-out
        estrella.classList.remove("trasladar-estrella");
        estrella.classList.add("desaparecer-estrella");
        estrella.addEventListener("animationend", function step4() {
          estrella.removeEventListener("animationend", step4);
          estrella.style.display = "none";
        }, { once: true });
      }, { once: true });
    }, { once: true });
  });
});
});
