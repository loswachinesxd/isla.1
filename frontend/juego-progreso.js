/*
  Avance de misiones mientras caminás.
*/
function revisarMisiones() {
  const G = JUEGO;
  const pos = G.jugador.mesh.position;
  const perroM = misionPorId(G.misiones, "perro");
  if (perroM && perroM.paso === 1 && !G.perro.encontrado && cerca(pos, G.mundo.puntos.perro, 4)) {
    G.perro.encontrado = true;
    G.perro.siguiendo = true;
    perroM.paso = 2;
    perroM.texto = "Devolvé a Luna con Ana";
    avisar("¡Encontraste a Luna!");
    guardar();
  }
  if (G.perro.siguiendo) {
    G.perro.mesh.position.lerp(new THREE.Vector3(pos.x + 1.2, alturaEn(pos.x, pos.z), pos.z + 1.2), 0.12);
  }
  recogerLista(G.conchas, misionPorId(G.misiones, "conchas"), 5, "Conchas");
  const paquete = misionPorId(G.misiones, "paquete");
  if (paquete && paquete.paso === 1 && !paquete.hecha && cerca(pos, G.mundo.puntos.cabana, 6)) {
    paquete.paso = 2;
    completar(paquete);
    paquete.texto = "El paquete llegó a la montaña";
  }
  recogerLista(G.flores, misionPorId(G.misiones, "flores"), 6, "Flores");
  const tesoroM = misionPorId(G.misiones, "tesoro");
  if (tesoroM && !tesoroM.hecha && !G.tesoro.tomado && cerca(pos, G.tesoro, 2.4)) {
    G.tesoro.tomado = true;
    G.tesoro.mesh.visible = false;
    tesoroM.paso = 2;
    completar(tesoroM);
    tesoroM.texto = "Abriste el cofre de la playa";
  }
  const boyaM = misionPorId(G.misiones, "boya");
  if (boyaM && !boyaM.hecha && cerca(pos, G.boya, 3.5)) {
    boyaM.paso = 2;
    G.boya.mesh.visible = false;
    completar(boyaM);
    boyaM.texto = "Llegaste a la boya";
  }
  const mirador = misionPorId(G.misiones, "mirador");
  if (mirador && !mirador.hecha && cerca(pos, G.mundo.puntos.mirador, 8)) {
    mirador.paso = 2;
    completar(mirador);
    mirador.texto = "Viste toda la isla desde la cima";
  }
  recogerLista(G.manzanas, misionPorId(G.misiones, "manzanas"), 5, "Manzanas");
  const gatoM = misionPorId(G.misiones, "gato");
  if (gatoM && !gatoM.hecha && !G.gato.encontrado && cerca(pos, G.gato, 2.6)) {
    G.gato.encontrado = true;
    G.gato.mesh.visible = false;
    gatoM.paso = 2;
    completar(gatoM);
    gatoM.texto = "Encontraste al gato de Paz";
  }
}
