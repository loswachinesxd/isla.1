/*
  Comandos: empiezan con /. Algunos son de director.
*/
function exigirAdmin() {
  if (JUEGO.esAdmin) return true;
  ponerChat("sistema", "Eso es de director. /admin y la clave secreta.");
  return false;
}

function teletransportar(lugar) {
  const mapa = {
    plaza: SPAWN,
    playa: { x: 90, z: 70 },
    bosque: { x: 120, z: -120 },
    cima: { x: -330, z: 340 },
    aeropuerto: { x: 520, z: -560 },
    desierto: { x: 640, z: 40 },
    nieve: { x: -540, z: 640 },
    pantano: { x: -450, z: -640 },
    pradera: { x: 320, z: -480 },
    secreto: LUGAR_SECRETO,
  };
  const p = mapa[lugar];
  if (!p) {
    ponerChat("sistema", "Lugares: plaza playa bosque cima aeropuerto desierto nieve pantano pradera.");
    return;
  }
  const j = JUEGO.jugador;
  j.mesh.position.set(p.x, alturaEn(p.x, p.z), p.z);
  j.vy = 0;
  ponerChat("sistema", "Fuiste a " + lugar + ".");
}

function correrComando(linea) {
  const partes = linea.slice(1).trim().split(/\s+/);
  const cmd = (partes[0] || "").toLowerCase();
  const a = partes[1] || "";
  if (cmd === "ayuda") {
    ponerChat("sistema", "/donde /admin clave. Director: /vida 100 /plata 50 /tp plaza");
    return;
  }
  if (cmd === "donde") {
    const p = JUEGO.jugador.mesh.position;
    ponerChat("sistema", "Estás en " + nombreZona(zonaEn(p.x, p.z)) + ".");
    return;
  }
  if (cmd === "admin") {
    if (esClaveDirector(a)) {
      JUEGO.esAdmin = true;
      ponerChat("sistema", "Modo director ON. Cuidado: son trucos de prueba.");
      avisar("Sos el director de la isla.");
    } else ponerChat("sistema", "Clave incorrecta.");
    return;
  }
  if (cmd === "secreto") {
    ponerChat("sistema", "Hay una piedra violeta lejos, en las montañas.");
    return;
  }
  if (cmd === "vida") {
    if (a) {
      if (!exigirAdmin()) return;
      JUEGO.vida = Math.max(1, Math.min(100, Number(a) || 100));
      pintarVida();
    }
    ponerChat("sistema", "Vida " + Math.round(JUEGO.vida) + "/100.");
    return;
  }
  if (cmd === "plata") {
    if (!exigirAdmin()) return;
    JUEGO.dinero = Math.max(0, Number(a) || 0);
    guardar();
    ponerChat("sistema", "Ahora tenés $" + JUEGO.dinero + ".");
    return;
  }
  if (cmd === "tp") {
    if (!exigirAdmin()) return;
    teletransportar(a.toLowerCase());
    return;
  }
  ponerChat("sistema", "No conozco /" + cmd + ". Probá /ayuda.");
}
