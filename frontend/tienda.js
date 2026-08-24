/*
  La tienda.

  Maxi: acá cambiás monedas por cosas.
  Es como un kiosco: ves el precio y comprás si te alcanza.
*/

const ARTICULOS = [
  {
    id: "zapatillas",
    nombre: "Zapatillas rápidas",
    detalle: "Corrés más. Como tener el viento a favor.",
    precio: 50,
  },
  {
    id: "gorra",
    nombre: "Gorra de la isla",
    detalle: "Se ve en tu cabeza. Solo para lucirte.",
    precio: 25,
  },
  {
    id: "snack",
    nombre: "Jugo de mango",
    detalle: "No hace nada raro. Está rico igual.",
    precio: 8,
  },
];

function pintarTienda(caja, compras, dinero, onComprar) {
  caja.innerHTML = "";
  ARTICULOS.forEach((item) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    const ya = compras[item.id];
    const texto = document.createElement("div");
    texto.innerHTML = `<strong>${item.nombre}</strong><br/><span>${item.detalle}</span>`;
    const boton = document.createElement("button");
    boton.type = "button";
    if (ya && item.id !== "snack") {
      boton.textContent = "Ya lo tenés";
      boton.disabled = true;
    } else {
      boton.textContent = "$ " + item.precio;
      boton.addEventListener("click", () => onComprar(item));
    }
    tarjeta.appendChild(texto);
    tarjeta.appendChild(boton);
    caja.appendChild(tarjeta);
  });
}

function aplicarCompras(jugador, compras) {
  if (compras.zapatillas) jugador.velocidadCorrer = 18;
  const gorra = jugador.mesh.userData.partes && jugador.mesh.userData.partes.gorra;
  if (gorra) gorra.visible = !!compras.gorra;
}
