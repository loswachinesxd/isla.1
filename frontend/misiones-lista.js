/*
  Lista de encargos.
*/
function mision(id, tipo, titulo, texto, recompensa, extra) {
  const base = { id: id, tipo: tipo, titulo: titulo, texto: texto, paso: 0, hecha: false, recompensa: recompensa };
  return extra ? Object.assign(base, extra) : base;
}

function crearMisiones() {
  return [
    mision("perro", "principal", "El perro perdido", "Hablá con Ana en la plaza", 80),
    mision("mirador", "principal", "La cima de la isla", "Hablá con Omar en las montañas", 90),
    mision("conchas", "secundaria", "Conchas de la playa", "Juntá 5 conchas en la playa", 40, { juntas: 0 }),
    mision("paquete", "secundaria", "El paquete de la montaña", "Hablá con Luis en la ciudad", 60),
    mision("flores", "secundaria", "Flores del bosque", "Hablá con Kira en el bosque", 50, { juntas: 0 }),
    mision("tesoro", "secundaria", "El cofre de la playa", "Hablá con Lila en la playa", 70),
    mision("boya", "secundaria", "Nadar hasta la boya", "Hablá con Nico y nadá hasta la boya del mar", 55),
    mision("manzanas", "secundaria", "Manzanas del bosque", "Hablá con Bela cerca de la ciudad", 45, { juntas: 0 }),
    mision("carta", "secundaria", "La carta de Sofi", "Hablá con Sofi en la ciudad", 35),
    mision("gato", "secundaria", "El gato de la plaza", "Hablá con Paz en la ciudad", 40),
  ];
}

function misionPorId(misiones, id) {
  return misiones.find((m) => m.id === id);
}

function textoMisionActiva(misiones) {
  const principal = misiones.find((m) => m.tipo === "principal" && !m.hecha);
  if (principal) return principal.texto;
  const extra = misiones.find((m) => !m.hecha);
  return extra ? extra.texto : "¡Listo! Paseá por la isla.";
}
