document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedor-contenido");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    contenedor.innerHTML = "<p>Error: no se especificó una ranita.</p>";
    return;
  }

  let contenido;
  try {
    const resp = await fetch("contenido.json");
    const data = await resp.json();
    contenido = data[id];
    if (!contenido) {
      contenedor.innerHTML = "<p>Contenido no encontrado.</p>";
      return;
    }
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = "<p>Error cargando el contenido.</p>";
    return;
  }

  // Audio de fondo
  let audioFondo = null;
  if (contenido.audio) {
    const audio = document.createElement("audio");
    audio.src = contenido.audio;
    audio.loop = true;
    audio.volume = 0.1;
    audio.style.display = "none";
    document.body.appendChild(audio);
    document.addEventListener("click", () => {
      if (audio.paused) audio.play();
    }, { once: true });
    audioFondo = audio;
  }

  // Asigna clase de layout al contenedor
  // Valores permitidos: 'centrado', 'dos-columnas', 'horizontal'
  const layout = contenido.layout || "centrado";
  contenedor.classList.add(`layout-${layout}`);

  // Construye el HTML según el layout seleccionado
  let html = "";

  if (layout === "centrado") {
    html += `
      <div class="lienzo-ranita">
        <div class="texto-carta">
          ${contenido.texto}
        </div>
        <div class="secuencia-contenido">
          ${buildSecuencia(contenido.secuencia)}
        </div>
      </div>
    `;
  } else if (layout === "dos-columnas") {
    html += `
      <div class="layout-dos-columnas-contenedor">
        <div class="columna-texto">
          <div class="lienzo-ranita texto-solo">
            ${contenido.texto}
          </div>
        </div>
        <div class="columna-media">
          <div class="secuencia-contenido media-solo">
            ${buildSecuencia(contenido.secuencia)}
          </div>
        </div>
      </div>
    `;
  } else if (layout === "horizontal") {
    html += `
      <div class="layout-horizontal">
        <div class="texto-arriba">
          <div class="lienzo-ranita texto-horizontal">
            ${contenido.texto}
          </div>
        </div>
        <div class="media-abajo">
          <div class="secuencia-contenido media-horizontal">
            ${buildSecuencia(contenido.secuencia)}
          </div>
        </div>
      </div>
    `;
  } else {
    // Fallback a centrado si el layout es desconocido
    html += `
      <div class="lienzo-ranita">
        <div class="texto-carta">
          ${contenido.texto}
        </div>
        <div class="secuencia-contenido">
          ${buildSecuencia(contenido.secuencia)}
        </div>
      </div>
    `;
  }

  contenedor.innerHTML = html;

  // Carga API de YouTube
  loadYouTubeAPI();

  // Variables para controlar volumen
  const players = [];
  window.onYouTubeIframeAPIReady = () => {
    const iframes = Array.from(document.querySelectorAll("iframe"));
    iframes.forEach((iframe, i) => {
      if (!iframe.src.includes("youtube.com")) return;
      players[i] = new YT.Player(iframe, {
        events: { onStateChange: onPlayerStateChange }
      });
    });
  };

  function onPlayerStateChange(event) {
    if (!audioFondo) return;
    const estado = event.data;
    if (estado === YT.PlayerState.PLAYING) {
      bajarVolumenSuave();
    } else if (
      estado === YT.PlayerState.PAUSED ||
      estado === YT.PlayerState.ENDED
    ) {
      subirVolumenSuave();
    }
  }

  function bajarVolumenSuave() {
    if (audioFondo.volume > 0.1) {
      audioFondo.volume = Math.max(0.1, audioFondo.volume - 0.01);
      setTimeout(bajarVolumenSuave, 50);
    }
  }

  function subirVolumenSuave() {
    if (audioFondo.volume < 0.3) {
      audioFondo.volume = Math.min(0.3, audioFondo.volume + 0.01);
      setTimeout(subirVolumenSuave, 50);
    }
  }

  function buildSecuencia(secuencia = []) {
    return secuencia
      .map(item => {
        if (item.tipo === "imagen") {
          return `<img src="${item.src}" alt="${item.alt || ""}" />`;
        } else if (item.tipo === "video") {
          return `<iframe src="${item.src}" title="${item.titulo || ""}" frameborder="0" allowfullscreen></iframe>`;
        } else {
          return "";
        }
      })
      .join("");
  }

  function loadYouTubeAPI() {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }
});
