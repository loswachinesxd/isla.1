/*
  Sol, luna, estrellas, lluvia y faroles.
*/
function crearClima(escena) {
  const hemi = new THREE.HemisphereLight(0xb8d8ff, 0x3d2b1f, 0.85);
  const sol = new THREE.DirectionalLight(0xfff1c8, 1.55);
  sol.castShadow = true;
  const mapaSombra = esMovil() ? 512 : 1536;
  sol.shadow.mapSize.set(mapaSombra, mapaSombra);
  sol.shadow.bias = -0.00035;
  sol.shadow.normalBias = 0.04;
  sol.shadow.camera.left = -260;
  sol.shadow.camera.right = 260;
  sol.shadow.camera.top = 260;
  sol.shadow.camera.bottom = -260;
  sol.shadow.camera.near = 1;
  sol.shadow.camera.far = 720;
  escena.add(hemi, sol, sol.target);
  const solMesh = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe566 }));
  const brillo = new THREE.Mesh(
    new THREE.SphereGeometry(11, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff3a8, transparent: true, opacity: 0.22, depthWrite: false })
  );
  solMesh.add(brillo);
  escena.add(solMesh);
  const luna = new THREE.Mesh(new THREE.SphereGeometry(5.2, 14, 12), new THREE.MeshBasicMaterial({ color: 0xe8eefc, fog: false }));
  escena.add(luna);
  const geoEst = new THREE.BufferGeometry();
  const posEst = new Float32Array(260 * 3);
  for (let i = 0; i < 260; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const b = 0.2 + Math.random() * 1.1;
    posEst[i * 3] = Math.cos(a) * Math.cos(b) * 780;
    posEst[i * 3 + 1] = Math.abs(Math.sin(b) * 780);
    posEst[i * 3 + 2] = Math.sin(a) * Math.cos(b) * 780;
  }
  geoEst.setAttribute("position", new THREE.BufferAttribute(posEst, 3));
  const estrellas = new THREE.Points(
    geoEst,
    new THREE.PointsMaterial({ color: 0xffffff, size: 3.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.95 })
  );
  escena.add(estrellas);
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i += 1) {
    pos[i * 3] = (Math.random() - 0.5) * 70;
    pos[i * 3 + 1] = Math.random() * 28;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const lluvia = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xa8d0ff, size: 0.18, transparent: true, opacity: 0.7 }));
  lluvia.visible = false;
  escena.add(lluvia);
  const faroles = [];
  [[-90, -70], [-70, -90], [-120, -90], [-90, -120], [-50, -70], [-130, -50]].forEach((p) => {
    const palo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 5.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.4, roughness: 0.4 })
    );
    palo.position.set(p[0], 2.7, p[1]);
    const globo = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0xffe0a3, emissive: 0xffc878, emissiveIntensity: 0 })
    );
    globo.position.set(p[0], 5.5, p[1]);
    const luz = new THREE.PointLight(0xffd59a, 0, 18, 2);
    luz.position.set(p[0], 5.5, p[1]);
    escena.add(palo, globo, luz);
    faroles.push({ luz: luz, globo: globo });
  });
  return { hora: 9.5, tipo: "sol", timer: 0, hemi: hemi, sol: sol, solMesh: solMesh, luna: luna, estrellas: estrellas, lluvia: lluvia, faroles: faroles, relampago: 0 };
}
