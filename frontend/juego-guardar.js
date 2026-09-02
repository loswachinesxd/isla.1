/*
  Guardar y cargar el cuaderno.
*/
function guardar() {
  guardarCuaderno(
    armarCuaderno(JUEGO.dinero, JUEGO.compras, JUEGO.misiones, {
      vida: JUEGO.vida,
      nombre: JUEGO.nombre,
      secretoEncontrado: JUEGO.secretoEncontrado,
    })
  );
}

function cargar(datos) {
  if (!datos || typeof datos !== "object") return;
  if (typeof datos.dinero === "number") JUEGO.dinero = datos.dinero;
  if (datos.compras) JUEGO.compras = datos.compras;
  if (Array.isArray(datos.misiones)) {
    datos.misiones.forEach((guardada) => {
      const m = misionPorId(JUEGO.misiones, guardada.id);
      if (!m) return;
      m.paso = guardada.paso || 0;
      m.hecha = !!guardada.hecha;
      if (typeof guardada.juntas === "number") m.juntas = guardada.juntas;
    });
  }
  if (typeof datos.vida === "number") JUEGO.vida = datos.vida;
  if (datos.nombre) JUEGO.nombre = String(datos.nombre).slice(0, 16);
  if (datos.secretoEncontrado) {
    JUEGO.secretoEncontrado = true;
    if (JUEGO.piedraSecreta) JUEGO.piedraSecreta.visible = false;
  }
  aplicarCompras(JUEGO.jugador, JUEGO.compras);
  aplicarRecogidos();
  pintarVida();
}

function aplicarRecogidos() {
  const G = JUEGO;
  const conchaM = misionPorId(G.misiones, "conchas");
  ocultarPickups(G.conchas, conchaM && conchaM.juntas, conchaM && conchaM.hecha);
  const floresM = misionPorId(G.misiones, "flores");
  ocultarPickups(G.flores, floresM && floresM.juntas, floresM && floresM.hecha);
  const tesoroM = misionPorId(G.misiones, "tesoro");
  if (tesoroM && tesoroM.hecha) {
    G.tesoro.tomado = true;
    G.tesoro.mesh.visible = false;
  }
  const boyaM = misionPorId(G.misiones, "boya");
  if (boyaM && boyaM.hecha) G.boya.mesh.visible = false;
  const manzanaM = misionPorId(G.misiones, "manzanas");
  ocultarPickups(G.manzanas, manzanaM && manzanaM.juntas, manzanaM && manzanaM.hecha);
  const gatoM = misionPorId(G.misiones, "gato");
  if (gatoM && gatoM.hecha) G.gato.mesh.visible = false;
}

function pagar(cantidad, porQue) {
  JUEGO.dinero += cantidad;
  avisar(porQue + "  +$" + cantidad);
  guardar();
}

function completar(mision) {
  if (mision.hecha) return;
  mision.hecha = true;
  pagar(mision.recompensa, "Misión lista: " + mision.titulo);
}
