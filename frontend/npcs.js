/*
  NPCs: gente que camina sola.
*/
function crearNPCs(escena) {
  return VECINOS.map((v) => {
    const mesh = crearMuneco({ ropa: v.ropa, pantalon: v.pantalon, pelo: v.pelo, ojos: v.ojos });
    mesh.position.set(v.x, 0, v.z);
    escena.add(mesh);
    return Object.assign({}, v, { mesh: mesh, i: 0, espera: 0 });
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
