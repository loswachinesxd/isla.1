/*
  El cielo cambia: día, atardecer, noche, lluvia.
*/
function nombreClima(tipo) {
  if (tipo === "lluvia") return "Lluvia";
  if (tipo === "tormenta") return "Tormenta";
  return "Sol";
}

function actualizarClima(clima, dt, escena, jugadorPos) {
  clima.hora = (clima.hora + dt * 0.028) % 24;
  clima.timer += dt;
  if (clima.timer > 180) {
    clima.timer = 0;
    const dados = Math.random();
    clima.tipo = dados < 0.55 ? "sol" : dados < 0.82 ? "lluvia" : "tormenta";
  }
  const angulo = (clima.hora / 24) * Math.PI * 2 - Math.PI / 2;
  const radio = 260;
  clima.sol.position.set(jugadorPos.x + Math.cos(angulo) * radio, Math.sin(angulo) * radio, jugadorPos.z + 40);
  clima.sol.target.position.set(jugadorPos.x, 0, jugadorPos.z);
  clima.solMesh.position.copy(clima.sol.position);
  clima.luna.position.set(jugadorPos.x - Math.cos(angulo) * radio, Math.max(8, -Math.sin(angulo) * radio), jugadorPos.z - 40);
  const esNoche = clima.hora < 6 || clima.hora > 19.5;
  const amanecer = clima.hora >= 6 && clima.hora < 8;
  const atardecer = clima.hora >= 17.5 && clima.hora <= 19.5;
  let cielo = new THREE.Color(0x7ec8ff);
  let fog = new THREE.Color(0x9fd0ff);
  let solInt = 1.35;
  let hemiInt = 0.85;
  if (amanecer) {
    cielo.set(0xffb37a);
    fog.set(0xffc08a);
    solInt = 0.9;
  }
  if (atardecer) {
    cielo.set(0xff7a3a);
    fog.set(0xff9a62);
    solInt = 0.8;
  }
  if (esNoche) {
    cielo.set(0x0b1a33);
    fog.set(0x15243c);
    solInt = 0.12;
    hemiInt = 0.22;
  }
  if (clima.tipo === "lluvia") {
    cielo.lerp(new THREE.Color(0x6d7d90), 0.45);
    fog.lerp(new THREE.Color(0x7b8a9a), 0.4);
    solInt *= 0.55;
  }
  if (clima.tipo === "tormenta") {
    cielo.set(esNoche ? 0x070d16 : 0x3a4654);
    fog.set(0x4a5560);
    solInt *= 0.25;
    hemiInt *= 0.6;
  }
  escena.background = cielo;
  if (escena.fog) escena.fog.color.copy(fog);
  clima.sol.intensity = solInt;
  clima.hemi.intensity = hemiInt;
  clima.solMesh.visible = !esNoche && clima.tipo !== "tormenta";
  clima.luna.visible = esNoche;
  clima.estrellas.visible = esNoche;
  clima.estrellas.position.set(jugadorPos.x, 0, jugadorPos.z);
  clima.faroles.forEach((f) => {
    f.luz.intensity = esNoche ? 1.6 : 0;
    f.globo.material.emissiveIntensity = esNoche ? 1.4 : 0.05;
  });
  const llueve = clima.tipo !== "sol";
  clima.lluvia.visible = llueve;
  if (llueve) {
    clima.lluvia.position.set(jugadorPos.x, jugadorPos.y, jugadorPos.z);
    const arr = clima.lluvia.geometry.attributes.position.array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] -= (clima.tipo === "tormenta" ? 28 : 18) * dt;
      if (arr[i + 1] < 0) arr[i + 1] = 26;
    }
    clima.lluvia.geometry.attributes.position.needsUpdate = true;
  }
  if (clima.tipo === "tormenta" && Math.random() < 0.01) clima.relampago = 0.18;
  if (clima.relampago > 0) {
    clima.relampago -= dt;
    escena.background = new THREE.Color(0xdfe7f2);
    clima.hemi.intensity = 2.2;
  }
}
