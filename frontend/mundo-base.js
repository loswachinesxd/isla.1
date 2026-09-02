/*
  El tamaño de la isla y el piso con ruidito.
*/
const LADO_MAPA = 2100;
const MITAD_MAPA = LADO_MAPA / 2;
const SPAWN = { x: -90, z: -90 };
const AGUA_Y = -0.35;

function esMovil() {
  return window.innerWidth < 820 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
}

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
