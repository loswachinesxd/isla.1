/*
  Pegar: F o el botón. Si pegás, el vecino te puede devolver.
*/
function pegar() {
  const G = JUEGO;
  if (G.modo !== "juego" || G.vehiculo || G.golpeCd > 0 || G.muertoTimer > 0) return;
  const npc = npcCercaDe(G.jugador.mesh.position, G.npcs, 2.8);
  if (!npc) {
    avisar("No hay nadie cerca para pegar.");
    return;
  }
  G.golpeCd = 0.45;
  const p = G.jugador.mesh.userData.partes;
  if (p && p.brazoD) p.brazoD.rotation.x = -1.2;
  npc.vida = (npc.vida || 100) - 24;
  npc.enojado = true;
  npc.golpeCd = 0.8;
  avisar("Le pegaste a " + npc.nombre + ".");
  if (npc.vida <= 0) tumbarNpc(npc, npc.nombre + " se desmayó. Después se levanta.");
}

function tickPelea(dt) {
  const G = JUEGO;
  G.golpeCd = Math.max(0, (G.golpeCd || 0) - dt);
  const p = G.jugador.mesh.userData.partes;
  if (p && p.brazoD && G.golpeCd < 0.25) p.brazoD.rotation.x *= 0.7;
  if (G.vehiculo || G.modo !== "juego") return;
  const yo = G.jugador.mesh.position;
  G.npcs.forEach((npc) => {
    if (!npc.enojado || npc.caido || npc.enVehiculo) return;
    npc.golpeCd = (npc.golpeCd || 0) - dt;
    const d = yo.distanceTo(npc.mesh.position);
    if (d < 2.6 && npc.golpeCd <= 0) {
      npc.golpeCd = 1.1;
      lastimar(11, npc.nombre + " te pegó.");
      const b = npc.mesh.userData.partes;
      if (b && b.brazoD) b.brazoD.rotation.x = -1.1;
    }
  });
}
