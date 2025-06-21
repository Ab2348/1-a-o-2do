document.addEventListener("DOMContentLoaded", () => {
  const contenedorSvg = document.getElementById("contenedor-svg");
  const modal = document.getElementById("modal-estrellas");
  const modalContenido = document.querySelector(".modal-contenido");
  const botonesEstrella = document.querySelectorAll(".boton-estrella");

  // Mostrar el modal al hacer clic en el SVG
  contenedorSvg.addEventListener("click", () => {
    modal.classList.remove("oculto");
  });

  // Cerrar el modal si se hace clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("oculto");
    }
  });

  // Prevenir que clics dentro del contenido cierren el modal
  modalContenido.addEventListener("click", (e) => {
    e.stopPropagation();
  });

    
  botonesEstrella.forEach((boton) => {
    boton.addEventListener("click", () => {
      const numero = boton.getAttribute("data-estrella");
      const estrella = document.querySelector(`.estrella-${numero}`);

      if (!estrella) return;

      // Ocultar el modal
      modal.classList.add("oculto");

      // Agregar clase para animar la estrella
      estrella.classList.add("animar-estrella");

      // Crear fondo negro para la transición
      const overlay = document.createElement("div");
      overlay.classList.add("pantalla-negra");
      document.body.appendChild(overlay);

      // Redirigir tras la animación (puedes ajustar el tiempo)
      setTimeout(() => {
        window.location.href = `/estrella${numero}`;
      }, 2000);
    });
  });

});
