/*
  Vecinos en el asiento de atrás.
*/
function asientosMax(vehiculo) {
  return vehiculo.tipo === "moto" ? 1 : 2;
}

function hayAsiento(vehiculo) {
  return (vehiculo.pasajeros || []).length < asientosMax(vehiculo);
}

function npcCercaDe(pos, npcs, dist) {
  let mejor = null;
  let dMejor = dist;
  npcs.forEach((npc) => {
    if (npc.enVehiculo || npc.caido) return;
    const d = pos.distanceTo(npc.mesh.position);
    if (d < dMejor) {
      dMejor = d;
      mejor = npc;
    }
  });
  return mejor;
}

function subirPasajero(vehiculo, npc) {
  if (!hayAsiento(vehiculo)) return false;
  if (!vehiculo.pasajeros) vehiculo.pasajeros = [];
  npc.enVehiculo = vehiculo;
  if (npc.mesh.parent) npc.mesh.parent.remove(npc.mesh);
  vehiculo.mesh.add(npc.mesh);
  const n = vehiculo.pasajeros.length;
  if (vehiculo.tipo === "moto") npc.mesh.position.set(0, 0.5, -0.55);
  else npc.mesh.position.set(n === 0 ? 0.58 : -0.58, 0.32, n === 0 ? 0.1 : 0.85);
  npc.mesh.rotation.set(0, Math.PI, 0);
  vehiculo.pasajeros.push(npc);
  return true;
}

function bajarPasajeros(vehiculo, escena) {
  const lista = (vehiculo.pasajeros || []).slice();
  lista.forEach((npc) => {
    const mundo = new THREE.Vector3();
    npc.mesh.getWorldPosition(mundo);
    vehiculo.mesh.remove(npc.mesh);
    escena.add(npc.mesh);
    npc.mesh.position.set(mundo.x + 1.6, alturaEn(mundo.x, mundo.z), mundo.z + 1.2);
    npc.mesh.rotation.set(0, 0, 0);
    npc.enVehiculo = null;
  });
  vehiculo.pasajeros = [];
}
