/*
  El minimapa.

  Maxi: es un mapa chiquito, como el de un GPS.
  Vos sos la flechita. Los puntitos son misiones y la tienda.
*/

function dibujarMinimapa(canvas, jugador, vehiculo, marcadores) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const pasos = 28;
  for (let iy = 0; iy < pasos; iy += 1) {
    for (let ix = 0; ix < pasos; ix += 1) {
      const x = (ix / pasos) * LADO_MAPA - MITAD_MAPA;
      const z = MITAD_MAPA - (iy / pasos) * LADO_MAPA;
      ctx.fillStyle = colorCssZona(zonaEn(x, z));
      ctx.fillRect((ix / pasos) * w, (iy / pasos) * h, w / pasos + 1, h / pasos + 1);
    }
  }

  function mundoAPantalla(x, z) {
    return {
      px: ((x + MITAD_MAPA) / LADO_MAPA) * w,
      py: ((MITAD_MAPA - z) / LADO_MAPA) * h,
    };
  }

  if (JUEGO.mundo && JUEGO.mundo.puntos.aeropuerto) {
    const a = mundoAPantalla(JUEGO.mundo.puntos.aeropuerto.x, JUEGO.mundo.puntos.aeropuerto.z);
    ctx.fillStyle = "#2b2f36";
    ctx.fillRect(a.px - 2, a.py - 9, 4, 18);
  }

  marcadores.forEach((m) => {
    const p = mundoAPantalla(m.x, m.z);
    ctx.fillStyle = m.color || "#ffd166";
    ctx.beginPath();
    ctx.arc(p.px, p.py, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const pos = vehiculo ? vehiculo.mesh.position : jugador.mesh.position;
  const yaw = vehiculo ? vehiculo.yaw : jugador.yaw;
  const yo = mundoAPantalla(pos.x, pos.z);
  ctx.save();
  ctx.translate(yo.px, yo.py);
  ctx.rotate(-yaw);
  ctx.fillStyle = "#ff3b3b";
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(5, 6);
  ctx.lineTo(-5, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
}
