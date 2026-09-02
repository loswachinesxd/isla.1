/*
  Misiones.

  Maxi: una misión es un encargo, como "andá a comprar pan".
  Las PRINCIPALES cuentan la historia.
  Las SECUNDARIAS son extras, por si querés más monedas.
*/

function crearMisiones() {
  return [
    {
      id: "perro",
      tipo: "principal",
      titulo: "El perro perdido",
      texto: "Hablá con Ana en la plaza",
      paso: 0,
      hecha: false,
      recompensa: 80,
    },
    {
      id: "mirador",
      tipo: "principal",
      titulo: "La cima de la isla",
      texto: "Hablá con Omar en las montañas",
      paso: 0,
      hecha: false,
      recompensa: 90,
    },
    {
      id: "conchas",
      tipo: "secundaria",
      titulo: "Conchas de la playa",
      texto: "Juntá 5 conchas en la playa",
      paso: 0,
      hecha: false,
      recompensa: 40,
      juntas: 0,
    },
    {
      id: "paquete",
      tipo: "secundaria",
      titulo: "El paquete de la montaña",
      texto: "Hablá con Luis en la ciudad",
      paso: 0,
      hecha: false,
      recompensa: 60,
    },
    {
      id: "flores",
      tipo: "secundaria",
      titulo: "Flores del bosque",
      texto: "Hablá con Kira en el bosque",
      paso: 0,
      hecha: false,
      recompensa: 50,
      juntas: 0,
    },
    {
      id: "tesoro",
      tipo: "secundaria",
      titulo: "El cofre de la playa",
      texto: "Hablá con Lila en la playa",
      paso: 0,
      hecha: false,
      recompensa: 70,
    },
    {
      id: "boya",
      tipo: "secundaria",
      titulo: "Nadar hasta la boya",
      texto: "Hablá con Nico y nadá hasta la boya del mar",
      paso: 0,
      hecha: false,
      recompensa: 55,
    },
    {
      id: "manzanas",
      tipo: "secundaria",
      titulo: "Manzanas del bosque",
      texto: "Hablá con Bela cerca de la ciudad",
      paso: 0,
      hecha: false,
      recompensa: 45,
      juntas: 0,
    },
    {
      id: "carta",
      tipo: "secundaria",
      titulo: "La carta de Sofi",
      texto: "Hablá con Sofi en la ciudad",
      paso: 0,
      hecha: false,
      recompensa: 35,
    },
    {
      id: "gato",
      tipo: "secundaria",
      titulo: "El gato de la plaza",
      texto: "Hablá con Paz en la ciudad",
      paso: 0,
      hecha: false,
      recompensa: 40,
    },
  ];
}

function crearMarcador(escena, color) {
  const palo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35 })
  );
  palo.position.y = 1.6;
  const bola = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 10, 8),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 })
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
  const cuerpo = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x8d99ae, roughness: 0.7 })
  );
  cuerpo.scale.set(1.3, 0.8, 1.8);
  cuerpo.position.y = 0.28;
  const cabeza = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x9aa4b5, roughness: 0.7 })
  );
  cabeza.position.set(0, 0.48, -0.32);
  const cola = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.03, 0.55, 6),
    new THREE.MeshStandardMaterial({ color: 0x8d99ae })
  );
  cola.rotation.z = 0.7;
  cola.position.set(0.2, 0.4, 0.35);
  g.add(cuerpo, cabeza, cola);
  g.position.set(punto.x, alturaEn(punto.x, punto.z), punto.z);
  escena.add(g);
  return { mesh: g, encontrado: false, x: punto.x, z: punto.z };
}

function misionPorId(misiones, id) {
  return misiones.find((m) => m.id === id);
}

function textoMisionActiva(misiones) {
  const principal = misiones.find((m) => m.tipo === "principal" && !m.hecha);
  if (principal) return principal.texto;
  const extra = misiones.find((m) => !m.hecha);
  if (extra) return extra.texto;
  return "¡Listo! Paseá por la isla.";
}

function marcadoresDeMision(misiones, mundo, perro) {
  const lista = [];
  const perroM = misionPorId(misiones, "perro");
  if (perroM && !perroM.hecha) {
    if (perroM.paso === 0) lista.push({ x: mundo.puntos.plaza.x, z: mundo.puntos.plaza.z, color: "#ffd166" });
    if (perroM.paso === 1 && perro && !perro.encontrado) {
      lista.push({ x: mundo.puntos.perro.x, z: mundo.puntos.perro.z, color: "#ffd166" });
    }
    if (perroM.paso === 2) lista.push({ x: mundo.puntos.plaza.x, z: mundo.puntos.plaza.z, color: "#ffd166" });
  }
  const mirador = misionPorId(misiones, "mirador");
  if (mirador && !mirador.hecha) {
    if (mirador.paso === 0) lista.push({ x: -240, z: 160, color: "#cdb4db" });
    if (mirador.paso === 1) lista.push({ x: mundo.puntos.mirador.x, z: mundo.puntos.mirador.z, color: "#cdb4db" });
  }
  const conchas = misionPorId(misiones, "conchas");
  if (conchas && !conchas.hecha) {
    lista.push({ x: mundo.puntos.conchas[0].x, z: mundo.puntos.conchas[0].z, color: "#90e0ef" });
  }
  const paquete = misionPorId(misiones, "paquete");
  if (paquete && !paquete.hecha) {
    if (paquete.paso === 0) lista.push({ x: -104, z: -86, color: "#bde0fe" });
    if (paquete.paso === 1) lista.push({ x: mundo.puntos.cabana.x, z: mundo.puntos.cabana.z, color: "#bde0fe" });
  }
  const flores = misionPorId(misiones, "flores");
  if (flores && !flores.hecha) {
    if (flores.paso === 0) lista.push({ x: 70, z: -70, color: "#ff85a1" });
    else lista.push({ x: mundo.puntos.flores[0].x, z: mundo.puntos.flores[0].z, color: "#ff85a1" });
  }
  const tesoro = misionPorId(misiones, "tesoro");
  if (tesoro && !tesoro.hecha) {
    if (tesoro.paso === 0) lista.push({ x: 80, z: 40, color: "#ffd166" });
    if (tesoro.paso === 1) lista.push({ x: mundo.puntos.tesoro.x, z: mundo.puntos.tesoro.z, color: "#ffd166" });
  }
  const boya = misionPorId(misiones, "boya");
  if (boya && !boya.hecha) {
    if (boya.paso === 0) lista.push({ x: 58, z: 40, color: "#ff6b6b" });
    if (boya.paso === 1) lista.push({ x: mundo.puntos.boya.x, z: mundo.puntos.boya.z, color: "#ff6b6b" });
  }
  const manzanas = misionPorId(misiones, "manzanas");
  if (manzanas && !manzanas.hecha) {
    if (manzanas.paso === 0) lista.push({ x: -40, z: -130, color: "#e63946" });
    else lista.push({ x: mundo.puntos.manzanas[0].x, z: mundo.puntos.manzanas[0].z, color: "#e63946" });
  }
  const carta = misionPorId(misiones, "carta");
  if (carta && !carta.hecha) {
    if (carta.paso === 0) lista.push({ x: -140, z: -90, color: "#cdb4db" });
    if (carta.paso === 1) lista.push({ x: -50, z: -60, color: "#cdb4db" });
  }
  const gato = misionPorId(misiones, "gato");
  if (gato && !gato.hecha) {
    if (gato.paso === 0) lista.push({ x: -20, z: -90, color: "#8d99ae" });
    if (gato.paso === 1) lista.push({ x: mundo.puntos.gato.x, z: mundo.puntos.gato.z, color: "#8d99ae" });
  }
  lista.push({ x: mundo.puntos.tienda.x, z: mundo.puntos.tienda.z, color: "#fff" });
  return lista;
}
