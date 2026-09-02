/*
  Aeropuerto: pista, hangar y un avión para ir a otros biomas.
*/
const DESTINOS_AVION = [
  { nombre: "la plaza", x: -90, z: -82 },
  { nombre: "el desierto", x: 640, z: 40 },
  { nombre: "la nieve", x: -540, z: 640 },
  { nombre: "el pantano", x: -450, z: -640 },
  { nombre: "la playa", x: 90, z: 70 },
  { nombre: "el bosque", x: 140, z: -140 },
];

function crearAvion() {
  const g = new THREE.Group();
  const fuselaje = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.7, 6.2, 10),
    new THREE.MeshStandardMaterial({ color: 0xdce3ea, metalness: 0.35, roughness: 0.4 })
  );
  fuselaje.rotation.z = Math.PI / 2;
  fuselaje.position.y = 1.1;
  const ala = new THREE.Mesh(
    new THREE.BoxGeometry(8.5, 0.12, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.5 })
  );
  ala.position.y = 1.15;
  const cola = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.3, 1.1),
    new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.45 })
  );
  cola.position.set(-2.7, 1.7, 0);
  g.add(fuselaje, ala, cola);
  return g;
}

function crearAeropuerto(grupo, cajas, puntos) {
  const x = puntos.aeropuerto.x;
  const z = puntos.aeropuerto.z;
  const pista = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.12, 120),
    new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.92 })
  );
  pista.position.set(x, alturaEn(x, z) + 0.08, z);
  pista.receiveShadow = true;
  const linea = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.13, 110),
    new THREE.MeshStandardMaterial({ color: 0xf4f1de })
  );
  linea.position.set(x, alturaEn(x, z) + 0.14, z);
  grupo.add(pista, linea);
  agregarEdificio(grupo, cajas, crearEdificio(x - 28, z + 20, 16, 18, 8, 0x8d99ae, 0x1d3557));
  const torre = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.8, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xadb5bd, roughness: 0.55, metalness: 0.15 })
  );
  torre.position.set(x + 22, 6, z + 28);
  const cabina = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 2.2, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x90e0ef, roughness: 0.3, transparent: true, opacity: 0.75 })
  );
  cabina.position.set(x + 22, 13, z + 28);
  grupo.add(torre, cabina);
  const avion = crearAvion();
  avion.position.set(puntos.avion.x, alturaEn(puntos.avion.x, puntos.avion.z) + 0.2, puntos.avion.z);
  avion.rotation.y = 0.4;
  grupo.add(avion);
  return avion;
}

function avionCercano(pos, avion, dist) {
  if (!avion) return false;
  return pos.distanceTo(avion.position) < (dist || 7);
}

function volarEnAvion() {
  const G = JUEGO;
  G.vueloI = (G.vueloI || 0) + 1;
  const d = DESTINOS_AVION[G.vueloI % DESTINOS_AVION.length];
  G.jugador.mesh.position.set(d.x, alturaEn(d.x, d.z), d.z);
  G.jugador.vy = 0;
  avisar("El avión te dejó en " + d.nombre + ".");
  ponerChat("isla", "Aterrizaste en " + d.nombre + ".");
}
