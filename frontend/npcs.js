/*
  NPCs: gente que camina sola.

  Maxi: NPC significa "personaje no jugador".
  Son vecinos de la isla. Vos no los manejás.
  Ellos recorren la ciudad como si fueran al kiosco.
*/

function crearNPCs(escena) {
  const vecinos = [
    {
      id: "ana",
      nombre: "Ana",
      ropa: 0xe07a5f,
      dialogo: "¡Se me perdió Luna en el bosque! ¿Me ayudás a buscarla?",
      x: -82,
      z: -98,
      puntos: [
        { x: -82, z: -98 },
        { x: -100, z: -82 },
        { x: -78, z: -74 },
      ],
    },
    {
      id: "luis",
      nombre: "Luis",
      ropa: 0x3d405b,
      dialogo: "Tengo un paquete para la cabaña de la montaña.",
      x: -104,
      z: -86,
      puntos: [
        { x: -104, z: -86 },
        { x: -130, z: -90 },
        { x: -112, z: -70 },
      ],
    },
    {
      id: "nico",
      nombre: "Nico",
      ropa: 0xf4a261,
      dialogo: "En la playa hay conchas. Si juntás 5, te pago.",
      x: 58,
      z: 40,
      puntos: [
        { x: 58, z: 40 },
        { x: 72, z: 52 },
        { x: 50, z: 58 },
      ],
    },
    {
      id: "caminante1",
      nombre: "Sofi",
      ropa: 0x81b29a,
      dialogo: "Hoy hay sol... o lluvia. En esta isla el cielo cambia rápido.",
      x: -140,
      z: -90,
      puntos: [
        { x: -140, z: -90 },
        { x: -140, z: -130 },
        { x: -50, z: -130 },
        { x: -50, z: -90 },
      ],
    },
    {
      id: "caminante2",
      nombre: "Tito",
      ropa: 0x9b5de5,
      dialogo: "El auto rojo está en la plaza. La moto es más rápida.",
      x: -50,
      z: -60,
      puntos: [
        { x: -50, z: -60 },
        { x: -150, z: -60 },
        { x: -150, z: -40 },
        { x: -70, z: -40 },
      ],
    },
    {
      id: "tendero",
      nombre: "Mora",
      ropa: 0x2a9d8f,
      dialogo: "Pasá a la tienda amarilla. Ahí vendo cosas útiles.",
      x: -62,
      z: -100,
      puntos: [
        { x: -62, z: -100 },
        { x: -54, z: -100 },
      ],
    },
  ];

  return vecinos.map((v) => {
    const mesh = crearMuñeco({ ropa: v.ropa, pantalon: 0x333333 });
    mesh.position.set(v.x, 0, v.z);
    escena.add(mesh);
    return {
      ...v,
      mesh,
      i: 0,
      espera: 0,
    };
  });
}

function crearPerro(escena, punto) {
  const perro = new THREE.Group();
  const cuerpo = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.35, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
  );
  cuerpo.position.y = 0.4;
  const cabeza = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.28, 0.32),
    new THREE.MeshStandardMaterial({ color: 0x6f4518 })
  );
  cabeza.position.set(0, 0.55, -0.5);
  perro.add(cuerpo, cabeza);
  perro.position.set(punto.x, alturaEn(punto.x, punto.z), punto.z);
  escena.add(perro);
  return { mesh: perro, encontrado: false, siguiendo: false };
}

function actualizarNPCs(npcs, dt) {
  npcs.forEach((npc) => {
    if (npc.espera > 0) {
      npc.espera -= dt;
      animarMuñeco(npc.mesh, false, dt, false);
      return;
    }
    const destino = npc.puntos[npc.i];
    const pos = npc.mesh.position;
    const dx = destino.x - pos.x;
    const dz = destino.z - pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.6) {
      npc.i = (npc.i + 1) % npc.puntos.length;
      npc.espera = 1.2;
      return;
    }
    pos.x += (dx / dist) * 1.8 * dt;
    pos.z += (dz / dist) * 1.8 * dt;
    pos.y = alturaEn(pos.x, pos.z);
    npc.mesh.rotation.y = Math.atan2(dx, dz);
    animarMuñeco(npc.mesh, true, dt, false);
  });
}

function npcCercano(jugador, npcs) {
  const p = jugador.mesh.position;
  let mejor = null;
  let dMejor = 3.2;
  npcs.forEach((npc) => {
    const d = p.distanceTo(npc.mesh.position);
    if (d < dMejor) {
      dMejor = d;
      mejor = npc;
    }
  });
  return mejor;
}
