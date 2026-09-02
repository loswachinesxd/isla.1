/*
  Carteles en pantalla: zona, plata, avisos.
*/
function mostrar(id, si) {
  document.getElementById(id).classList.toggle("escondida", !si);
}

function avisar(texto) {
  const el = document.getElementById("aviso");
  el.textContent = texto;
  el.classList.add("visible");
  JUEGO.avisoTimer = 2.4;
}

function hablar(texto) {
  const el = document.getElementById("dialogo");
  el.textContent = texto;
  el.classList.add("visible");
  JUEGO.dialogoTimer = 4;
}

function horaTexto(hora) {
  const h = Math.floor(hora);
  const m = Math.floor((hora - h) * 60);
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

function pintarHud(zona) {
  const G = JUEGO;
  document.getElementById("hud-zona").textContent = nombreZona(zona);
  document.getElementById("hud-dinero").textContent = "$ " + G.dinero;
  pintarVida();
  const dir = document.getElementById("hud-rol");
  if (dir) dir.textContent = G.esAdmin ? "Director" : G.nombre || "Maxi";
  document.getElementById("hud-hora").textContent = horaTexto(G.clima.hora);
  document.getElementById("hud-clima").textContent = nombreClima(G.clima.tipo);
  document.getElementById("hud-mision").textContent = textoMisionActiva(G.misiones);
  const pista = document.getElementById("pista-tecla");
  if (G.vehiculo) {
    const extra = npcCercaDe(G.vehiculo.mesh.position, G.npcs, 4.8);
    if (extra && hayAsiento(G.vehiculo)) pista.textContent = "E: subir a " + extra.nombre;
    else pista.textContent = "E: bajar del " + (G.vehiculo.tipo === "moto" ? "moto" : "auto");
  }
  else if (vehiculoCercano(G.jugador, G.vehiculos)) pista.textContent = "E: subir al vehículo";
  else if (avionCercano(G.jugador.mesh.position, G.mundo.avion, 8)) pista.textContent = "E: volar en el avión";
  else if (tiendaCercana(G.jugador.mesh.position, 6)) pista.textContent = "E: entrar a la tienda";
  else if (npcCercano(G.jugador, G.npcs)) pista.textContent = "E: hablar · F: pegar";
  else pista.textContent = "E: hablar / subir · F: pegar";
}

function tickAvisos(dt) {
  const G = JUEGO;
  if (G.avisoTimer > 0) {
    G.avisoTimer -= dt;
    if (G.avisoTimer <= 0) document.getElementById("aviso").classList.remove("visible");
  }
  if (G.dialogoTimer > 0) {
    G.dialogoTimer -= dt;
    if (G.dialogoTimer <= 0) document.getElementById("dialogo").classList.remove("visible");
  }
}
