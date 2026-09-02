/*
  NPCs: gente que camina sola.
*/
function crearNPCs(escena) {
  const pieles = [0xe8b896, 0xc68642, 0xf1c27d, 0xffdbac, 0x8d5524, 0xd1a37a];
  return VECINOS.map((v, i) => {
    const mesh = crearMuneco({
      ropa: v.ropa,
      pantalon: v.pantalon,
      pelo: v.pelo,
      ojos: v.ojos,
      piel: pieles[i % pieles.length],
    });
    mesh.scale.setScalar(0.9 + ruido(v.x, v.z) * 0.18);
    mesh.position.set(v.x, 0, v.z);
    escena.add(mesh);
    return Object.assign({}, v, {
      mesh: mesh,
      i: 0,
      espera: 0,
      enVehiculo: null,
      caido: false,
      enojado: false,
      vida: 100,
      golpeCd: 0,
    });
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
    if (npc.enVehiculo) {
      animarMuñeco(npc.mesh, false, dt, false);
      return;
    }
    if (npc.caido) {
      npc.reviveEn = (npc.reviveEn || 0) - dt;
      if (npc.reviveEn <= 0) revivirNpc(npc);
      return;
    }
    const pos = npc.mesh.position;
    if (JUEGO.jugador) {
      const yo = JUEGO.jugador.mesh.position;
      const d = pos.distanceTo(yo);
      const dxm = yo.x - pos.x;
      const dzm = yo.z - pos.z;
      if (npc.enojado && d < 16) {
        const dist = Math.hypot(dxm, dzm) || 1;
        if (dist > 1.5) {
          pos.x += (dxm / dist) * 2.4 * dt;
          pos.z += (dzm / dist) * 2.4 * dt;
        }
        pos.y = alturaEn(pos.x, pos.z);
        npc.mesh.rotation.y = Math.atan2(dxm, dzm);
        animarMuñeco(npc.mesh, dist > 1.5, dt, false);
        return;
      }
      if (d < 4.2) {
        npc.mesh.rotation.y = Math.atan2(dxm, dzm);
        pos.y = alturaEn(pos.x, pos.z);
        animarMuñeco(npc.mesh, false, dt, false);
        return;
      }
    }
    if (npc.espera > 0) {
      npc.espera -= dt;
      animarMuñeco(npc.mesh, false, dt, false);
      return;
    }
    const destino = npc.puntos[npc.i];
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
  return npcCercaDe(jugador.mesh.position, npcs, 3.2);
}
