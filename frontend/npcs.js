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
      pantalon: 0x4a3040,
      pelo: 0x2b1a12,
      ojos: 0x4a7c59,
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
      pantalon: 0x1f2430,
      pelo: 0x1a1a1a,
      ojos: 0x3d5a80,
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
      pantalon: 0x3a5060,
      pelo: 0x6b3a1a,
      ojos: 0x2a6f97,
      dialogo: "En la playa hay conchas. Si juntás 5, te pago. Y si nadás a la boya, mejor.",
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
      pantalon: 0x3d4f44,
      pelo: 0xc9a227,
      ojos: 0x5b8c5a,
      dialogo: "Mirá la hora arriba. El día dura bastante, como afuera. Si ves a Tito, dale esta carta.",
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
      pantalon: 0x2d1b4a,
      pelo: 0x3b2416,
      ojos: 0x6a4c93,
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
      pantalon: 0x1d4e4a,
      pelo: 0x4a2c14,
      ojos: 0x2a6f6a,
      dialogo: "Hay cinco tiendas. La mía es la amarilla. Entrá con E.",
      x: -62,
      z: -100,
      puntos: [
        { x: -62, z: -100 },
        { x: -54, z: -100 },
      ],
    },
    {
      id: "kira",
      nombre: "Kira",
      ropa: 0x90be6d,
      pantalon: 0x3a5a40,
      pelo: 0x6b2d5b,
      ojos: 0x3d6b4f,
      dialogo: "En el bosque hay flores rosas. Si juntás 6, te doy monedas.",
      x: 70,
      z: -70,
      puntos: [
        { x: 70, z: -70 },
        { x: 95, z: -95 },
        { x: 55, z: -110 },
      ],
    },
    {
      id: "omar",
      nombre: "Omar",
      ropa: 0x577590,
      pantalon: 0x2c3e50,
      pelo: 0x1f1a16,
      ojos: 0x4a6fa5,
      dialogo: "Subí a la cima. Desde ahí se ve toda la isla.",
      x: -240,
      z: 160,
      puntos: [
        { x: -240, z: 160 },
        { x: -255, z: 185 },
        { x: -220, z: 175 },
      ],
    },
    {
      id: "lila",
      nombre: "Lila",
      ropa: 0xf72585,
      pantalon: 0x3d1a40,
      pelo: 0x8b1e3f,
      ojos: 0x5a3d8c,
      dialogo: "Hay un cofre escondido más allá de las sombrillas.",
      x: 80,
      z: 40,
      puntos: [
        { x: 80, z: 40 },
        { x: 100, z: 28 },
        { x: 70, z: 22 },
      ],
    },
    {
      id: "bela",
      nombre: "Bela",
      ropa: 0xe63946,
      pantalon: 0x3d0c12,
      pelo: 0x7a3e12,
      ojos: 0x6b3a2a,
      dialogo: "Se me cayeron las manzanas en el bosque. ¿Me las juntás?",
      x: -40,
      z: -130,
      puntos: [
        { x: -40, z: -130 },
        { x: -20, z: -118 },
        { x: -55, z: -145 },
      ],
    },
    {
      id: "paz",
      nombre: "Paz",
      ropa: 0x48cae4,
      pantalon: 0x023e8a,
      pelo: 0xf4d35e,
      ojos: 0x0077b6,
      dialogo: "Vi un gato gris cerca de la plaza. Es muy tímido.",
      x: -20,
      z: -90,
      puntos: [
        { x: -20, z: -90 },
        { x: -20, z: -50 },
        { x: -70, z: -50 },
      ],
    },
    {
      id: "gabo",
      nombre: "Gabo",
      ropa: 0xf77f00,
      pantalon: 0x4a2c0a,
      pelo: 0x1a1a1a,
      ojos: 0x3d5a80,
      dialogo: "Si corrés con Shift, llegás más rápido a todos lados.",
      x: -160,
      z: -40,
      puntos: [
        { x: -160, z: -40 },
        { x: -200, z: -80 },
        { x: -170, z: -120 },
        { x: -120, z: -70 },
      ],
    },
    {
      id: "nuri",
      nombre: "Nuri",
      ropa: 0xffc8dd,
      pantalon: 0x5a3d52,
      pelo: 0x3b1f2b,
      ojos: 0x9b5de5,
      dialogo: "La playa tiene dos sombrillas. Ahí da sombra rica.",
      x: 100,
      z: 70,
      puntos: [
        { x: 100, z: 70 },
        { x: 130, z: 55 },
        { x: 90, z: 90 },
      ],
    },
    {
      id: "enzo",
      nombre: "Enzo",
      ropa: 0x457b9d,
      pantalon: 0x1d3557,
      pelo: 0x4a2c14,
      ojos: 0x2a6f97,
      dialogo: "De noche se prenden los faroles. El cielo se llena de estrellas.",
      x: -200,
      z: -160,
      puntos: [
        { x: -200, z: -160 },
        { x: -230, z: -190 },
        { x: -180, z: -200 },
      ],
    },
  ];

  return vecinos.map((v) => {
    const mesh = crearMuñeco({
      ropa: v.ropa,
      pantalon: v.pantalon || 0x333333,
      pelo: v.pelo,
      ojos: v.ojos,
    });
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
