/*
  El director: cada fotograma mueve el mundo.
*/
const local = leerCuadernoLocal();
if (local) cargar(local);
else pedirCuadernoServidor(cargar);
conectarControles();

function tick() {
  requestAnimationFrame(tick);
  const G = JUEGO;
  const dt = Math.min(G.reloj.getDelta(), 0.05);
  const pos = G.vehiculo ? G.vehiculo.mesh.position : G.jugador.mesh.position;
  actualizarClima(G.clima, dt, G.escena, pos);
  actualizarAgua(G.mundo.agua, G.reloj.elapsedTime);
  actualizarNubes(G.mundo.nubes, dt);
  actualizarNPCs(G.npcs, dt);
  if (G.modo === "juego") {
    const inerte = tickVida(dt);
    if (!inerte && !G.escribiendo) {
      const eAhora = !!(G.teclas.KeyE || G.toques.usar);
      if (eAhora && !G.eAntes) interactuar();
      G.eAntes = eAhora;
      G.toques.usar = false;
      if (G.vehiculo) {
        actualizarVehiculo(G.vehiculo, dt, G.teclas, G.mundo, G.toques);
        G.jugador.mesh.position.copy(G.vehiculo.mesh.position);
        seguirCamara(G.camara, G.vehiculo.mesh.position, G.vehiculo.yaw, 12, dt);
        revisarAtropello(G.vehiculo, G.npcs);
      } else {
        actualizarJugador(G.jugador, dt, G.teclas, G.mundo, G.toques);
        seguirCamara(G.camara, G.jugador.mesh.position, G.jugador.yaw, 8.5, dt);
      }
      tickPelea(dt);
      revisarMisiones();
    } else {
      const obj = G.vehiculo ? G.vehiculo.mesh.position : G.jugador.mesh.position;
      const yaw = G.vehiculo ? G.vehiculo.yaw : G.jugador.yaw;
      seguirCamara(G.camara, obj, yaw, G.vehiculo ? 12 : 8.5, dt);
    }
    const px = G.vehiculo ? G.vehiculo.mesh.position.x : G.jugador.mesh.position.x;
    const pz = G.vehiculo ? G.vehiculo.mesh.position.z : G.jugador.mesh.position.z;
    const marks = marcadoresDeMision(G.misiones, G.mundo, G.perro);
    if (marks.length) {
      G.marcador.position.set(marks[0].x, alturaEn(marks[0].x, marks[0].z), marks[0].z);
      G.marcador.position.y += Math.sin(G.reloj.elapsedTime * 2) * 0.25;
      G.marcador.visible = true;
    } else {
      G.marcador.visible = false;
    }
    dibujarMinimapa(G.canvasMapa, G.jugador, G.vehiculo, marks);
    pintarHud(zonaEn(px, pz));
  } else {
    G.camara.position.set(-90, 28, 40);
    G.camara.lookAt(-40, 0, -20);
  }
  tickAvisos(dt);
  G.renderer.render(G.escena, G.camara);
}

tick();
