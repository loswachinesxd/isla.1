/*
  Tiendas: cada una tiene su góndola.
  Entrá con E, como abrir la puerta del kiosco.
*/
const TIENDAS = [
  { id: "kiosco", nombre: "Kiosco de Mora", x: -62, z: -108, color: 0xd9a441, toldo: 0xc1121f, catalogo: "kiosco" },
  { id: "ropa", nombre: "Ropa de la isla", x: -28, z: -78, color: 0x4a6fa5, toldo: 0x1d3557, catalogo: "ropa" },
  { id: "playa", nombre: "Bazar de la playa", x: 102, z: 38, color: 0xe9c46a, toldo: 0x00b4d8, catalogo: "playa" },
  { id: "bosque", nombre: "Puesto del bosque", x: 52, z: -48, color: 0x6a994e, toldo: 0x386641, catalogo: "bosque" },
  { id: "refugio", nombre: "Refugio de montaña", x: -268, z: 268, color: 0x8b5a2b, toldo: 0x6d4c41, catalogo: "montana" },
];

const CATALOGOS = {
  kiosco: [
    { id: "snack", nombre: "Jugo de mango", detalle: "Está rico. No hace magia.", precio: 8, repetible: true },
    { id: "chocolate", nombre: "Chocolate", detalle: "Otro gusto, misma idea.", precio: 10, repetible: true },
    { id: "gorra", nombre: "Gorra de la isla", detalle: "Se ve en tu cabeza.", precio: 25 },
  ],
  ropa: [
    { id: "zapatillas", nombre: "Zapatillas rápidas", detalle: "Corrés más.", precio: 50 },
    { id: "lentes", nombre: "Lentes de sol", detalle: "Para lucirte de día.", precio: 30 },
  ],
  playa: [
    { id: "tabla", nombre: "Tabla de nado", detalle: "Nadás más rápido.", precio: 45 },
    { id: "snack_playa", nombre: "Agua de coco", detalle: "Sabe a vacaciones.", precio: 12, repetible: true },
  ],
  bosque: [
    { id: "mochila", nombre: "Mochila verde", detalle: "Va en tu espalda.", precio: 35 },
    { id: "snack_bosque", nombre: "Manzana asada", detalle: "Un refrigerio.", precio: 9, repetible: true },
  ],
  montana: [
    { id: "botas", nombre: "Botas de loma", detalle: "Un poco más de salto.", precio: 55 },
    { id: "snack_frio", nombre: "Chocolate caliente", detalle: "Para el frío de mentira.", precio: 11, repetible: true },
  ],
};

function tiendaCercana(pos, dist) {
  let mejor = null;
  let dMejor = dist;
  TIENDAS.forEach((t) => {
    const d = Math.hypot(pos.x - t.x, pos.z - t.z);
    if (d < dMejor) {
      dMejor = d;
      mejor = t;
    }
  });
  return mejor;
}
