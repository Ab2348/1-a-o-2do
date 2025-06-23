document.addEventListener("DOMContentLoaded", () => {
  /* ====== LÓGICA DE ANIMACIÓN EN index.html ====== */
  const contenedorSvg   = document.getElementById("contenedor-svg");
  const modal           = document.getElementById("modal-estrellas");
  const modalContenido  = document.querySelector(".modal-contenido");
  const botonesEstrella = document.querySelectorAll(".boton-estrella");

  if (contenedorSvg && modal && modalContenido && botonesEstrella.length) {
    contenedorSvg.addEventListener("click", () => {
      modal.classList.remove("oculto");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("oculto");
    });
    modalContenido.addEventListener("click", (e) => e.stopPropagation());

    botonesEstrella.forEach((boton) => {
      boton.addEventListener("click", () => {
        const numero   = boton.getAttribute("data-estrella");
        const estrella = document.querySelector(`.estrella-${numero}`);
        if (!estrella) return;

        /* ---------- Oculta el modal ---------- */
        modal.classList.add("oculto");

        /* ---------- Cálculo de animación ---------- */
        const rect = estrella.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const vx   = window.innerWidth  / 2;
        const vy   = window.innerHeight / 2;
        const dx   = vx - cx;
        const dy   = vy - cy;
        const ladoObjetivo = Math.min(window.innerWidth, window.innerHeight) * 0.60;
        const s    = (ladoObjetivo / rect.width).toFixed(3);

        estrella.style.setProperty("--dx", `${dx}px`);
        estrella.style.setProperty("--dy", `${dy}px`);
        estrella.style.setProperty("--s",  s);

        /* ---------- Reinicia animación ---------- */
        estrella.classList.remove("animar-estrella");
        void estrella.offsetWidth;  // fuerza reflow

        setTimeout(() => {
          estrella.classList.add("animar-estrella");

          // Fade global
          const fade = document.getElementById("fade-global");
          fade.classList.add("activo");

          // REDIRECCIÓN CORREGIDA:
          setTimeout(() => {
            window.location.href = `ranita.html?id=${numero}`;
          }, 3500);
        }, 200);

        /* ---------- Remueve la estrella al final ---------- */
        const fin = () => {
          estrella.style.display = "none";
          estrella.removeEventListener("animationend", fin);
        };
        estrella.addEventListener("animationend", fin, { once: true });
      });
    });
  }

  /* ====== CARGA DINÁMICA EN ranita.html ====== */
  if (window.location.pathname.includes("ranita.html")) {
    const contenedor = document.getElementById("contenedor-contenido");
    const params     = new URLSearchParams(window.location.search);
    const numero     = params.get("id");

    if (!numero) {
      contenedor.innerHTML = `<p>No se especificó qué ranita mostrar.</p>`;
    } else {
      fetch("contenido.json")
        .then(res => {
          if (!res.ok) throw new Error("No se encontró contenido.json");
          return res.json();
        })
        .then(data => {
          const ranita = data[numero];
          if (!ranita) {
            contenedor.innerHTML = `<p>No hay contenido para la ranita ${numero}.</p>`;
            return;
          }

          contenedor.innerHTML = `
            <div class="ranita-contenido">
              <h2>${ranita.titulo}</h2>
              <p>${ranita.texto}</p>
              <div class="video-container">
                <iframe width="560" height="315"
                        src="${ranita.youtube}"
                        frameborder="0"
                        allowfullscreen>
                </iframe>
              </div>
              <p><a href="index.html">← Volver al inicio</a></p>
            </div>
          `;
        })
        .catch(err => {
          console.error(err);
          contenedor.innerHTML = `<p>Error al cargar contenido.</p>`;
        });
    }
  }
});
