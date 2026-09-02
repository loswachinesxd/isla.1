/*
  Tecla E: auto, tienda o charla.
*/
function interactuar() {
  if (!document.getElementById("tienda").classList.contains("escondida")) return;
  const G = JUEGO;
  if (G.vehiculo) {
    const npc = npcCercaDe(G.vehiculo.mesh.position, G.npcs, 4.8);
    if (npc && hayAsiento(G.vehiculo)) {
      subirPasajero(G.vehiculo, npc);
      avisar(npc.nombre + " se subió. E otra vez para bajar.");
      return;
    }
    bajarPasajeros(G.vehiculo, G.escena);
    G.vehiculo.ocupado = false;
    G.jugador.mesh.visible = true;
    G.jugador.mesh.position.copy(G.vehiculo.mesh.position);
    G.jugador.mesh.position.x += 2.2;
    G.jugador.yaw = G.vehiculo.yaw;
    G.vehiculo.vel = 0;
    G.vehiculo = null;
    avisar("Bajaste del vehículo.");
    return;
  }
  const v = vehiculoCercano(G.jugador, G.vehiculos);
  if (v) {
    G.vehiculo = v;
    v.ocupado = true;
    G.jugador.mesh.visible = false;
    avisar(v.tipo === "moto" ? "¡Arriba de la moto!" : "¡Al auto!");
    return;
  }
  if (avionCercano(G.jugador.mesh.position, G.mundo.avion, 7)) {
    volarEnAvion();
    return;
  }
  const shop = tiendaCercana(G.jugador.mesh.position, 6);
  if (shop) {
    abrirTienda(shop);
    return;
  }
  const npc = npcCercano(G.jugador, G.npcs);
  if (npc) {
    hablar(npc.nombre + ": " + npc.dialogo);
    hablarMision(npc);
  }
}

function abrirTienda(shop) {
  JUEGO.tiendaAbierta = shop;
  document.getElementById("titulo-tienda").textContent = shop.nombre;
  mostrar("tienda", true);
  pintarTienda(document.getElementById("lista-tienda"), JUEGO.compras, JUEGO.dinero, comprar, shop.catalogo);
}

function cerrarTienda() {
  JUEGO.tiendaAbierta = null;
  mostrar("tienda", false);
}

function comprar(item) {
  const G = JUEGO;
  if (G.dinero < item.precio) {
    avisar("No te alcanza. Hacé una misión.");
    return;
  }
  if (G.compras[item.id] && !item.repetible) {
    avisar("Ya lo tenés.");
    return;
  }
  G.dinero -= item.precio;
  if (!item.repetible) G.compras[item.id] = true;
  aplicarCompras(G.jugador, G.compras);
  avisar("Compraste: " + item.nombre);
  const cat = G.tiendaAbierta ? G.tiendaAbierta.catalogo : "kiosco";
  pintarTienda(document.getElementById("lista-tienda"), G.compras, G.dinero, comprar, cat);
  guardar();
}
