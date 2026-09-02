/*
  Arranque: pantalla 3D y piezas del mundo.
*/
const JUEGO = {};

(function armarJuego() {
  const lienzo = document.getElementById("lienzo");
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  if (renderer.physicallyCorrectLights !== undefined) renderer.physicallyCorrectLights = true;
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

  const escena = new THREE.Scene();
  const mundo = crearMundo(escena);
  const jugador = crearJugador();
  escena.add(jugador.mesh);

  JUEGO.renderer = renderer;
  JUEGO.escena = escena;
  JUEGO.camara = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1800);
  JUEGO.reloj = new THREE.Clock();
  JUEGO.teclas = {};
  JUEGO.toques = { arriba: false, abajo: false, izq: false, der: false, correr: false, saltar: false, usar: false };
  JUEGO.mundo = mundo;
  JUEGO.jugador = jugador;
  JUEGO.vehiculos = crearVehiculos(escena, mundo.puntos);
  JUEGO.npcs = crearNPCs(escena);
  JUEGO.perro = crearPerro(escena, mundo.puntos.perro);
  JUEGO.misiones = crearMisiones();
  JUEGO.conchas = crearConchas(escena, mundo.puntos.conchas);
  JUEGO.flores = crearFlores(escena, mundo.puntos.flores);
  JUEGO.boya = crearBoya(escena, mundo.puntos.boya);
  JUEGO.tesoro = crearTesoro(escena, mundo.puntos.tesoro);
  JUEGO.manzanas = crearManzanas(escena, mundo.puntos.manzanas);
  JUEGO.gato = crearGato(escena, mundo.puntos.gato);
  JUEGO.clima = crearClima(escena);
  JUEGO.marcador = crearMarcador(escena, 0xffd166);
  JUEGO.modo = "portada";
  JUEGO.dinero = 40;
  JUEGO.compras = {};
  JUEGO.vehiculo = null;
  JUEGO.eAntes = false;
  JUEGO.avisoTimer = 0;
  JUEGO.dialogoTimer = 0;
  JUEGO.tiendaAbierta = null;
  JUEGO.canvasMapa = document.getElementById("minimapa");
})();
