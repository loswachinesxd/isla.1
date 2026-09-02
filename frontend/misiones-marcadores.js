/*
  Puntos del minimapa según la misión activa.
*/
function empujarSi(lista, mision, cond, x, z, color) {
  if (mision && !mision.hecha && cond) lista.push({ x: x, z: z, color: color });
}

function marcadoresDeMision(misiones, mundo, perro) {
  const lista = [];
  const p = mundo.puntos;
  const perroM = misionPorId(misiones, "perro");
  empujarSi(lista, perroM, perroM && perroM.paso === 0, p.plaza.x, p.plaza.z, "#ffd166");
  empujarSi(lista, perroM, perroM && perroM.paso === 1 && perro && !perro.encontrado, p.perro.x, p.perro.z, "#ffd166");
  empujarSi(lista, perroM, perroM && perroM.paso === 2, p.plaza.x, p.plaza.z, "#ffd166");
  const mirador = misionPorId(misiones, "mirador");
  empujarSi(lista, mirador, mirador && mirador.paso === 0, -240, 160, "#cdb4db");
  empujarSi(lista, mirador, mirador && mirador.paso === 1, p.mirador.x, p.mirador.z, "#cdb4db");
  const conchas = misionPorId(misiones, "conchas");
  empujarSi(lista, conchas, true, p.conchas[0].x, p.conchas[0].z, "#90e0ef");
  const paquete = misionPorId(misiones, "paquete");
  empujarSi(lista, paquete, paquete && paquete.paso === 0, -104, -86, "#bde0fe");
  empujarSi(lista, paquete, paquete && paquete.paso === 1, p.cabana.x, p.cabana.z, "#bde0fe");
  const flores = misionPorId(misiones, "flores");
  empujarSi(lista, flores, flores && flores.paso === 0, 70, -70, "#ff85a1");
  empujarSi(lista, flores, flores && flores.paso !== 0, p.flores[0].x, p.flores[0].z, "#ff85a1");
  const tesoro = misionPorId(misiones, "tesoro");
  empujarSi(lista, tesoro, tesoro && tesoro.paso === 0, 80, 40, "#ffd166");
  empujarSi(lista, tesoro, tesoro && tesoro.paso === 1, p.tesoro.x, p.tesoro.z, "#ffd166");
  const boya = misionPorId(misiones, "boya");
  empujarSi(lista, boya, boya && boya.paso === 0, 58, 40, "#ff6b6b");
  empujarSi(lista, boya, boya && boya.paso === 1, p.boya.x, p.boya.z, "#ff6b6b");
  const manzanas = misionPorId(misiones, "manzanas");
  empujarSi(lista, manzanas, manzanas && manzanas.paso === 0, -40, -130, "#e63946");
  empujarSi(lista, manzanas, manzanas && manzanas.paso !== 0, p.manzanas[0].x, p.manzanas[0].z, "#e63946");
  const carta = misionPorId(misiones, "carta");
  empujarSi(lista, carta, carta && carta.paso === 0, -140, -90, "#cdb4db");
  empujarSi(lista, carta, carta && carta.paso === 1, -50, -60, "#cdb4db");
  const gato = misionPorId(misiones, "gato");
  empujarSi(lista, gato, gato && gato.paso === 0, -20, -90, "#8d99ae");
  empujarSi(lista, gato, gato && gato.paso === 1, p.gato.x, p.gato.z, "#8d99ae");
  lista.push({ x: p.tienda.x, z: p.tienda.z, color: "#fff" });
  return lista;
}
