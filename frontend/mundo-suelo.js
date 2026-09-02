/*
  Suelo, agua y armar la isla.
*/
function crearSuelo() {
  const geo = new THREE.PlaneGeometry(LADO_MAPA, LADO_MAPA, 96, 96);
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
    const mancha = (ruidoSuave(x * 0.09, z * 0.09) - 0.5) * 0.1;
    color.r = Math.min(1, Math.max(0, color.r + mancha));
    color.g = Math.min(1, Math.max(0, color.g + mancha));
    color.b = Math.min(1, Math.max(0, color.b + mancha * 0.55));
    if (zona === "bosque") color.lerp(hierba, 0.25 * ruidoSuave(x * 0.2, z * 0.2));
    if (zona === "montana" && pos.getY(i) > 12) color.lerp(new THREE.Color(0xffffff), 0.55);
    colores.push(color.r, color.g, color.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colores, 3));
  geo.computeVertexNormals();
  const suelo = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94, metalness: 0 })
  );
  suelo.receiveShadow = true;
  return suelo;
}

function crearAgua() {
  const agua = new THREE.Mesh(
    new THREE.PlaneGeometry(520, 520, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x0f5f9a,
      transparent: true,
      opacity: 0.8,
      roughness: 0.05,
      metalness: 0.38,
    })
  );
  agua.rotation.x = -Math.PI / 2;
  agua.position.set(250, AGUA_Y, 250);
  return agua;
}

function crearNubes() {
  const nubes = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0xf7fbff, transparent: true, opacity: 0.88, fog: false });
  for (let i = 0; i < 16; i += 1) {
    const nube = new THREE.Group();
    for (let b = 0; b < 4; b += 1) {
      const bola = new THREE.Mesh(new THREE.SphereGeometry(7 + (b % 3), 8, 6), mat);
      bola.position.set((b - 1.4) * 7, (b % 2) * 2.2, (b % 3) * 3 - 3);
      nube.add(bola);
    }
    nube.scale.set(1.5, 0.55, 1.1);
    nube.position.set((i % 8) * 110 - 380, 46 + (i % 4) * 7, Math.floor(i / 8) * 200 - 180);
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
    if (nube.position.x > 520) nube.position.x = -520;
  });
}
