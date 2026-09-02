/*
  Pintar góndola y aplicar lo comprado.
*/
function pintarTienda(caja, compras, dinero, onComprar, catalogoId) {
  caja.innerHTML = "";
  const lista = CATALOGOS[catalogoId] || CATALOGOS.kiosco;
  lista.forEach((item) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    const ya = compras[item.id];
    const texto = document.createElement("div");
    texto.innerHTML = "<strong>" + item.nombre + "</strong><br/><span>" + item.detalle + "</span>";
    const boton = document.createElement("button");
    boton.type = "button";
    if (ya && !item.repetible) {
      boton.textContent = "Ya lo tenés";
      boton.disabled = true;
    } else {
      boton.textContent = "$ " + item.precio;
      boton.addEventListener("click", function () {
        onComprar(item);
      });
    }
    tarjeta.appendChild(texto);
    tarjeta.appendChild(boton);
    caja.appendChild(tarjeta);
  });
}

function asegurarMochila(jugador) {
  const partes = jugador.mesh.userData.partes;
  if (!partes || partes.mochila) return;
  const mochila = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.48, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x386641, roughness: 0.7 })
  );
  mochila.position.set(0, 1.28, -0.32);
  jugador.mesh.add(mochila);
  partes.mochila = mochila;
}

function aplicarCompras(jugador, compras) {
  jugador.velocidadCorrer = compras.zapatillas ? 18 : 13;
  jugador.velocidadNadar = compras.tabla ? 6.2 : 4.2;
  jugador.salto = compras.botas ? 10.2 : 8.5;
  const partes = jugador.mesh.userData.partes;
  if (partes && partes.gorra) {
    partes.gorra.visible = !!compras.gorra;
    if (partes.visera) partes.visera.visible = !!compras.gorra;
  }
  if (compras.mochila) {
    asegurarMochila(jugador);
    const p = jugador.mesh.userData.partes;
    if (p && p.mochila) p.mochila.visible = true;
  } else if (partes && partes.mochila) {
    partes.mochila.visible = false;
  }
}
