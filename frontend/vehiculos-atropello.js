/*
  Si el auto va rápido y toca a un vecino, se desmaya un rato.
*/
function tumbarNpc(npc, motivo) {
  if (npc.caido || npc.enVehiculo) return;
  npc.caido = true;
  npc.enojado = false;
  npc.reviveEn = 12;
  npc.mesh.rotation.x = Math.PI / 2;
  const p = npc.mesh.position;
  p.y = alturaEn(p.x, p.z) + 0.25;
  avisar(motivo || "Atropellaste a " + npc.nombre + ". Se desmayó. Después se levanta.");
  if (typeof ponerChat === "function") ponerChat("isla", npc.nombre + " se desmayó.");
}

function revivirNpc(npc) {
  npc.caido = false;
  npc.enojado = false;
  npc.vida = 100;
  npc.reviveEn = 0;
  npc.mesh.rotation.x = 0;
  const casa = npc.puntos[0];
  npc.mesh.position.set(casa.x, alturaEn(casa.x, casa.z), casa.z);
  npc.i = 0;
}

function revisarAtropello(vehiculo, npcs) {
  if (!vehiculo || Math.abs(vehiculo.vel) < 8) return;
  const pos = vehiculo.mesh.position;
  npcs.forEach((npc) => {
    if (npc.caido || npc.enVehiculo) return;
    if (pos.distanceTo(npc.mesh.position) < 2.5) tumbarNpc(npc);
  });
}
