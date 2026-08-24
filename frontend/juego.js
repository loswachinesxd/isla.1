/*
  El director del juego.

  Maxi: este archivo no es un actor. Es quien dice
  "ahora camina", "ahora llueve", "ahora se ve el mapa".
  Junta todas las piezas, como el director de una película.
*/

(function () {
  const lienzo = document.getElementById("lienzo");
  const renderer = new THREE.WebGLRenderer({
    canvas: lienzo,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 700);
  const reloj = new THREE.Clock();

  const teclas = {};
  const toques = {
    arriba: false,
    abajo: false,
    izq: false,
    der: false,
    correr: false,
    saltar: false,
    usar: false,
  };

  const mundo = crearMundo(escena);
  const jugador = crearJugador();
  escena.add(jugador.mesh);
  const vehiculos = crearVehiculos(escena, mundo.puntos);
  const npcs = crearNPCs(escena);
  const perro = crearPerro(escena, mundo.puntos.perro);
  const misiones = crearMisiones();
  const conchas = crearConchas(escena, mundo.puntos.conchas);
  const clima = crearClima(escena);
  const marcador = crearMarcador(escena, 0xffd166);

  let modo = "portada";
  let dinero = 40;
  let compras = {};
  let vehiculo = null;
  let eAntes = false;
  let avisoTimer = 0;
  let dialogoTimer = 0;

  const hud = {
    zona: document.getElementById("hud-zona"),
    dinero: document.getElementById("hud-dinero"),
    hora: document.getElementById("hud-hora"),
    clima: document.getElementById("hud-clima"),
    mision: document.getElementById("hud-mision"),
    aviso: document.getElementById("aviso"),
    dialogo: document.getElementById("dialogo"),
    pista: document.getElementById("pista-tecla"),
  };
  const canvasMapa = document.getElementById("minimapa");

  function mostrar(id, si) {
    document.getElementById(id).classList.toggle("escondida", !si);
  }

  function avisar(texto) {
    hud.aviso.textContent = texto;
    hud.aviso.classList.add("visible");
    avisoTimer = 2.4;
  }

  function hablar(texto) {
    hud.dialogo.textContent = texto;
    hud.dialogo.classList.add("visible");
    dialogoTimer = 4;
  }

  function horaTexto(hora) {
    const h = Math.floor(hora);
    const m = Math.floor((hora - h) * 60);
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }

  function guardar() {
    const datos = {
      dinero,
      compras,
      misiones: misiones.map((m) => ({
        id: m.id,
        paso: m.paso,
        hecha: m.hecha,
        juntas: m.juntas || 0,
      })),
    };
    fetch("/api/cuaderno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).catch(function () {});
  }

  function cargar(datos) {
    if (!datos || typeof datos !== "object") return;
    if (typeof datos.dinero === "number") dinero = datos.dinero;
    if (datos.compras) compras = datos.compras;
    if (Array.isArray(datos.misiones)) {
      datos.misiones.forEach((guardada) => {
        const m = misionPorId(misiones, guardada.id);
        if (!m) return;
        m.paso = guardada.paso || 0;
        m.hecha = !!guardada.hecha;
        if (typeof guardada.juntas === "number") m.juntas = guardada.juntas;
      });
    }
    aplicarCompras(jugador, compras);
  }

  function pagar(cantidad, porQue) {
    dinero += cantidad;
    avisar(porQue + "  +$" + cantidad);
    guardar();
  }

  function completar(mision) {
    if (mision.hecha) return;
    mision.hecha = true;
    pagar(mision.recompensa, "Misión lista: " + mision.titulo);
  }

  function cerca(a, b, dist) {
    return Math.hypot(a.x - b.x, a.z - b.z) < dist;
  }

  function interactuar() {
    if (!document.getElementById("tienda").classList.contains("escondida")) return;

    if (vehiculo) {
      vehiculo.ocupado = false;
      jugador.mesh.visible = true;
      jugador.mesh.position.copy(vehiculo.mesh.position);
      jugador.mesh.position.x += 2.2;
      jugador.yaw = vehiculo.yaw;
      vehiculo.vel = 0;
      vehiculo = null;
      avisar("Bajaste del vehículo.");
      return;
    }

    const v = vehiculoCercano(jugador, vehiculos);
    if (v) {
      vehiculo = v;
      v.ocupado = true;
      jugador.mesh.visible = false;
      avisar(v.tipo === "moto" ? "¡Arriba de la moto!" : "¡Al auto!");
      return;
    }

    if (cerca(jugador.mesh.position, mundo.puntos.tienda, 6)) {
      abrirTienda();
      return;
    }

    const npc = npcCercano(jugador, npcs);
    if (npc) {
      hablar(npc.nombre + ": " + npc.dialogo);
      const perroM = misionPorId(misiones, "perro");
      const paquete = misionPorId(misiones, "paquete");
      const conchaM = misionPorId(misiones, "conchas");

      if (npc.id === "ana" && perroM && !perroM.hecha) {
        if (perroM.paso === 0) {
          perroM.paso = 1;
          perroM.texto = "Buscá a Luna en el bosque";
        } else if (perroM.paso === 2 && perro.siguiendo) {
          perro.siguiendo = false;
          perro.mesh.visible = false;
          completar(perroM);
          perroM.texto = "Luna ya está en casa";
        }
      }

      if (npc.id === "luis" && paquete && !paquete.hecha && paquete.paso === 0) {
        paquete.paso = 1;
        paquete.texto = "Llevá el paquete a la cabaña de la montaña";
        avisar("Agarraste el paquete.");
      }

      if (npc.id === "nico" && conchaM && !conchaM.hecha && conchaM.juntas >= 5) {
        completar(conchaM);
        conchaM.texto = "Nico está feliz con las conchas";
      }
      guardar();
    }
  }

  function abrirTienda() {
    mostrar("tienda", true);
    pintarTienda(document.getElementById("lista-tienda"), compras, dinero, comprar);
  }

  function cerrarTienda() {
    mostrar("tienda", false);
  }

  function comprar(item) {
    if (dinero < item.precio) {
      avisar("No te alcanza. Hacé una misión.");
      return;
    }
    if (compras[item.id] && item.id !== "snack") {
      avisar("Ya lo tenés.");
      return;
    }
    dinero -= item.precio;
    if (item.id !== "snack") compras[item.id] = true;
    aplicarCompras(jugador, compras);
    avisar("Compraste: " + item.nombre);
    pintarTienda(document.getElementById("lista-tienda"), compras, dinero, comprar);
    guardar();
  }

  function revisarMisiones() {
    const pos = jugador.mesh.position;
    const perroM = misionPorId(misiones, "perro");
    if (perroM && perroM.paso === 1 && !perro.encontrado && cerca(pos, mundo.puntos.perro, 4)) {
      perro.encontrado = true;
      perro.siguiendo = true;
      perroM.paso = 2;
      perroM.texto = "Devolvé a Luna con Ana";
      avisar("¡Encontraste a Luna!");
      guardar();
    }
    if (perro.siguiendo) {
      perro.mesh.position.lerp(
        new THREE.Vector3(pos.x + 1.2, alturaEn(pos.x, pos.z), pos.z + 1.2),
        0.12
      );
    }

    const conchaM = misionPorId(misiones, "conchas");
    conchas.forEach((c) => {
      if (c.tomada || !conchaM || conchaM.hecha) return;
      if (cerca(pos, c, 1.8)) {
        c.tomada = true;
        c.mesh.visible = false;
        conchaM.juntas += 1;
        conchaM.paso = conchaM.juntas;
        conchaM.texto = "Conchas " + conchaM.juntas + "/5. Lleváselas a Nico";
        avisar("Concha " + conchaM.juntas + " de 5");
        guardar();
      }
    });

    const paquete = misionPorId(misiones, "paquete");
    if (paquete && paquete.paso === 1 && !paquete.hecha && cerca(pos, mundo.puntos.cabana, 6)) {
      paquete.paso = 2;
      completar(paquete);
      paquete.texto = "El paquete llegó a la montaña";
    }
  }

  function pintarHud(zona) {
    hud.zona.textContent = nombreZona(zona);
    hud.dinero.textContent = "$ " + dinero;
    hud.hora.textContent = horaTexto(clima.hora);
    hud.clima.textContent = nombreClima(clima.tipo);
    hud.mision.textContent = textoMisionActiva(misiones);
    if (vehiculo) hud.pista.textContent = "E: bajar del " + (vehiculo.tipo === "moto" ? "moto" : "auto");
    else if (vehiculoCercano(jugador, vehiculos)) hud.pista.textContent = "E: subir al vehículo";
    else if (cerca(jugador.mesh.position, mundo.puntos.tienda, 6)) hud.pista.textContent = "E: entrar a la tienda";
    else if (npcCercano(jugador, npcs)) hud.pista.textContent = "E: hablar";
    else hud.pista.textContent = "E: hablar / subir";
  }

  function entrar() {
    modo = "juego";
    mostrar("portada", false);
    mostrar("ayuda", false);
    mostrar("hud", true);
    avisar("Bienvenido a Isla Maxi. Hablá con Ana.");
  }

  document.getElementById("btn-jugar").addEventListener("click", entrar);
  document.getElementById("btn-ayuda").addEventListener("click", function () {
    mostrar("ayuda", true);
  });
  document.getElementById("btn-cerrar-ayuda").addEventListener("click", function () {
    mostrar("ayuda", false);
  });
  document.getElementById("btn-cerrar-tienda").addEventListener("click", cerrarTienda);
  document.getElementById("btn-salir").addEventListener("click", function () {
    modo = "portada";
    mostrar("hud", false);
    mostrar("tienda", false);
    mostrar("portada", true);
    guardar();
  });

  window.addEventListener("keydown", function (ev) {
    teclas[ev.code] = true;
    if (ev.code === "Space") ev.preventDefault();
  });
  window.addEventListener("keyup", function (ev) {
    teclas[ev.code] = false;
  });

  document.querySelectorAll("[data-dir]").forEach((btn) => {
    const dir = btn.getAttribute("data-dir");
    const mapa = { arriba: "arriba", abajo: "abajo", izq: "izq", der: "der" };
    const poner = function (si) {
      toques[mapa[dir]] = si;
    };
    btn.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      poner(true);
    });
    btn.addEventListener("pointerup", function () {
      poner(false);
    });
    btn.addEventListener("pointerleave", function () {
      poner(false);
    });
  });
  document.getElementById("btn-correr").addEventListener("pointerdown", function () {
    toques.correr = true;
  });
  document.getElementById("btn-correr").addEventListener("pointerup", function () {
    toques.correr = false;
  });
  document.getElementById("btn-saltar").addEventListener("pointerdown", function () {
    toques.saltar = true;
  });
  document.getElementById("btn-saltar").addEventListener("pointerup", function () {
    toques.saltar = false;
  });
  document.getElementById("btn-usar").addEventListener("click", interactuar);

  window.addEventListener("resize", function () {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  fetch("/api/cuaderno")
    .then(function (r) {
      return r.json();
    })
    .then(cargar)
    .catch(function () {});

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(reloj.getDelta(), 0.05);
    const pos = vehiculo ? vehiculo.mesh.position : jugador.mesh.position;

    actualizarClima(clima, dt, escena, pos);
    actualizarAgua(mundo.agua, reloj.elapsedTime);
    actualizarNPCs(npcs, dt);

    if (modo === "juego") {
      const eAhora = !!(teclas.KeyE || toques.usar);
      if (eAhora && !eAntes) interactuar();
      eAntes = eAhora;
      toques.usar = false;

      if (vehiculo) {
        actualizarVehiculo(vehiculo, dt, teclas, mundo, toques);
        jugador.mesh.position.copy(vehiculo.mesh.position);
        seguirCamara(camara, vehiculo.mesh.position, vehiculo.yaw, 12, dt);
      } else {
        actualizarJugador(jugador, dt, teclas, mundo, toques);
        seguirCamara(camara, jugador.mesh.position, jugador.yaw, 8.5, dt);
      }
      revisarMisiones();
      const zona = zonaEn(
        vehiculo ? vehiculo.mesh.position.x : jugador.mesh.position.x,
        vehiculo ? vehiculo.mesh.position.z : jugador.mesh.position.z
      );

      const marks = marcadoresDeMision(misiones, mundo, perro);
      if (marks.length) {
        marcador.position.set(marks[0].x, alturaEn(marks[0].x, marks[0].z), marks[0].z);
        marcador.position.y += Math.sin(reloj.elapsedTime * 2) * 0.25;
        marcador.visible = true;
      } else {
        marcador.visible = false;
      }

      dibujarMinimapa(canvasMapa, jugador, vehiculo, marks);
      pintarHud(zona);
    } else {
      camara.position.set(-90, 28, 40);
      camara.lookAt(-40, 0, -20);
    }

    if (avisoTimer > 0) {
      avisoTimer -= dt;
      if (avisoTimer <= 0) hud.aviso.classList.remove("visible");
    }
    if (dialogoTimer > 0) {
      dialogoTimer -= dt;
      if (dialogoTimer <= 0) hud.dialogo.classList.remove("visible");
    }

    renderer.render(escena, camara);
  }

  tick();
})();
