/*
  Cosas 3D de las misiones.
*/
function crearMarcador(escena, color) {
  const palo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.35 })
  );
  palo.position.y = 1.6;
  const bola = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 10, 8),
    new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.5 })
  );
  bola.position.y = 3.4;
  const g = new THREE.Group();
  g.add(palo, bola);
  escena.add(g);
  return g;
}

function crearConchas(escena, puntos) {
  return crearPickup(escena, puntos, { color: 0xffe0c2, r: 0.28, escalaY: 0.45, y: 0.2 });
}

function crearManzanas(escena, puntos) {
  return crearPickup(escena, puntos, { color: 0xe63946 });
}

function crearFlores(escena, puntos) {
  return puntos.map((p) => {
    const g = new THREE.Group();
    const tallo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.05, 0.45, 6),
      new THREE.MeshStandardMaterial({ color: 0x2d6a32 })
    );
    tallo.position.y = 0.22;
    const flor = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xff85a1, roughness: 0.45 })
    );
    flor.position.y = 0.48;
    const centro = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xffe066 })
    );
    centro.position.y = 0.52;
    g.add(tallo, flor, centro);
    g.position.set(p.x, alturaEn(p.x, p.z), p.z);
    escena.add(g);
    return { mesh: g, tomada: false, x: p.x, z: p.z };
  });
}

function crearBoya(escena, punto) {
  const g = new THREE.Group();
  const cuerpo = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xff3b3b, roughness: 0.35, metalness: 0.2 })
  );
  cuerpo.position.y = 0.5;
  const anillo = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.08, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
  );
  anillo.rotation.x = Math.PI / 2;
  anillo.position.y = 0.5;
  const palo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xf4f4f4 })
  );
  palo.position.y = 1.3;
  g.add(cuerpo, anillo, palo);
  g.position.set(punto.x, AGUA_Y + 0.15, punto.z);
  escena.add(g);
  return { mesh: g, x: punto.x, z: punto.z };
}

function crearTesoro(escena, punto) {
  const g = new THREE.Group();
  const caja = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.55, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 })
  );
  caja.position.y = 0.28;
  const tapa = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.12, 0.62),
    new THREE.MeshStandardMaterial({ color: 0x6f4518, roughness: 0.65 })
  );
  tapa.position.y = 0.58;
  const broche = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.1, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.6, roughness: 0.3 })
  );
  broche.position.set(0, 0.42, 0.32);
  g.add(caja, tapa, broche);
  g.position.set(punto.x, alturaEn(punto.x, punto.z), punto.z);
  escena.add(g);
  return { mesh: g, tomado: false, x: punto.x, z: punto.z };
}

function crearGato(escena, punto) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x8d99ae, roughness: 0.7 });
  const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mat);
  cuerpo.scale.set(1.3, 0.8, 1.8);
  cuerpo.position.y = 0.28;
  const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), mat);
  cabeza.position.set(0, 0.48, -0.32);
  const cola = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.55, 6), mat);
  cola.rotation.z = 0.7;
  cola.position.set(0.2, 0.4, 0.35);
  g.add(cuerpo, cabeza, cola);
  g.position.set(punto.x, alturaEn(punto.x, punto.z), punto.z);
  escena.add(g);
  return { mesh: g, encontrado: false, x: punto.x, z: punto.z };
}
