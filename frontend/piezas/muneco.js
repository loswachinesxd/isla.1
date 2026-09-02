/*
  Muneco: cuerpo con piezas. No es Unreal, es Lego cuidadoso.
*/
function matStd(color, roughness, metalness) {
  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: roughness,
    metalness: metalness || 0,
  });
}

function crearMuneco(colores) {
  const grupo = new THREE.Group();
  const piel = colores.piel || 0xe8b896;
  const matPiel = matStd(piel, 0.48, 0.04);
  const matRopa = matStd(colores.ropa || 0x3a7bd5, 0.62, 0.08);
  const matPantalon = matStd(colores.pantalon || 0x2c3e50, 0.7);
  const matPelo = matStd(colores.pelo || 0x3b2416, 0.85);
  const matZapato = matStd(colores.zapatos || 0x1a1a1a, 0.4, 0.15);
  const cadera = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), matPantalon);
  cadera.position.y = 0.78;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.78, 12), matRopa);
  torso.position.y = 1.22;
  const hombros = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.18, 12), matRopa);
  hombros.rotation.z = Math.PI / 2;
  hombros.position.y = 1.55;
  const cuello = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.16, 10), matPiel);
  cuello.position.y = 1.7;
  const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), matPiel);
  cabeza.position.y = 1.92;
  const cabello = new THREE.Mesh(
    new THREE.SphereGeometry(0.275, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
    matPelo
  );
  cabello.position.set(0, 2.02, 0);
  cabello.rotation.x = 0.15;
  [cadera, torso, hombros, cabeza, cabello].forEach((m) => {
    m.castShadow = true;
  });
  function ojo(lado) {
    const blanco = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), matStd(0xf5f5f5, 0.3));
    blanco.position.set(lado * 0.09, 1.95, 0.2);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), matStd(colores.ojos || 0x3d5a80, 0.2));
    iris.position.set(lado * 0.09, 1.95, 0.235);
    return [blanco, iris];
  }
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), matPiel);
  nariz.position.set(0, 1.88, 0.24);
  const gorra = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.3, 0.12, 12), matStd(colores.gorra || 0x1d3557, 0.55));
  gorra.position.y = 2.16;
  gorra.visible = !!colores.tieneGorra;
  const visera = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.16), gorra.material);
  visera.position.set(0, 2.12, 0.28);
  visera.visible = !!colores.tieneGorra;
  function armarPierna(lado) {
    const g = new THREE.Group();
    g.position.set(lado * 0.13, 0.78, 0);
    const pierna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.7, 10), matPantalon);
    pierna.position.y = -0.35;
    pierna.castShadow = true;
    const pie = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.24), matZapato);
    pie.position.set(0, -0.74, 0.04);
    g.add(pierna, pie);
    return g;
  }
  function armarBrazo(lado) {
    const g = new THREE.Group();
    g.position.set(lado * 0.4, 1.52, 0);
    const brazo = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.62, 10), matRopa);
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
  grupo.add(cadera, torso, hombros, cuello, cabeza, cabello, nariz, gorra, visera, piernaI, piernaD, brazoI, brazoD);
  ojo(-1).concat(ojo(1)).forEach((o) => grupo.add(o));
  grupo.userData.partes = { piernaI: piernaI, piernaD: piernaD, brazoI: brazoI, brazoD: brazoD, gorra: gorra, visera: visera, cabeza: cabeza };
  return grupo;
}
