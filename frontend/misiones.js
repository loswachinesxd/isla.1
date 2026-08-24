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
  return puntos.map((p) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xffe0c2, roughness: 0.4 })
    );
    mesh.scale.set(1, 0.45, 1);
    mesh.position.set(p.x, alturaEn(p.x, p.z) + 0.2, p.z);
    escena.add(mesh);
    return { mesh, tomada: false, x: p.x, z: p.z };
  });
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
  const conchas = misionPorId(misiones, "conchas");
  if (conchas && !conchas.hecha) {
    lista.push({ x: 70, z: 48, color: "#90e0ef" });
  }
  const paquete = misionPorId(misiones, "paquete");
  if (paquete && !paquete.hecha) {
    if (paquete.paso === 0) lista.push({ x: -104, z: -86, color: "#bde0fe" });
    if (paquete.paso === 1) lista.push({ x: mundo.puntos.cabana.x, z: mundo.puntos.cabana.z, color: "#bde0fe" });
  }
  lista.push({ x: mundo.puntos.tienda.x, z: mundo.puntos.tienda.z, color: "#fff" });
  return lista;
}
