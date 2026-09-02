/*
  Vida: si llega a 0, te desmayás y volvés a la plaza.
*/
function pintarVida() {
  const el = document.getElementById("hud-vida");
  if (el) el.textContent = Math.max(0, Math.round(JUEGO.vida)) + " / 100";
}

function lastimar(cantidad, motivo) {
  const G = JUEGO;
  if (G.muertoTimer > 0 || G.modo !== "juego") return;
  G.vida = Math.max(0, G.vida - cantidad);
  pintarVida();
  if (motivo && cantidad >= 4) avisar(motivo);
  if (G.vida <= 0) desmayar(motivo || "Te quedaste sin vida.");
}

function curar(cantidad) {
  JUEGO.vida = Math.min(100, JUEGO.vida + cantidad);
  pintarVida();
}

function desmayar(motivo) {
  const G = JUEGO;
  G.muertoTimer = 2.2;
  G.vida = 0;
  pintarVida();
  avisar(motivo + " Volvés a la plaza.");
  ponerChat("sistema", "Te desmayaste. No pasa nada: arrancás de nuevo.");
}

function revivir() {
  const G = JUEGO;
  if (G.vehiculo) {
    bajarPasajeros(G.vehiculo, G.escena);
    G.vehiculo.ocupado = false;
    G.vehiculo.vel = 0;
    G.vehiculo = null;
  }
  G.jugador.mesh.visible = true;
  G.jugador.mesh.position.set(SPAWN.x, 0, SPAWN.z + 8);
  G.jugador.vy = 0;
  G.jugador.yaw = 0;
  G.vida = 100;
  G.ahogo = 0;
  G.muertoTimer = 0;
  if (G.dinero > 10) G.dinero -= 5;
  pintarVida();
  guardar();
}

function tickVida(dt) {
  const G = JUEGO;
  if (G.muertoTimer > 0) {
    G.muertoTimer -= dt;
    if (G.muertoTimer <= 0) revivir();
    return true;
  }
  const j = G.jugador;
  if (j.nadando) {
    G.ahogo += dt;
    if (G.ahogo > 7) lastimar(12 * dt, "Te falta aire en el mar.");
  } else {
    G.ahogo = Math.max(0, G.ahogo - dt * 2);
    if (G.vida < 100) curar(dt * 3);
  }
  revisarSecreto();
  return false;
}
