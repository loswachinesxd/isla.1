/*
  El mapa grande.

  Maxi: imaginá una pizza cortada en 4.
  Cada trozo es una zona: ciudad, bosque, montañas y playa.

  En Unreal Engine esto se llama "Open World" y usa
  Lumen (luces que rebotan) y Nanite (muchísimos detalles).
  Acá usamos bloques simples, como Lego, para que tu Mac
  vuele rápido. Es el primo de ese motor, no el mismo.
*/

const LADO_MAPA = 420;
const MITAD_MAPA = LADO_MAPA / 2;
const SPAWN = { x: -90, z: -90 };
const AGUA_Y = -0.35;

function ruido(ix, iz) {
  const n = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function ruidoSuave(x, z) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  return (
    ruido(xi, zi) * (1 - u) * (1 - v) +
    ruido(xi + 1, zi) * u * (1 - v) +
    ruido(xi, zi + 1) * (1 - u) * v +
    ruido(xi + 1, zi + 1) * u * v
  );
}

function zonaEn(x, z) {
  if (x >= 0 && z >= 0) {
    if (x > 55 && z > 55 && x + z > 170) return "agua";
    return "playa";
  }
  if (x < 0 && z >= 0) return "montana";
  if (x >= 0 && z < 0) return "bosque";
  return "ciudad";
}

function nombreZona(zona) {
  const nombres = {
    ciudad: "Ciudad",
    bosque: "Bosque",
    montana: "Montañas",
    playa: "Playa",
    agua: "Mar",
  };
  return nombres[zona] || "Isla";
}

function esAgua(x, z) {
  return zonaEn(x, z) === "agua";
}

function alturaEn(x, z) {
  const zona = zonaEn(x, z);
  if (zona === "agua") return AGUA_Y - 0.8;
  if (zona === "playa") return 0.08 + ruidoSuave(x * 0.04, z * 0.04) * 0.25;
  if (zona === "ciudad") return 0;
  if (zona === "bosque") return ruidoSuave(x * 0.03, z * 0.03) * 2.2;
  const loma = ruidoSuave(x * 0.02, z * 0.02);
  return 1.4 + loma * 16 + ruidoSuave(x * 0.08, z * 0.08) * 2.5;
}

function colorZona(zona) {
  const colores = {
    ciudad: new THREE.Color(0x8b909a),
    bosque: new THREE.Color(0x3d8c40),
    montana: new THREE.Color(0xc5ccd4),
    playa: new THREE.Color(0xe7d089),
    agua: new THREE.Color(0x2a7ec4),
  };
  return colores[zona] || colores.ciudad;
}

function chocaCaja(x, z, cajas) {
  for (let i = 0; i < cajas.length; i += 1) {
    const c = cajas[i];
    if (x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ) return true;
  }
  return false;
}

function crearEdificio(x, z, w, d, h, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.08 })
  );
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const techo = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.4, 0.35, d + 0.4),
    new THREE.MeshStandardMaterial({ color: 0x5c6570, roughness: 0.9 })
  );
  techo.position.set(x, h + 0.1, z);
  techo.castShadow = true;
  return {
    mesh,
    techo,
    minX: x - w / 2 - 0.7,
    maxX: x + w / 2 + 0.7,
    minZ: z - d / 2 - 0.7,
    maxZ: z + d / 2 + 0.7,
  };
}

function crearArbol(x, z, y) {
  const grupo = new THREE.Group();
  const tronco = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.38, 2.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 1 })
  );
  tronco.position.y = 1.1;
  const copa = new THREE.Mesh(
    new THREE.ConeGeometry(1.6, 2.6, 7),
    new THREE.MeshStandardMaterial({ color: 0x2d6a32, roughness: 0.9 })
  );
  copa.position.y = 2.8;
  grupo.add(tronco, copa);
  grupo.position.set(x, y, z);
  return grupo;
}

function crearRoca(x, z, y, escala) {
  const roca = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.2, 0),
    new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 1 })
  );
  roca.position.set(x, y + 0.7 * escala, z);
  roca.scale.setScalar(escala);
  roca.rotation.set(0.2, x * 0.1, 0.1);
  roca.castShadow = true;
  return roca;
}

function crearSuelo() {
  const geo = new THREE.PlaneGeometry(LADO_MAPA, LADO_MAPA, 72, 72);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colores = [];
  const color = new THREE.Color();
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const zona = zonaEn(x, z);
    pos.setY(i, alturaEn(x, z));
    color.copy(colorZona(zona));
    if (zona === "montana" && pos.getY(i) > 12) color.lerp(new THREE.Color(0xffffff), 0.55);
    colores.push(color.r, color.g, color.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colores, 3));
  geo.computeVertexNormals();
  const suelo = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0,
    })
  );
  suelo.receiveShadow = true;
  return suelo;
}

function crearAgua() {
  const agua = new THREE.Mesh(
    new THREE.PlaneGeometry(230, 230, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x2b86c9,
      transparent: true,
      opacity: 0.72,
      roughness: 0.15,
      metalness: 0.2,
    })
  );
  agua.rotation.x = -Math.PI / 2;
  agua.position.set(105, AGUA_Y, 105);
  return agua;
}

function crearMundo(escena) {
  const grupo = new THREE.Group();
  const cajas = [];
  const puntos = {
    spawn: SPAWN,
    tienda: { x: -62, z: -108 },
    plaza: { x: -90, z: -90 },
    perro: { x: 92, z: -108 },
    cabana: { x: -128, z: 132 },
    conchas: [
      { x: 70, z: 48 },
      { x: 98, z: 36 },
      { x: 54, z: 78 },
      { x: 110, z: 70 },
      { x: 78, z: 96 },
    ],
    auto: { x: -118, z: -70 },
    moto: { x: -70, z: -64 },
  };

  grupo.add(crearSuelo());
  const agua = crearAgua();
  grupo.add(agua);

  const edificiosPlan = [
    [-150, -150, 14, 12, 16, 0x6e7886],
    [-150, -118, 12, 10, 11, 0x7a8490],
    [-150, -50, 13, 11, 18, 0x5f6a78],
    [-118, -150, 11, 12, 13, 0x8a909a],
    [-50, -150, 12, 10, 15, 0x6a7380],
    [-40, -118, 10, 12, 10, 0x748090],
    [-40, -50, 14, 11, 17, 0x5c6572],
    [-118, -40, 11, 10, 12, 0x7e8792],
    [-62, -40, 16, 10, 8, 0x6a7380],
    [-62, -108, 14, 10, 8, 0xd9a441],
    [-28, -78, 10, 10, 14, 0x667180],
  ];

  edificiosPlan.forEach((e) => {
    const edificio = crearEdificio(e[0], e[1], e[2], e[3], e[4], e[5]);
    grupo.add(edificio.mesh, edificio.techo);
    cajas.push(edificio);
  });

  const letrero = new THREE.Mesh(
    new THREE.BoxGeometry(6, 1.2, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xfff3c4 })
  );
  letrero.position.set(puntos.tienda.x, 9.2, puntos.tienda.z + 5.2);
  grupo.add(letrero);

  const fuente = new THREE.Mesh(
    new THREE.CylinderGeometry(4.5, 5, 0.6, 16),
    new THREE.MeshStandardMaterial({ color: 0x9bb7d4, roughness: 0.3 })
  );
  fuente.position.set(SPAWN.x, 0.3, SPAWN.z);
  grupo.add(fuente);

  for (let i = 0; i < 42; i += 1) {
    const x = 18 + (i % 7) * 24 + (i % 3) * 4;
    const z = -28 - Math.floor(i / 7) * 24 - (i % 2) * 6;
    if (x > MITAD_MAPA - 12 || z < -MITAD_MAPA + 12) continue;
    grupo.add(crearArbol(x, z, alturaEn(x, z)));
  }

  for (let i = 0; i < 16; i += 1) {
    const x = -30 - (i % 5) * 32;
    const z = 40 + Math.floor(i / 5) * 28;
    grupo.add(crearRoca(x, z, alturaEn(x, z), 1.2 + (i % 3) * 0.5));
  }

  const cabana = crearEdificio(puntos.cabana.x, puntos.cabana.z, 8, 8, 5, 0x8b5a2b);
  grupo.add(cabana.mesh, cabana.techo);
  cajas.push(cabana);

  const sombrilla = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  );
  sombrilla.position.set(62, 3.2, 42);
  grupo.add(sombrilla);

  escena.add(grupo);
  escena.fog = new THREE.Fog(0x9fd0ff, 90, 320);

  return {
    grupo,
    agua,
    cajas,
    puntos,
    lado: LADO_MAPA,
  };
}

function actualizarAgua(agua, tiempo) {
  agua.position.y = AGUA_Y + Math.sin(tiempo * 1.4) * 0.08;
}
