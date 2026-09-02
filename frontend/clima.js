/*
  Día, noche y clima.

  Maxi: el sol da vueltas como un reloj.
  El clima es el humor del cielo: sol, lluvia o tormenta.
*/

function crearClima(escena) {
  const hemi = new THREE.HemisphereLight(0xb8d8ff, 0x3d2b1f, 0.85);
  const sol = new THREE.DirectionalLight(0xfff1c8, 1.55);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1536, 1536);
  sol.shadow.bias = -0.00035;
  sol.shadow.normalBias = 0.04;
  sol.shadow.camera.left = -180;
  sol.shadow.camera.right = 180;
  sol.shadow.camera.top = 180;
  sol.shadow.camera.bottom = -180;
  sol.shadow.camera.near = 1;
  sol.shadow.camera.far = 520;
  escena.add(hemi, sol, sol.target);

  const solMesh = new THREE.Mesh(
    new THREE.SphereGeometry(7, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffe566 })
  );
  const brillo = new THREE.Mesh(
    new THREE.SphereGeometry(11, 12, 10),
    new THREE.MeshBasicMaterial({
      color: 0xfff3a8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  solMesh.add(brillo);
  escena.add(solMesh);

  const luna = new THREE.Mesh(
    new THREE.SphereGeometry(5.2, 14, 12),
    new THREE.MeshBasicMaterial({ color: 0xe8eefc, fog: false })
  );
  escena.add(luna);

  const geoEst = new THREE.BufferGeometry();
  const nEst = 260;
  const posEst = new Float32Array(nEst * 3);
  for (let i = 0; i < nEst; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const b = 0.2 + Math.random() * 1.1;
    const r = 780;
    posEst[i * 3] = Math.cos(a) * Math.cos(b) * r;
    posEst[i * 3 + 1] = Math.abs(Math.sin(b) * r);
    posEst[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r;
  }
  geoEst.setAttribute("position", new THREE.BufferAttribute(posEst, 3));
  const estrellas = new THREE.Points(
    geoEst,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3.2,
      sizeAttenuation: false,
      fog: false,
      transparent: true,
      opacity: 0.95,
    })
  );
  escena.add(estrellas);

  const geo = new THREE.BufferGeometry();
  const n = 420;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 1) {
    pos[i * 3] = (Math.random() - 0.5) * 70;
    pos[i * 3 + 1] = Math.random() * 28;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const lluvia = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xa8d0ff, size: 0.18, transparent: true, opacity: 0.7 })
  );
  lluvia.visible = false;
  escena.add(lluvia);

  const faroles = [];
  [
    [-90, -70],
    [-70, -90],
    [-120, -90],
    [-90, -120],
    [-50, -70],
    [-130, -50],
  ].forEach((p) => {
    const palo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 5.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.4, roughness: 0.4 })
    );
    palo.position.set(p[0], 2.7, p[1]);
    const globo = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 10, 8),
      new THREE.MeshStandardMaterial({
        color: 0xffe0a3,
        emissive: 0xffc878,
        emissiveIntensity: 0,
      })
    );
    globo.position.set(p[0], 5.5, p[1]);
    const luz = new THREE.PointLight(0xffd59a, 0, 18, 2);
    luz.position.set(p[0], 5.5, p[1]);
    escena.add(palo, globo, luz);
    faroles.push({ luz, globo });
  });

  return {
    hora: 9.5,
    tipo: "sol",
    timer: 0,
    hemi,
    sol,
    solMesh,
    luna,
    estrellas,
    lluvia,
    faroles,
    relampago: 0,
  };
}

function nombreClima(tipo) {
  if (tipo === "lluvia") return "Lluvia";
  if (tipo === "tormenta") return "Tormenta";
  return "Sol";
}

function actualizarClima(clima, dt, escena, jugadorPos) {
  // Un día de verdad tarda ~14 minutos. Antes iba como un reló de juguete.
  clima.hora = (clima.hora + dt * 0.028) % 24;
  clima.timer += dt;
  if (clima.timer > 180) {
    clima.timer = 0;
    const dados = Math.random();
    clima.tipo = dados < 0.55 ? "sol" : dados < 0.82 ? "lluvia" : "tormenta";
  }

  const t = clima.hora / 24;
  const angulo = t * Math.PI * 2 - Math.PI / 2;
  const radio = 260;
  clima.sol.position.set(
    jugadorPos.x + Math.cos(angulo) * radio,
    Math.sin(angulo) * radio,
    jugadorPos.z + 40
  );
  clima.sol.target.position.set(jugadorPos.x, 0, jugadorPos.z);
  clima.solMesh.position.copy(clima.sol.position);
  clima.luna.position.set(
    jugadorPos.x - Math.cos(angulo) * radio,
    Math.max(8, -Math.sin(angulo) * radio),
    jugadorPos.z - 40
  );

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

  if (clima.tipo === "tormenta" && Math.random() < 0.01) {
    clima.relampago = 0.18;
  }
  if (clima.relampago > 0) {
    clima.relampago -= dt;
    escena.background = new THREE.Color(0xdfe7f2);
    clima.hemi.intensity = 2.2;
  }
}
