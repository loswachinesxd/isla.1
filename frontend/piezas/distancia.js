/*
  ¿Estoy cerca? Como medir con los pasos.
*/
function cerca(a, b, dist) {
  return Math.hypot(a.x - b.x, a.z - b.z) < dist;
}
