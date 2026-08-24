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

  ctx.fillStyle = "#8b909a";
  ctx.fillRect(0, h / 2, w / 2, h / 2);
  ctx.fillStyle = "#3d8c40";
  ctx.fillRect(w / 2, h / 2, w / 2, h / 2);
  ctx.fillStyle = "#c5ccd4";
  ctx.fillRect(0, 0, w / 2, h / 2);
  ctx.fillStyle = "#e7d089";
  ctx.fillRect(w / 2, 0, w / 2, h / 2);
  ctx.fillStyle = "#2a7ec4";
  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.lineTo(w, h * 0.28);
  ctx.lineTo(w * 0.72, 0);
  ctx.closePath();
  ctx.fill();

  function mundoAPantalla(x, z) {
    return {
      px: ((x + MITAD_MAPA) / LADO_MAPA) * w,
      py: ((MITAD_MAPA - z) / LADO_MAPA) * h,
    };
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
