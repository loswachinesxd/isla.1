/*
  Cactus, juncos, pasto y un montículo de tierra.
*/
function monticuloTierra() {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 7, 5),
    matPlanta(0x5c4030, 1)
  );
  m.scale.set(1.3, 0.35, 1.3);
  m.position.y = 0.08;
  return m;
}

function crearCactus() {
  const g = new THREE.Group();
  const verde = matPlanta(0x2f7d4a, 0.75);
  const palo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 2.4, 8), verde);
  palo.position.y = 1.2;
  const brazo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.9, 7), verde);
  brazo.position.set(0.35, 1.5, 0);
  brazo.rotation.z = 0.9;
  g.add(palo, brazo, monticuloTierra());
  return g;
}

function crearJunco() {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i += 1) {
    const j = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 1.4, 5), matPlanta(0x4d6b32, 0.9));
    j.position.set((i - 1.5) * 0.12, 0.7, (i % 2) * 0.1);
    j.rotation.z = (i - 1.5) * 0.08;
    g.add(j);
  }
  return g;
}

function crearMataPradera() {
  const g = new THREE.Group();
  const pasto = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.7, 6), matPlanta(0x7cb342, 0.95));
  pasto.position.y = 0.32;
  const flor = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), matPlanta(0xffeb3b, 0.6));
  flor.position.y = 0.72;
  g.add(pasto, flor);
  return g;
}

function crearPinoNieve() {
  const g = crearPino();
  g.children.forEach((h, i) => {
    if (i > 1 && h.material) h.material = matPlanta(0xdfe8e4, 0.92);
  });
  return g;
}
