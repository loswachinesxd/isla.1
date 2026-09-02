/*
  Casas y tiendas. Ventanas pintadas, puerta y toldo.
*/
function hexColor(n) {
  return "#" + n.toString(16).padStart(6, "0");
}

function texturaFachada(color, semilla, w, h) {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hexColor(color);
  ctx.fillRect(0, 0, 64, 128);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0, 112, 64, 16);
  for (let fila = 0; fila < 6; fila += 1) {
    for (let col = 0; col < 4; col += 1) {
      const px = 6 + col * 14;
      const py = 8 + fila * 18;
      const luz = ((Math.abs(semilla) + fila * 3 + col) % 5) !== 0;
      ctx.fillStyle = luz ? "#eaf4ff" : "#1a2430";
      ctx.fillRect(px, py, 10, 12);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(px, py, 10, 3);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(Math.max(1, Math.round(w / 7)), Math.max(1, Math.round(h / 5)));
  tex.needsUpdate = true;
  return tex;
}

function crearEdificio(x, z, w, d, h, color, toldoColor) {
  const extras = [];
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({
      map: texturaFachada(color, x * 10 + z, w, h),
      roughness: 0.68,
      metalness: 0.06,
    })
  );
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const techo = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.7, 0.42, d + 0.7),
    new THREE.MeshStandardMaterial({ color: 0x3a424c, roughness: 0.82 })
  );
  techo.position.set(x, h + 0.18, z);
  techo.castShadow = true;
  const cornisa = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.35, 0.18, d + 0.35),
    new THREE.MeshStandardMaterial({ color: 0x2c323c, roughness: 0.8 })
  );
  cornisa.position.set(x, h - 0.15, z);
  extras.push(cornisa);
  const puerta = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.3, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x3b2a1a, roughness: 0.6 })
  );
  puerta.position.set(x, 1.15, z + d / 2 + 0.08);
  extras.push(puerta);
  if (toldoColor) {
    const toldo = new THREE.Mesh(
      new THREE.BoxGeometry(Math.min(w - 1, 7), 0.16, 1.9),
      new THREE.MeshStandardMaterial({ color: toldoColor, roughness: 0.7 })
    );
    toldo.position.set(x, 3.15, z + d / 2 + 0.75);
    extras.push(toldo);
  }
  return {
    mesh,
    techo,
    extras,
    minX: x - w / 2 - 0.7,
    maxX: x + w / 2 + 0.7,
    minZ: z - d / 2 - 0.7,
    maxZ: z + d / 2 + 0.7,
  };
}
