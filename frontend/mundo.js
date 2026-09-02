/*
  Junta el mapa: edificios, tiendas, árboles, mar.
*/
function crearMundo(escena) {
  const grupo = new THREE.Group();
  const cajas = [];
  const puntos = puntosDelMundo();
  grupo.add(crearSuelo());
  const agua = crearAgua();
  grupo.add(agua);

  EDIFICIOS_CIUDAD.forEach((e) => {
    agregarEdificio(grupo, cajas, crearEdificio(e[0], e[1], e[2], e[3], e[4], e[5]));
  });
  TIENDAS.forEach((t) => {
    agregarEdificio(grupo, cajas, crearEdificio(t.x, t.z, 12, 10, 8, t.color, t.toldo));
    const letrero = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 1, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xfff3c4 })
    );
    letrero.position.set(t.x, 9, t.z + 5.2);
    grupo.add(letrero);
  });

  const fuente = new THREE.Mesh(
    new THREE.CylinderGeometry(4.5, 5, 0.6, 16),
    new THREE.MeshStandardMaterial({ color: 0x9bb7d4, roughness: 0.3 })
  );
  fuente.position.set(SPAWN.x, 0.3, SPAWN.z);
  grupo.add(fuente);

  for (let i = 0; i < 110; i += 1) {
    const x = 22 + (i % 11) * 32 + (i % 4) * 5;
    const z = -22 - Math.floor(i / 11) * 32 - (i % 3) * 7;
    if (x > MITAD_MAPA - 16 || z < -MITAD_MAPA + 16) continue;
    grupo.add(crearArbol(x, z, alturaEn(x, z)));
  }
  for (let i = 0; i < 36; i += 1) {
    const x = -36 - (i % 8) * 40;
    const z = 48 + Math.floor(i / 8) * 38;
    if (z > MITAD_MAPA - 20 || x < -MITAD_MAPA + 16) continue;
    grupo.add(crearRoca(x, z, alturaEn(x, z), 1.2 + (i % 3) * 0.55));
  }

  agregarEdificio(grupo, cajas, crearEdificio(puntos.cabana.x, puntos.cabana.z, 8, 8, 5, 0x8b5a2b));
  const sombrilla = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  );
  sombrilla.position.set(88, 3.2, 58);
  grupo.add(sombrilla);
  const sombrilla2 = sombrilla.clone();
  sombrilla2.material = new THREE.MeshStandardMaterial({ color: 0x4cc9f0 });
  sombrilla2.position.set(210, 3.2, 70);
  grupo.add(sombrilla2);

  const nubes = crearNubes();
  grupo.add(nubes);
  escena.add(grupo);
  escena.fog = new THREE.FogExp2(0x9fd0ff, 0.002);
  puntos.tiendas = TIENDAS;
  return { grupo, agua, nubes, cajas, puntos, lado: LADO_MAPA };
}
