/*
  El cuaderno de cada jugador.
  En internet se guarda en ESTE navegador, no en un papel compartido.
*/
const CLAVE_CUADERNO = "isla1-cuaderno";

function armarCuaderno(dinero, compras, misiones) {
  return {
    dinero: dinero,
    compras: compras,
    misiones: misiones.map((m) => ({
      id: m.id,
      paso: m.paso,
      hecha: m.hecha,
      juntas: m.juntas || 0,
    })),
  };
}

function guardarCuaderno(datos) {
  try {
    localStorage.setItem(CLAVE_CUADERNO, JSON.stringify(datos));
  } catch (e) {}
  fetch("/api/cuaderno", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).catch(function () {});
}

function leerCuadernoLocal() {
  try {
    const t = localStorage.getItem(CLAVE_CUADERNO);
    return t ? JSON.parse(t) : null;
  } catch (e) {
    return null;
  }
}

function pedirCuadernoServidor(alCargar) {
  fetch("/api/cuaderno")
    .then(function (r) {
      return r.json();
    })
    .then(alCargar)
    .catch(function () {});
}
