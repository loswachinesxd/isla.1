/*
  Botones, teclado y toques.
*/
function entrarAlJuego() {
  JUEGO.modo = "juego";
  mostrar("portada", false);
  mostrar("ayuda", false);
  mostrar("hud", true);
  avisar("Bienvenido a isla.1. Hablá con Ana.");
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
    JUEGO.teclas[ev.code] = true;
    if (ev.code === "Space") ev.preventDefault();
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
  window.addEventListener("resize", function () {
    JUEGO.camara.aspect = window.innerWidth / window.innerHeight;
    JUEGO.camara.updateProjectionMatrix();
    JUEGO.renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
