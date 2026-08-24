/*
  El personaje en tercera persona.

  Maxi: tercera persona significa que la cámara va DETRÁS
  de vos, como si alguien filmara tu espalda. No ves por
  tus ojos (eso sería primera persona).
*/

function crearMuñeco(colores) {
  const grupo = new THREE.Group();
  const piel = colores.piel || 0xf1c27d;
  const ropa = colores.ropa || 0x3a7bd5;
  const pantalon = colores.pantalon || 0x2c3e50;

  const cuerpo = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.9, 0.45),
    new THREE.MeshStandardMaterial({ color: ropa, roughness: 0.7 })
  );
  cuerpo.position.y = 1.15;
  cuerpo.castShadow = true;

  const cabeza = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 10, 8),
    new THREE.MeshStandardMaterial({ color: piel, roughness: 0.8 })
  );
  cabeza.position.y = 1.85;
  cabeza.castShadow = true;

  const gorra = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.14, 10),
    new THREE.MeshStandardMaterial({ color: colores.gorra || 0x1d3557 })
  );
  gorra.position.y = 2.1;
  gorra.visible = !!colores.tieneGorra;

  function pata(lado) {
    const p = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.7, 0.24),
      new THREE.MeshStandardMaterial({ color: pantalon })
    );
    p.position.set(lado * 0.18, 0.45, 0);
    p.castShadow = true;
    return p;
  }

  function brazo(lado) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.7, 0.18),
      new THREE.MeshStandardMaterial({ color: ropa })
    );
    b.position.set(lado * 0.48, 1.15, 0);
    b.castShadow = true;
    return b;
  }

  const piernaI = pata(-1);
  const piernaD = pata(1);
  const brazoI = brazo(-1);
  const brazoD = brazo(1);

  grupo.add(cuerpo, cabeza, gorra, piernaI, piernaD, brazoI, brazoD);
  grupo.userData.partes = { piernaI, piernaD, brazoI, brazoD, gorra, cabeza };
  return grupo;
}

function crearJugador() {
  const mesh = crearMuñeco({ ropa: 0x3a7bd5, pantalon: 0x1b2838, gorra: 0xffb703 });
  mesh.position.set(SPAWN.x, 0, SPAWN.z + 8);
  return {
    mesh,
    yaw: 0,
    vy: 0,
    enSuelo: true,
    nadando: false,
    corriendo: false,
    velocidadCorrer: 13,
    paso: 0,
  };
}

function animarMuñeco(mesh, andando, dt, rapido) {
  const p = mesh.userData.partes;
  if (!p) return;
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
  const zona = zonaEn(pos.x, pos.z);
  jugador.nadando = zona === "agua" && pos.y < 1.2;
  jugador.corriendo = !!(correr && !jugador.nadando && jugador.enSuelo);

  if (izq) jugador.yaw += 2.1 * dt;
  if (der) jugador.yaw -= 2.1 * dt;
  jugador.mesh.rotation.y = jugador.yaw;

  let vel = 7;
  if (jugador.corriendo) vel = jugador.velocidadCorrer;
  if (jugador.nadando) vel = 4.2;
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
  const gravedad = jugador.nadando ? 6 : 26;

  if (saltar && (jugador.enSuelo || jugador.nadando)) {
    jugador.vy = jugador.nadando ? 4 : 8.5;
    jugador.enSuelo = false;
  }

  jugador.vy -= gravedad * dt;
  pos.y += jugador.vy * dt;

  const piso = jugador.nadando ? AGUA_Y + 0.35 : suelo;
  if (pos.y <= piso) {
    pos.y = piso;
    jugador.vy = 0;
    jugador.enSuelo = !jugador.nadando;
  }

  const andando = !!(adelante || atras);
  animarMuñeco(jugador.mesh, andando && (jugador.enSuelo || jugador.nadando), dt, jugador.corriendo);
  if (jugador.nadando) {
    jugador.mesh.rotation.x = 0.35;
  } else {
    jugador.mesh.rotation.x = 0;
  }

  return { andando, zona };
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
