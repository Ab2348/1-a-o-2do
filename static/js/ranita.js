document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-contenido");
  const params = new URLSearchParams(window.location.search);
  const numero = params.get("id");

  if (!numero) {
    contenedor.innerHTML = `<p>No se especificó qué ranita mostrar.</p>`;
    return;
  }

  fetch("contenido.json")
    .then(res => res.json())
    .then(data => {
      const ranita = data[numero];
      if (!ranita) {
        contenedor.innerHTML = `<p>No hay contenido para la ranita ${numero}.</p>`;
        return;
      }

      // Audio de fondo
      if (ranita.audio) {
    const audio = document.createElement("audio");
    audio.src = ranita.audio;
    audio.autoplay = true;
    audio.loop = true;
    audio.volume = 0.1; // ⬅️ volumen inicial reducido
    audio.style.display = "none";
    document.body.appendChild(audio);
    document.body.addEventListener("click", () => audio.play(), { once: true });
    }

      // Generar contenido
      const html = `
        <div class="lienzo-ranita">
          <div class="texto-carta">${ranita.texto}</div>
          <div class="secuencia-contenido">
            ${ranita.secuencia.map(item => {
              if (item.tipo === "imagen") {
                return `<img src="${item.src}" alt="${item.alt || ''}"/>`;
              } else if (item.tipo === "video") {
                return `<iframe src="${item.src}" allowfullscreen></iframe>`;
              } else {
                return '';
              }
            }).join('')}
          </div>
        </div>
      `;
      contenedor.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = `<p>Error al cargar contenido.</p>`;
    });
  // Cargar API de YouTube
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

let audioFondo = null;
let players = [];

// Guardar referencia al audio
document.querySelectorAll("audio").forEach(a => audioFondo = a);

    // Esta función la llama automáticamente la API de YouTube cuando esté lista
    window.onYouTubeIframeAPIReady = function () {
    const iframes = document.querySelectorAll("iframe[src*='youtube.com']");

    iframes.forEach((iframe, index) => {
        const player = new YT.Player(iframe, {
        events: {
            'onStateChange': onPlayerStateChange
        }
        });
        players.push(player);
    });
    };

    function onPlayerStateChange(event) {
    if (!audioFondo) return;

    // 1 = playing, 2 = paused
    if (event.data === YT.PlayerState.PLAYING) {
        bajarVolumenSuave(audioFondo, 0.1);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        subirVolumenSuave(audioFondo, 0.3);
    }
    }

    // Suavizar bajada de volumen
    function bajarVolumenSuave(audio, target) {
    const step = 0.01;
    const interval = setInterval(() => {
        if (audio.volume > target) {
        audio.volume = Math.max(target, audio.volume - step);
        } else {
        clearInterval(interval);
        }
    }, 50);
    }

    // Suavizar subida de volumen
    function subirVolumenSuave(audio, target) {
    const step = 0.01;
    const interval = setInterval(() => {
        if (audio.volume < target) {
        audio.volume = Math.min(target, audio.volume + step);
        } else {
        clearInterval(interval);
        }
    }, 50);
    }

});
