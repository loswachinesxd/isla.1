/*
  Cosas que se juntan del piso: conchas, manzanas, etc.
*/
function crearPickup(escena, puntos, opts) {
  const r = opts.r || 0.22;
  const yExtra = opts.y || 0.22;
  return puntos.map((p) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 8, 6),
      new THREE.MeshStandardMaterial({ color: opts.color, roughness: 0.45 })
    );
    if (opts.escalaY) mesh.scale.set(1, opts.escalaY, 1);
    mesh.position.set(p.x, alturaEn(p.x, p.z) + yExtra, p.z);
    escena.add(mesh);
    return { mesh, tomada: false, x: p.x, z: p.z };
  });
}

function ocultarPickups(lista, juntas, hecha) {
  lista.forEach((item, i) => {
    if (hecha || i < (juntas || 0)) {
      item.tomada = true;
      item.mesh.visible = false;
    }
  });
}
