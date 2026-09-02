/*
  El mapa: pizza en 4 zonas.
*/
const LADO_MAPA = 960;
const MITAD_MAPA = LADO_MAPA / 2;
const SPAWN = { x: -90, z: -90 };
const AGUA_Y = -0.35;

function ruido(ix, iz) {
  const n = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function ruidoSuave(x, z) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  return (
    ruido(xi, zi) * (1 - u) * (1 - v) +
    ruido(xi + 1, zi) * u * (1 - v) +
    ruido(xi, zi + 1) * (1 - u) * v +
    ruido(xi + 1, zi + 1) * u * v
  );
}

function zonaEn(x, z) {
  if (x >= 0 && z >= 0) {
    if (x > 120 && z > 120 && x + z > 360) return "agua";
    return "playa";
  }
  if (x < 0 && z >= 0) return "montana";
  if (x >= 0 && z < 0) return "bosque";
  return "ciudad";
}

function nombreZona(zona) {
  const n = { ciudad: "Ciudad", bosque: "Bosque", montana: "Montañas", playa: "Playa", agua: "Mar" };
  return n[zona] || "Isla";
}

function esAgua(x, z) {
  return zonaEn(x, z) === "agua";
}

function alturaEn(x, z) {
  const zona = zonaEn(x, z);
  if (zona === "agua") return AGUA_Y - 0.8;
  if (zona === "playa") return 0.08 + ruidoSuave(x * 0.04, z * 0.04) * 0.28;
  if (zona === "ciudad") return 0;
  if (zona === "bosque") return ruidoSuave(x * 0.028, z * 0.028) * 2.6;
  return 1.4 + ruidoSuave(x * 0.02, z * 0.02) * 16 + ruidoSuave(x * 0.08, z * 0.08) * 2.5;
}

function colorZona(zona) {
  const c = {
    ciudad: new THREE.Color(0x7d848c),
    bosque: new THREE.Color(0x2f7a38),
    montana: new THREE.Color(0xb8c2cc),
    playa: new THREE.Color(0xe4c97a),
    agua: new THREE.Color(0x1f6fad),
  };
  return c[zona] || c.ciudad;
}

function chocaCaja(x, z, cajas) {
  for (let i = 0; i < cajas.length; i += 1) {
    const c = cajas[i];
    if (x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ) return true;
  }
  return false;
}

function agregarEdificio(grupo, cajas, edificio) {
  grupo.add(edificio.mesh, edificio.techo);
  if (edificio.extras) edificio.extras.forEach((p) => grupo.add(p));
  cajas.push(edificio);
}
