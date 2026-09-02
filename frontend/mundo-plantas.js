/*
  Árboles más dibujados: pino, copa, palmera y arbusto.
*/
function matPlanta(color, roughness) {
  return new THREE.MeshStandardMaterial({ color: color, roughness: roughness || 0.86 });
}

function crearPino() {
  const g = new THREE.Group();
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.32, 4.2, 8), matPlanta(0x5a3820, 1));
  tronco.position.y = 2.1;
  g.add(tronco);
  g.add(monticuloTierra());
  [2.2, 3.15, 4.05, 4.85].forEach((h, i) => {
    const copa = new THREE.Mesh(new THREE.ConeGeometry(1.7 - i * 0.32, 1.45, 9), matPlanta(i % 2 ? 0x163d22 : 0x2a6b34));
    copa.position.y = h;
    g.add(copa);
  });
  return g;
}

function crearFrondoso() {
  const g = new THREE.Group();
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, 3.1, 8), matPlanta(0x4a2c14, 1));
  tronco.position.y = 1.55;
  g.add(tronco);
  g.add(monticuloTierra());
  const verdes = [0x2c6e34, 0x3d8a40, 0x1f5c28, 0x4c9a45];
  [
    [0, 2.7, 0, 1.55],
    [0.7, 3.35, -0.25, 1.15],
    [-0.55, 3.25, 0.4, 1.05],
    [0.2, 4.05, 0.15, 0.9],
    [-0.35, 3.7, -0.5, 0.75],
    [0.55, 3.85, 0.45, 0.7],
  ].forEach((p, i) => {
    const copa = new THREE.Mesh(new THREE.SphereGeometry(p[3], 9, 7), matPlanta(verdes[i % 4]));
    copa.position.set(p[0], p[1], p[2]);
    g.add(copa);
  });
  return g;
}

function crearPalmera() {
  const g = new THREE.Group();
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 5.2, 8), matPlanta(0x8a5a2b, 0.95));
  tronco.position.y = 2.6;
  tronco.rotation.z = 0.08;
  g.add(tronco);
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    const hoja = new THREE.Mesh(new THREE.ConeGeometry(0.18, 2.4, 6), matPlanta(0x2d8a4a, 0.7));
    hoja.position.set(Math.sin(a) * 0.2, 5.15, Math.cos(a) * 0.2);
    hoja.rotation.z = 1.05;
    hoja.rotation.y = a;
    g.add(hoja);
  }
  const coco = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 5), matPlanta(0x6b3a12, 0.8));
  coco.position.y = 5.05;
  g.add(coco);
  g.add(monticuloTierra());
  return g;
}

function crearArbusto() {
  const g = new THREE.Group();
  const a = new THREE.Mesh(new THREE.SphereGeometry(0.55, 7, 6), matPlanta(0x2f6b32));
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.4, 7, 6), matPlanta(0x3d8a40));
  b.position.set(0.35, 0.1, -0.1);
  a.position.y = 0.45;
  b.position.y = 0.4;
  g.add(a, b);
  return g;
}

function crearArbol(x, z, y) {
  const zona = zonaEn(x, z);
  const r = ruido(x * 0.31, z * 0.29);
  let grupo;
  if (zona === "playa") grupo = crearPalmera();
  else if (zona === "desierto") grupo = crearCactus();
  else if (zona === "nieve") grupo = crearPinoNieve();
  else if (zona === "pantano") grupo = crearJunco();
  else if (zona === "pradera") grupo = crearMataPradera();
  else if (zona === "montana" || r > 0.55) grupo = crearPino();
  else grupo = crearFrondoso();
  grupo.traverse(function (m) {
    if (m.isMesh) m.castShadow = r > 0.4;
  });
  grupo.position.set(x, y, z);
  grupo.rotation.y = r * 6;
  grupo.scale.setScalar(0.85 + r * 0.45);
  return grupo;
}

function crearRoca(x, z, y, escala) {
  const roca = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.25, 0),
    matPlanta(0x8f98a3, 1)
  );
  roca.position.set(x, y + 0.7 * escala, z);
  roca.scale.setScalar(escala);
  roca.rotation.set(0.2, x * 0.1, 0.1);
  roca.castShadow = true;
  return roca;
}
