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

  plantarBosque(grupo);
  const avion = crearAeropuerto(grupo, cajas, puntos);

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
  const sombrilla3 = sombrilla.clone();
  sombrilla3.material = new THREE.MeshStandardMaterial({ color: 0xffd166 });
  sombrilla3.position.set(150, 3.2, 120);
  grupo.add(sombrilla3);

  const nubes = crearNubes();
  grupo.add(nubes);
  escena.add(grupo);
  escena.fog = new THREE.FogExp2(0x9fd0ff, 0.00115);
  puntos.tiendas = TIENDAS;
  return { grupo, agua, nubes, cajas, puntos, avion, lado: LADO_MAPA };
}
