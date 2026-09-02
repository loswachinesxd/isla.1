/*
  Botones, teclado y toques.
*/
function entrarAlJuego() {
  const nom = document.getElementById("nombre-jugador");
  if (nom && nom.value.trim()) JUEGO.nombre = nom.value.trim().slice(0, 16);
  const cla = document.getElementById("clave-admin");
  if (cla && esClaveDirector(cla.value)) {
    JUEGO.esAdmin = true;
    avisar("Modo director. /ayuda en el chat.");
  }
  JUEGO.modo = "juego";
  mostrar("portada", false);
  mostrar("ayuda", false);
  mostrar("hud", true);
  if (!JUEGO.esAdmin) avisar("Bienvenido a isla.1. Hablá con Ana.");
  if (esMovil()) {
    const el = document.documentElement;
    const pedir = el.requestFullscreen || el.webkitRequestFullscreen;
    if (pedir) {
      try {
        const p = pedir.call(el);
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
    }
  }
}

function conectarToque(id, clave) {
  const el = document.getElementById(id);
  el.addEventListener("pointerdown", function () {
    JUEGO.toques[clave] = true;
  });
  el.addEventListener("pointerup", function () {
    JUEGO.toques[clave] = false;
  });
}

function conectarControles() {
  const nom = document.getElementById("nombre-jugador");
  if (nom && JUEGO.nombre) nom.value = JUEGO.nombre;
  document.getElementById("btn-jugar").addEventListener("click", entrarAlJuego);
  document.getElementById("btn-ayuda").addEventListener("click", function () {
    mostrar("ayuda", true);
  });
  document.getElementById("btn-cerrar-ayuda").addEventListener("click", function () {
    mostrar("ayuda", false);
  });
  document.getElementById("btn-cerrar-tienda").addEventListener("click", cerrarTienda);
  document.getElementById("btn-salir").addEventListener("click", function () {
    JUEGO.modo = "portada";
    mostrar("hud", false);
    mostrar("tienda", false);
    mostrar("portada", true);
    guardar();
  });
  window.addEventListener("keydown", function (ev) {
    if (JUEGO.escribiendo) {
      if (ev.code === "Escape") cerrarChat();
      return;
    }
    if ((ev.code === "KeyT" || ev.code === "Enter") && ev.target.tagName !== "INPUT") {
      ev.preventDefault();
      abrirChat();
      return;
    }
    JUEGO.teclas[ev.code] = true;
    if (ev.code === "Space") ev.preventDefault();
    if (ev.code === "KeyF" && !ev.repeat) pegar();
  });
  window.addEventListener("keyup", function (ev) {
    JUEGO.teclas[ev.code] = false;
  });
  document.querySelectorAll("[data-dir]").forEach((btn) => {
    const dir = btn.getAttribute("data-dir");
    btn.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      JUEGO.toques[dir] = true;
    });
    btn.addEventListener("pointerup", function () {
      JUEGO.toques[dir] = false;
    });
    btn.addEventListener("pointerleave", function () {
      JUEGO.toques[dir] = false;
    });
  });
  conectarToque("btn-correr", "correr");
  conectarToque("btn-saltar", "saltar");
  document.getElementById("btn-usar").addEventListener("click", interactuar);
  document.getElementById("btn-pegar").addEventListener("click", pegar);
  conectarChat();
  window.addEventListener("resize", function () {
    JUEGO.camara.aspect = window.innerWidth / window.innerHeight;
    JUEGO.camara.updateProjectionMatrix();
    JUEGO.renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
