/*
  Secretos del director. Cambiá la clave si querés.
*/
const CLAVE_DIRECTOR = "luna";
const LUGAR_SECRETO = { x: -510, z: 480 };

function crearPiedraSecreta(escena) {
  const g = new THREE.Group();
  const piedra = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.9, 0),
    new THREE.MeshStandardMaterial({
      color: 0x7b2cbf,
      emissive: 0x5a189a,
      emissiveIntensity: 0.45,
      roughness: 0.55,
    })
  );
  piedra.position.y = 0.7;
  g.add(piedra);
  g.position.set(LUGAR_SECRETO.x, alturaEn(LUGAR_SECRETO.x, LUGAR_SECRETO.z), LUGAR_SECRETO.z);
  escena.add(g);
  return g;
}

function revisarSecreto() {
  const G = JUEGO;
  if (G.secretoEncontrado) return;
  const pos = G.jugador.mesh.position;
  if (!cerca(pos, LUGAR_SECRETO, 4)) return;
  G.secretoEncontrado = true;
  G.piedraSecreta.visible = false;
  G.dinero += 120;
  avisar("¡Secreto! Una piedra violeta. +$120");
  ponerChat("sistema", "Encontraste el secreto de las montañas.");
  guardar();
}

function esClaveDirector(texto) {
  return String(texto || "").trim().toLowerCase() === CLAVE_DIRECTOR;
}
