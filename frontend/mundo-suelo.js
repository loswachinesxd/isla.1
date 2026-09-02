/*
  Suelo, agua y armar la isla.
*/
function crearSuelo() {
  const geo = new THREE.PlaneGeometry(LADO_MAPA, LADO_MAPA, 128, 128);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colores = [];
  const color = new THREE.Color();
  const hierba = new THREE.Color(0x4a8f3a);
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const zona = zonaEn(x, z);
    pos.setY(i, alturaEn(x, z));
    color.copy(colorZona(zona));
    const tierra = new THREE.Color(0x5c4030);
    const mancha = (ruidoSuave(x * 0.07, z * 0.07) - 0.5) * 0.16;
    color.lerp(tierra, 0.18 + ruidoSuave(x * 0.13, z * 0.13) * 0.22);
    color.r = Math.min(1, Math.max(0, color.r + mancha));
    color.g = Math.min(1, Math.max(0, color.g + mancha * 0.85));
    color.b = Math.min(1, Math.max(0, color.b + mancha * 0.4));
    if (zona === "bosque") color.lerp(hierba, 0.28 * ruidoSuave(x * 0.2, z * 0.2));
    if (zona === "pradera") color.lerp(hierba, 0.35);
    if (zona === "montana" && pos.getY(i) > 12) color.lerp(new THREE.Color(0xffffff), 0.55);
    if (zona === "nieve") color.lerp(new THREE.Color(0xffffff), 0.7);
    colores.push(color.r, color.g, color.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colores, 3));
  geo.computeVertexNormals();
  const suelo = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.97, metalness: 0 })
  );
  suelo.receiveShadow = true;
  return suelo;
}

function crearAgua() {
  const agua = new THREE.Mesh(
    new THREE.PlaneGeometry(900, 900, 40, 40),
    new THREE.MeshStandardMaterial({
      color: 0x0f5f9a,
      transparent: true,
      opacity: 0.8,
      roughness: 0.05,
      metalness: 0.38,
    })
  );
  agua.rotation.x = -Math.PI / 2;
  agua.position.set(420, AGUA_Y, 420);
  return agua;
}

function crearNubes() {
  const nubes = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0xf7fbff, transparent: true, opacity: 0.88, fog: false });
  const n = esMovil() ? 12 : 22;
  for (let i = 0; i < n; i += 1) {
    const nube = new THREE.Group();
    for (let b = 0; b < 5; b += 1) {
      const bola = new THREE.Mesh(new THREE.SphereGeometry(7 + (b % 3), 8, 6), mat);
      bola.position.set((b - 1.4) * 7, (b % 2) * 2.2, (b % 3) * 3 - 3);
      nube.add(bola);
    }
    nube.scale.set(1.6, 0.58, 1.2);
    nube.position.set((i % 8) * 140 - 520, 52 + (i % 4) * 8, Math.floor(i / 8) * 220 - 260);
    nubes.add(nube);
  }
  return nubes;
}

function actualizarAgua(agua, tiempo) {
  agua.position.y = AGUA_Y + Math.sin(tiempo * 1.4) * 0.08;
}

function actualizarNubes(nubes, dt) {
  if (!nubes) return;
  nubes.children.forEach((nube, i) => {
    nube.position.x += (4 + (i % 3)) * dt;
    if (nube.position.x > MITAD_MAPA + 80) nube.position.x = -MITAD_MAPA - 80;
  });
}
