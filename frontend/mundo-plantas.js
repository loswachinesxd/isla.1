/*
  Árboles y rocas. Pino o copa redonda, según el lugar.
*/
function crearArbol(x, z, y) {
  const grupo = new THREE.Group();
  const r = ruido(x * 0.31, z * 0.29);
  const pino = r > 0.52;
  const matTronco = new THREE.MeshStandardMaterial({ color: 0x5a3820, roughness: 1 });
  if (pino) {
    const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 3.4, 7), matTronco);
    tronco.position.y = 1.7;
    tronco.castShadow = true;
    grupo.add(tronco);
    [2.15, 3.05, 3.9].forEach((h, i) => {
      const copa = new THREE.Mesh(
        new THREE.ConeGeometry(1.55 - i * 0.38, 1.55, 8),
        new THREE.MeshStandardMaterial({ color: i % 2 ? 0x1a4a26 : 0x2a6b34, roughness: 0.88 })
      );
      copa.position.y = h;
      copa.castShadow = true;
      grupo.add(copa);
    });
  } else {
    const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.38, 2.7, 8), matTronco);
    tronco.position.y = 1.35;
    tronco.castShadow = true;
    grupo.add(tronco);
    const verdes = [0x2c6e34, 0x3d8a40, 0x1f5c28];
    [
      [0, 2.55, 0, 1.4],
      [0.55, 3.15, -0.2, 1.05],
      [-0.45, 3.05, 0.35, 0.95],
      [0.15, 3.7, 0.1, 0.8],
    ].forEach((p, i) => {
      const copa = new THREE.Mesh(
        new THREE.SphereGeometry(p[3], 8, 6),
        new THREE.MeshStandardMaterial({ color: verdes[i % 3], roughness: 0.86 })
      );
      copa.position.set(p[0], p[1], p[2]);
      copa.castShadow = true;
      grupo.add(copa);
    });
  }
  grupo.position.set(x, y, z);
  return grupo;
}

function crearRoca(x, z, y, escala) {
  const roca = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.2, 0),
    new THREE.MeshStandardMaterial({ color: 0x8f98a3, roughness: 1 })
  );
  roca.position.set(x, y + 0.7 * escala, z);
  roca.scale.setScalar(escala);
  roca.rotation.set(0.2, x * 0.1, 0.1);
  roca.castShadow = true;
  return roca;
}
