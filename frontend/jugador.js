/*
  Movimiento del jugador y cámara detrás.
*/
function crearJugador() {
  const mesh = crearMuneco({
    ropa: 0x2f6fed,
    pantalon: 0x1b2838,
    gorra: 0xffb703,
    pelo: 0x4a2c14,
    ojos: 0x3a6ea5,
    tieneGorra: false,
  });
  mesh.position.set(SPAWN.x, 0, SPAWN.z + 8);
  return {
    mesh: mesh,
    yaw: 0,
    vy: 0,
    enSuelo: true,
    nadando: false,
    corriendo: false,
    velocidadCorrer: 13,
    velocidadNadar: 4.2,
    salto: 8.5,
    paso: 0,
  };
}

function animarMuñeco(mesh, andando, dt, rapido) {
  const p = mesh.userData.partes;
  if (!p) return;
  mesh.userData.tIdle = (mesh.userData.tIdle || 0) + dt;
  if (p.cabeza) p.cabeza.position.y = 1.92 + Math.sin(mesh.userData.tIdle * 2.2) * 0.012;
  if (p.ojos) {
    const parpadeo = mesh.userData.tIdle % 4.2 > 4.05;
    p.ojos.forEach((o) => {
      o.scale.y = parpadeo ? 0.12 : 1;
    });
  }
  if (andando) {
    mesh.userData.t = (mesh.userData.t || 0) + dt * (rapido ? 14 : 9);
    const o = Math.sin(mesh.userData.t);
    p.piernaI.rotation.x = o * 0.7;
    p.piernaD.rotation.x = -o * 0.7;
    p.brazoI.rotation.x = -o * 0.5;
    p.brazoD.rotation.x = o * 0.5;
  } else {
    p.piernaI.rotation.x *= 0.8;
    p.piernaD.rotation.x *= 0.8;
    p.brazoI.rotation.x *= 0.8;
    p.brazoD.rotation.x *= 0.8;
  }
}

function actualizarJugador(jugador, dt, teclas, mundo, toques) {
  const adelante = teclas.KeyW || teclas.ArrowUp || toques.arriba;
  const atras = teclas.KeyS || teclas.ArrowDown || toques.abajo;
  const izq = teclas.KeyA || teclas.ArrowLeft || toques.izq;
  const der = teclas.KeyD || teclas.ArrowRight || toques.der;
  const correr = teclas.ShiftLeft || teclas.ShiftRight || toques.correr;
  const saltar = teclas.Space || toques.saltar;
  const pos = jugador.mesh.position;
  jugador.nadando = zonaEn(pos.x, pos.z) === "agua" && pos.y < 1.2;
  jugador.corriendo = !!(correr && !jugador.nadando && jugador.enSuelo);
  if (izq) jugador.yaw += 2.1 * dt;
  if (der) jugador.yaw -= 2.1 * dt;
  jugador.mesh.rotation.y = jugador.yaw;
  let vel = 7;
  if (jugador.corriendo) vel = jugador.velocidadCorrer;
  if (jugador.nadando) vel = jugador.velocidadNadar;
  if (atras) vel *= 0.55;
  let dx = 0;
  let dz = 0;
  if (adelante || atras) {
    const signo = adelante ? -1 : 1;
    dx = Math.sin(jugador.yaw) * vel * dt * signo;
    dz = Math.cos(jugador.yaw) * vel * dt * signo;
  }
  const nx = THREE.MathUtils.clamp(pos.x + dx, -MITAD_MAPA + 4, MITAD_MAPA - 4);
  const nz = THREE.MathUtils.clamp(pos.z + dz, -MITAD_MAPA + 4, MITAD_MAPA - 4);
  if (!chocaCaja(nx, nz, mundo.cajas)) {
    pos.x = nx;
    pos.z = nz;
  }
  const suelo = alturaEn(pos.x, pos.z);
  if (saltar && (jugador.enSuelo || jugador.nadando)) {
    jugador.vy = jugador.nadando ? 4 : jugador.salto;
    jugador.enSuelo = false;
  }
  jugador.vy -= (jugador.nadando ? 6 : 26) * dt;
  const vyAntes = jugador.vy;
  pos.y += jugador.vy * dt;
  const piso = jugador.nadando ? AGUA_Y + 0.35 : suelo;
  if (pos.y <= piso) {
    pos.y = piso;
    if (!jugador.nadando && jugador.enSuelo === false && vyAntes < -14) {
      lastimar(Math.min(55, Math.floor((-vyAntes - 14) * 5)), "Caíste de muy alto.");
    }
    jugador.vy = 0;
    jugador.enSuelo = !jugador.nadando;
  }
  animarMuñeco(jugador.mesh, !!(adelante || atras) && (jugador.enSuelo || jugador.nadando), dt, jugador.corriendo);
  jugador.mesh.rotation.x = jugador.nadando ? 0.35 : 0;
  return { zona: zonaEn(pos.x, pos.z) };
}

function seguirCamara(camara, objetivo, yaw, lejos, dt) {
  const dist = lejos || 8.5;
  const alto = lejos ? 4.4 : 3.6;
  const deseada = new THREE.Vector3(
    objetivo.x + Math.sin(yaw) * dist,
    objetivo.y + alto,
    objetivo.z + Math.cos(yaw) * dist
  );
  camara.position.lerp(deseada, 1 - Math.pow(0.001, dt));
  camara.lookAt(objetivo.x, objetivo.y + 1.6, objetivo.z);
}
