/*
  El personaje en tercera persona.

  Maxi: tercera persona significa que la cámara va DETRÁS
  de vos, como si alguien filmara tu espalda. No ves por
  tus ojos (eso sería primera persona).

  "Gráficos más altos" acá = más piezas (ojos, pelo, zapatos),
  no Unreal. Tu Mac sigue andando liviana.
*/

function crearMuñeco(colores) {
  const grupo = new THREE.Group();
  const piel = colores.piel || 0xe8b896;
  const ropa = colores.ropa || 0x3a7bd5;
  const pantalon = colores.pantalon || 0x2c3e50;
  const pelo = colores.pelo || 0x3b2416;
  const zapatos = colores.zapatos || 0x1a1a1a;

  const matPiel = new THREE.MeshStandardMaterial({
    color: piel,
    roughness: 0.48,
    metalness: 0.04,
  });
  const matRopa = new THREE.MeshStandardMaterial({
    color: ropa,
    roughness: 0.62,
    metalness: 0.08,
  });
  const matPantalon = new THREE.MeshStandardMaterial({
    color: pantalon,
    roughness: 0.7,
  });
  const matPelo = new THREE.MeshStandardMaterial({
    color: pelo,
    roughness: 0.85,
  });
  const matZapato = new THREE.MeshStandardMaterial({
    color: zapatos,
    roughness: 0.4,
    metalness: 0.15,
  });

  const cadera = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 10),
    matPantalon
  );
  cadera.position.y = 0.78;
  cadera.castShadow = true;

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.3, 0.78, 12),
    matRopa
  );
  torso.position.y = 1.22;
  torso.castShadow = true;

  const hombros = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.3, 0.18, 12),
    matRopa
  );
  hombros.rotation.z = Math.PI / 2;
  hombros.position.y = 1.55;
  hombros.castShadow = true;

  const cuello = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.1, 0.16, 10),
    matPiel
  );
  cuello.position.y = 1.7;

  const cabeza = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 16, 14),
    matPiel
  );
  cabeza.position.y = 1.92;
  cabeza.castShadow = true;

  const cabello = new THREE.Mesh(
    new THREE.SphereGeometry(0.275, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
    matPelo
  );
  cabello.position.set(0, 2.02, 0);
  cabello.rotation.x = 0.15;
  cabello.castShadow = true;

  function ojo(lado) {
    const blanco = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3 })
    );
    blanco.position.set(lado * 0.09, 1.95, 0.2);
    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 8, 6),
      new THREE.MeshStandardMaterial({ color: colores.ojos || 0x3d5a80, roughness: 0.2 })
    );
    iris.position.set(lado * 0.09, 1.95, 0.235);
    return [blanco, iris];
  }

  const nariz = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 8, 6),
    matPiel
  );
  nariz.position.set(0, 1.88, 0.24);

  const gorra = new THREE.Mesh(
    new THREE.CylinderGeometry(0.29, 0.3, 0.12, 12),
    new THREE.MeshStandardMaterial({ color: colores.gorra || 0x1d3557, roughness: 0.55 })
  );
  gorra.position.y = 2.16;
  gorra.visible = !!colores.tieneGorra;
  const visera = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.03, 0.16),
    gorra.material
  );
  visera.position.set(0, 2.12, 0.28);
  visera.visible = !!colores.tieneGorra;
  gorra.userData.visera = visera;

  function armarPierna(lado) {
    const g = new THREE.Group();
    g.position.set(lado * 0.13, 0.78, 0);
    const pierna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.09, 0.7, 10),
      matPantalon
    );
    pierna.position.y = -0.35;
    pierna.castShadow = true;
    const pie = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.24), matZapato);
    pie.position.set(0, -0.74, 0.04);
    pie.castShadow = true;
    g.add(pierna, pie);
    return g;
  }

  function armarBrazo(lado) {
    const g = new THREE.Group();
    g.position.set(lado * 0.4, 1.52, 0);
    const brazo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.07, 0.62, 10),
      matRopa
    );
    brazo.position.y = -0.28;
    brazo.castShadow = true;
    const mano = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), matPiel);
    mano.position.y = -0.62;
    g.add(brazo, mano);
    return g;
  }

  const piernaI = armarPierna(-1);
  const piernaD = armarPierna(1);
  const brazoI = armarBrazo(-1);
  const brazoD = armarBrazo(1);
  const ojos = ojo(-1).concat(ojo(1));

  grupo.add(
    cadera,
    torso,
    hombros,
    cuello,
    cabeza,
    cabello,
    nariz,
    gorra,
    visera,
    piernaI,
    piernaD,
    brazoI,
    brazoD
  );
  ojos.forEach((o) => grupo.add(o));
  grupo.userData.partes = { piernaI, piernaD, brazoI, brazoD, gorra, visera, cabeza };
  return grupo;
}

function crearJugador() {
  const mesh = crearMuñeco({
    ropa: 0x2f6fed,
    pantalon: 0x1b2838,
    gorra: 0xffb703,
    pelo: 0x4a2c14,
    ojos: 0x3a6ea5,
    tieneGorra: false,
  });
  mesh.position.set(SPAWN.x, 0, SPAWN.z + 8);
  return {
    mesh,
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
  const gravedad = jugador.nadando ? 6 : 26;

  if (saltar && (jugador.enSuelo || jugador.nadando)) {
    jugador.vy = jugador.nadando ? 4 : jugador.salto;
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
