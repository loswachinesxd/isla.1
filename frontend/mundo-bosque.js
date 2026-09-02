/*
  Llena el mapa grande: bosque, palmeras, rocas y arbustos.
*/
function plantarSi(grupo, x, z, zonas, fabrica) {
  if (x > MITAD_MAPA - 18 || x < -MITAD_MAPA + 18) return;
  if (z > MITAD_MAPA - 18 || z < -MITAD_MAPA + 18) return;
  const zona = zonaEn(x, z);
  if (zonas.indexOf(zona) < 0) return;
  grupo.add(fabrica(x, z, alturaEn(x, z)));
}

function plantarBosque(grupo) {
  const muchos = esMovil() ? 140 : 260;
  for (let i = 0; i < muchos; i += 1) {
    const x = 24 + (i % 18) * 42 + (i % 5) * 7;
    const z = -24 - Math.floor(i / 18) * 40 - (i % 4) * 8;
    plantarSi(grupo, x, z, ["bosque"], crearArbol);
  }
  const palmas = esMovil() ? 28 : 55;
  for (let i = 0; i < palmas; i += 1) {
    const x = 40 + (i % 10) * 55 + (i % 3) * 12;
    const z = 30 + Math.floor(i / 10) * 48 + (i % 4) * 9;
    plantarSi(grupo, x, z, ["playa"], crearArbol);
  }
  const pinos = esMovil() ? 24 : 50;
  for (let i = 0; i < pinos; i += 1) {
    const x = -40 - (i % 9) * 48;
    const z = 60 + Math.floor(i / 9) * 52;
    plantarSi(grupo, x, z, ["montana"], crearArbol);
  }
  const rocas = esMovil() ? 40 : 80;
  for (let i = 0; i < rocas; i += 1) {
    const x = -30 - (i % 10) * 52;
    const z = 40 + Math.floor(i / 10) * 44;
    const esc = 1.1 + (i % 4) * 0.5;
    plantarSi(grupo, x, z, ["montana"], function (px, pz, py) {
      return crearRoca(px, pz, py, esc);
    });
  }
  const matas = esMovil() ? 50 : 90;
  for (let i = 0; i < matas; i += 1) {
    const x = 30 + (i % 14) * 38 + 8;
    const z = -40 - Math.floor(i / 14) * 36;
    plantarSi(grupo, x, z, ["bosque", "playa"], function (px, pz, py) {
      const m = crearArbusto();
      m.position.set(px, py, pz);
      return m;
    });
  }
  const extra = esMovil() ? 28 : 55;
  for (let i = 0; i < extra; i += 1) {
    plantarSi(grupo, 500 + (i % 8) * 48, -40 + Math.floor(i / 8) * 42, ["desierto"], crearArbol);
    plantarSi(grupo, 320 + (i % 7) * 50, -480 - Math.floor(i / 7) * 40, ["pradera"], crearArbol);
    plantarSi(grupo, -500 - (i % 7) * 42, 480 + Math.floor(i / 7) * 38, ["nieve"], crearArbol);
    plantarSi(grupo, -420 - (i % 7) * 40, -520 - Math.floor(i / 7) * 36, ["pantano"], crearArbol);
  }
}
