/*
  El mapa grande.

  Maxi: imaginá una pizza cortada en 4.
  Cada trozo es una zona: ciudad, bosque, montañas y playa.

  En Unreal Engine esto se llama "Open World" y usa
  Lumen (luces que rebotan) y Nanite (muchísimos detalles).
  Acá usamos bloques simples, como Lego, para que tu Mac
  vuele rápido. Es el primo de ese motor, no el mismo.
*/

const LADO_MAPA = 960;
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
    if (x > 120 && z > 120 && x + z > 360) return "agua";
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

function hexColor(n) {
  return "#" + n.toString(16).padStart(6, "0");
}

function texturaFachada(color, semilla, w, h) {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hexColor(color);
  ctx.fillRect(0, 0, 64, 128);
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(0, 112, 64, 16);
  for (let fila = 0; fila < 6; fila += 1) {
    for (let col = 0; col < 4; col += 1) {
      const px = 6 + col * 14;
      const py = 8 + fila * 18;
      const luz = ((Math.abs(semilla) + fila * 3 + col) % 5) !== 0;
      ctx.fillStyle = luz ? "#eaf4ff" : "#1a2430";
      ctx.fillRect(px, py, 10, 12);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(px, py, 10, 3);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(Math.max(1, Math.round(w / 7)), Math.max(1, Math.round(h / 5)));
  tex.needsUpdate = true;
  return tex;
}

function crearEdificio(x, z, w, d, h, color) {
  const extras = [];
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({
      map: texturaFachada(color, x * 10 + z, w, h),
      roughness: 0.7,
      metalness: 0.08,
    })
  );
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const techo = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.7, 0.42, d + 0.7),
    new THREE.MeshStandardMaterial({ color: 0x3d4550, roughness: 0.85 })
  );
  techo.position.set(x, h + 0.18, z);
  techo.castShadow = true;
  const cornisa = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.35, 0.18, d + 0.35),
    new THREE.MeshStandardMaterial({ color: 0x2f3540, roughness: 0.8 })
  );
  cornisa.position.set(x, h - 0.15, z);
  extras.push(cornisa);
  const puerta = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.2, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x3b2a1a, roughness: 0.65 })
  );
  puerta.position.set(x, 1.1, z + d / 2 + 0.08);
  extras.push(puerta);
  if (color === 0xd9a441) {
    const toldo = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.16, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xc1121f, roughness: 0.7 })
    );
    toldo.position.set(x, 3.1, z + d / 2 + 0.7);
    extras.push(toldo);
  }
  return {
    mesh,
    techo,
    extras,
    minX: x - w / 2 - 0.7,
    maxX: x + w / 2 + 0.7,
    minZ: z - d / 2 - 0.7,
    maxZ: z + d / 2 + 0.7,
  };
}

function crearArbol(x, z, y) {
  const grupo = new THREE.Group();
  const tipo = Math.floor(ruido(x * 0.3, z * 0.3) * 3);
  const verdes = [0x2d6a32, 0x3d8c40, 0x1f5a28];
  const verde = verdes[tipo];
  const tronco = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.4, 2.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 1 })
  );
  tronco.position.y = 1.3;
  tronco.castShadow = true;
  const copaBaja = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 8, 6),
    new THREE.MeshStandardMaterial({ color: verde, roughness: 0.88 })
  );
  copaBaja.position.y = 2.6;
  copaBaja.castShadow = true;
  const copaAlta = new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 8, 6),
    new THREE.MeshStandardMaterial({ color: verdes[(tipo + 1) % 3], roughness: 0.86 })
  );
  copaAlta.position.set(0.15, 3.5, -0.1);
  copaAlta.castShadow = true;
  grupo.add(tronco, copaBaja, copaAlta);
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
  const geo = new THREE.PlaneGeometry(LADO_MAPA, LADO_MAPA, 96, 96);
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
    const mancha = (ruidoSuave(x * 0.09, z * 0.09) - 0.5) * 0.08;
    color.r = Math.min(1, Math.max(0, color.r + mancha));
    color.g = Math.min(1, Math.max(0, color.g + mancha));
    color.b = Math.min(1, Math.max(0, color.b + mancha * 0.6));
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
    new THREE.PlaneGeometry(520, 520, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x1568a8,
      transparent: true,
      opacity: 0.78,
      roughness: 0.06,
      metalness: 0.35,
      envMapIntensity: 1.2,
    })
  );
  agua.rotation.x = -Math.PI / 2;
  agua.position.set(250, AGUA_Y, 250);
  return agua;
}

function crearMundo(escena) {
  const grupo = new THREE.Group();
  const cajas = [];
  const puntos = {
    spawn: SPAWN,
    tienda: { x: -62, z: -108 },
    plaza: { x: -90, z: -90 },
    perro: { x: 210, z: -250 },
    cabana: { x: -280, z: 290 },
    mirador: { x: -330, z: 340 },
    boya: { x: 310, z: 310 },
    tesoro: { x: 250, z: 90 },
    conchas: [
      { x: 88, z: 62 },
      { x: 140, z: 48 },
      { x: 70, z: 110 },
      { x: 168, z: 96 },
      { x: 118, z: 148 },
    ],
    flores: [
      { x: 90, z: -80 },
      { x: 140, z: -130 },
      { x: 60, z: -170 },
      { x: 180, z: -90 },
      { x: 220, z: -180 },
      { x: 110, z: -230 },
    ],
    auto: { x: -118, z: -70 },
    moto: { x: -70, z: -64 },
    gato: { x: -42, z: -48 },
    manzanas: [
      { x: 48, z: -52 },
      { x: 110, z: -88 },
      { x: 155, z: -150 },
      { x: 75, z: -200 },
      { x: 190, z: -60 },
    ],
  };

  grupo.add(crearSuelo());
  const agua = crearAgua();
  grupo.add(agua);

  const edificiosPlan = [
    [-220, -220, 16, 14, 20, 0x5a6470],
    [-220, -170, 12, 12, 14, 0x6e7886],
    [-220, -90, 14, 11, 18, 0x4f5864],
    [-170, -220, 13, 12, 16, 0x7a8490],
    [-90, -220, 12, 10, 12, 0x667180],
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
    [-280, -280, 18, 16, 22, 0x556070],
    [-280, -210, 14, 12, 16, 0x6a7380],
    [-210, -280, 13, 14, 18, 0x748090],
    [-330, -150, 12, 11, 14, 0x5f6a78],
    [-150, -330, 11, 12, 15, 0x7a8490],
  ];

  edificiosPlan.forEach((e) => {
    const edificio = crearEdificio(e[0], e[1], e[2], e[3], e[4], e[5]);
    grupo.add(edificio.mesh, edificio.techo);
    if (edificio.extras) edificio.extras.forEach((p) => grupo.add(p));
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

  for (let i = 0; i < 120; i += 1) {
    const x = 22 + (i % 11) * 32 + (i % 4) * 5;
    const z = -22 - Math.floor(i / 11) * 32 - (i % 3) * 7;
    if (x > MITAD_MAPA - 16 || z < -MITAD_MAPA + 16) continue;
    grupo.add(crearArbol(x, z, alturaEn(x, z)));
  }

  for (let i = 0; i < 36; i += 1) {
    const x = -36 - (i % 8) * 40;
    const z = 48 + Math.floor(i / 8) * 38;
    if (z > MITAD_MAPA - 20 || x < -MITAD_MAPA + 16) continue;
    grupo.add(crearRoca(x, z, alturaEn(x, z), 1.2 + (i % 3) * 0.55));
  }

  const cabana = crearEdificio(puntos.cabana.x, puntos.cabana.z, 8, 8, 5, 0x8b5a2b);
  grupo.add(cabana.mesh, cabana.techo);
  if (cabana.extras) cabana.extras.forEach((p) => grupo.add(p));
  cajas.push(cabana);

  const sombrilla = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  );
  sombrilla.position.set(88, 3.2, 58);
  grupo.add(sombrilla);
  const sombrilla2 = sombrilla.clone();
  sombrilla2.material = new THREE.MeshStandardMaterial({ color: 0x4cc9f0 });
  sombrilla2.position.set(210, 3.2, 70);
  grupo.add(sombrilla2);

  const nubes = new THREE.Group();
  const matNube = new THREE.MeshBasicMaterial({
    color: 0xf7fbff,
    transparent: true,
    opacity: 0.88,
    fog: false,
  });
  for (let i = 0; i < 16; i += 1) {
    const nube = new THREE.Group();
    for (let b = 0; b < 4; b += 1) {
      const bola = new THREE.Mesh(new THREE.SphereGeometry(7 + (b % 3), 8, 6), matNube);
      bola.position.set((b - 1.4) * 7, (b % 2) * 2.2, (b % 3) * 3 - 3);
      nube.add(bola);
    }
    nube.scale.set(1.5, 0.55, 1.1);
    nube.position.set((i % 8) * 110 - 380, 46 + (i % 4) * 7, Math.floor(i / 8) * 200 - 180);
    nubes.add(nube);
  }
  grupo.add(nubes);

  escena.add(grupo);
  escena.fog = new THREE.FogExp2(0x9fd0ff, 0.002);

  return {
    grupo,
    agua,
    nubes,
    cajas,
    puntos,
    lado: LADO_MAPA,
  };
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
