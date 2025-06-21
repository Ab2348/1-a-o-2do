// script.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedorSvg   = document.getElementById("contenedor-svg");
  const modal           = document.getElementById("modal-estrellas");
  const modalContenido  = document.querySelector(".modal-contenido");
  const botonesEstrella = document.querySelectorAll(".boton-estrella");

  // Mostrar modal
  contenedorSvg.addEventListener("click", () => {
    modal.classList.remove("oculto");
  });

  // Cerrar modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("oculto");
  });
  modalContenido.addEventListener("click", (e) => e.stopPropagation());

  // Click en estrella
  botonesEstrella.forEach((boton) => {
    boton.addEventListener("click", () => {
      const numero   = boton.getAttribute("data-estrella");
      const estrella = document.querySelector(`.estrella-${numero}`);
      if (!estrella) return;

      // Ocultar modal
      modal.classList.add("oculto");

      // Obtener posición y tamaño en pantalla
      const rect = estrella.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const vx = window.innerWidth / 2;
      const vy = window.innerHeight / 2;
      const dx = vx - cx;
      const dy = vy - cy;
      const ladoObjetivo = Math.min(window.innerWidth, window.innerHeight) * 0.60;
      const s = (ladoObjetivo / rect.width).toFixed(3);

      // Crear un nuevo <svg> que contenga el clon
      const nuevoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      nuevoSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      nuevoSvg.setAttribute("width", rect.width);
      nuevoSvg.setAttribute("height", rect.height);
      nuevoSvg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
      nuevoSvg.classList.add("clon-estrella");

      // Clonar el nodo de la estrella y añadirlo al nuevo SVG
      const clonG = estrella.cloneNode(true);
      nuevoSvg.appendChild(clonG);

      // Posicionar el nuevo SVG en la pantalla
      nuevoSvg.style.position = "fixed";
      nuevoSvg.style.left = `${rect.left}px`;
      nuevoSvg.style.top = `${rect.top}px`;
      nuevoSvg.style.width = `${rect.width}px`;
      nuevoSvg.style.height = `${rect.height}px`;
      nuevoSvg.style.transform = "translate3d(0, 0, 0) scale(0.6)";
      nuevoSvg.style.setProperty("--dx", `${dx}px`);
      nuevoSvg.style.setProperty("--dy", `${dy}px`);
      nuevoSvg.style.setProperty("--s", s);

      // Insertar en el DOM
      document.body.appendChild(nuevoSvg);

      // Remover el clon al finalizar la animación
      nuevoSvg.addEventListener("animationend", () => {
        nuevoSvg.remove();
      }, { once: true });
    });
  });
});
