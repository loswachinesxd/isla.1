/*
  Vecinos de la isla (datos).
*/
function vecino(id, nombre, ropa, pantalon, pelo, ojos, dialogo, x, z, puntos) {
  return { id, nombre, ropa, pantalon, pelo, ojos, dialogo, x, z, puntos };
}

const VECINOS = [
  vecino("ana", "Ana", 0xe07a5f, 0x4a3040, 0x2b1a12, 0x4a7c59, "¡Se me perdió Luna en el bosque! ¿Me ayudás a buscarla?", -82, -98, [{ x: -82, z: -98 }, { x: -100, z: -82 }, { x: -78, z: -74 }]),
  vecino("luis", "Luis", 0x3d405b, 0x1f2430, 0x1a1a1a, 0x3d5a80, "Tengo un paquete para la cabaña de la montaña.", -104, -86, [{ x: -104, z: -86 }, { x: -130, z: -90 }, { x: -112, z: -70 }]),
  vecino("nico", "Nico", 0xf4a261, 0x3a5060, 0x6b3a1a, 0x2a6f97, "En la playa hay conchas. Si juntás 5, te pago. Y si nadás a la boya, mejor.", 58, 40, [{ x: 58, z: 40 }, { x: 72, z: 52 }, { x: 50, z: 58 }]),
  vecino("caminante1", "Sofi", 0x81b29a, 0x3d4f44, 0xc9a227, 0x5b8c5a, "Mirá la hora arriba. Si ves a Tito, dale esta carta.", -140, -90, [{ x: -140, z: -90 }, { x: -140, z: -130 }, { x: -50, z: -130 }, { x: -50, z: -90 }]),
  vecino("caminante2", "Tito", 0x9b5de5, 0x2d1b4a, 0x3b2416, 0x6a4c93, "El auto rojo está en la plaza. La moto es más rápida.", -50, -60, [{ x: -50, z: -60 }, { x: -150, z: -60 }, { x: -150, z: -40 }, { x: -70, z: -40 }]),
  vecino("tendero", "Mora", 0x2a9d8f, 0x1d4e4a, 0x4a2c14, 0x2a6f6a, "Hay cinco tiendas. La mía es la amarilla. Entrá con E.", -62, -100, [{ x: -62, z: -100 }, { x: -54, z: -100 }]),
  vecino("kira", "Kira", 0x90be6d, 0x3a5a40, 0x6b2d5b, 0x3d6b4f, "En el bosque hay flores rosas. Si juntás 6, te doy monedas.", 70, -70, [{ x: 70, z: -70 }, { x: 95, z: -95 }, { x: 55, z: -110 }]),
  vecino("omar", "Omar", 0x577590, 0x2c3e50, 0x1f1a16, 0x4a6fa5, "Subí a la cima. Desde ahí se ve toda la isla.", -240, 160, [{ x: -240, z: 160 }, { x: -255, z: 185 }, { x: -220, z: 175 }]),
  vecino("lila", "Lila", 0xf72585, 0x3d1a40, 0x8b1e3f, 0x5a3d8c, "Hay un cofre escondido más allá de las sombrillas.", 80, 40, [{ x: 80, z: 40 }, { x: 100, z: 28 }, { x: 70, z: 22 }]),
  vecino("bela", "Bela", 0xe63946, 0x3d0c12, 0x7a3e12, 0x6b3a2a, "Se me cayeron las manzanas en el bosque. ¿Me las juntás?", -40, -130, [{ x: -40, z: -130 }, { x: -20, z: -118 }, { x: -55, z: -145 }]),
  vecino("paz", "Paz", 0x48cae4, 0x023e8a, 0xf4d35e, 0x0077b6, "Vi un gato gris cerca de la plaza. Es muy tímido.", -20, -90, [{ x: -20, z: -90 }, { x: -20, z: -50 }, { x: -70, z: -50 }]),
  vecino("gabo", "Gabo", 0xf77f00, 0x4a2c0a, 0x1a1a1a, 0x3d5a80, "Si corrés con Shift, llegás más rápido a todos lados.", -160, -40, [{ x: -160, z: -40 }, { x: -200, z: -80 }, { x: -170, z: -120 }, { x: -120, z: -70 }]),
  vecino("nuri", "Nuri", 0xffc8dd, 0x5a3d52, 0x3b1f2b, 0x9b5de5, "La playa tiene dos sombrillas. Ahí da sombra rica.", 100, 70, [{ x: 100, z: 70 }, { x: 130, z: 55 }, { x: 90, z: 90 }]),
  vecino("enzo", "Enzo", 0x457b9d, 0x1d3557, 0x4a2c14, 0x2a6f97, "De noche se prenden los faroles. El cielo se llena de estrellas.", -200, -160, [{ x: -200, z: -160 }, { x: -230, z: -190 }, { x: -180, z: -200 }]),
];
