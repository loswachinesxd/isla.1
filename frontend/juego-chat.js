/*
  Chat de la isla. Los vecinos responden cerca.
*/
function ponerChat(quien, texto) {
  const log = document.getElementById("chat-log");
  if (!log) return;
  const p = document.createElement("p");
  p.innerHTML = "<strong>" + quien + ":</strong> " + texto;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 12) log.removeChild(log.firstChild);
}

function abrirChat() {
  JUEGO.escribiendo = true;
  const caja = document.getElementById("chat-texto");
  if (caja) caja.focus();
}

function cerrarChat() {
  JUEGO.escribiendo = false;
  const caja = document.getElementById("chat-texto");
  if (caja) caja.blur();
}

function enviarChat(texto) {
  const t = String(texto || "").trim();
  if (!t) return;
  const nombre = JUEGO.nombre || "Maxi";
  if (t.charAt(0) === "/") {
    ponerChat(nombre, t);
    correrComando(t);
    return;
  }
  ponerChat(nombre, t);
  const npc = npcCercano(JUEGO.jugador, JUEGO.npcs);
  if (npc) {
    ponerChat(npc.nombre, npc.dialogo);
    hablar(npc.nombre + ": " + npc.dialogo);
  } else {
    ponerChat("isla", "Nadie cerca. Acercate a un vecino o usá /ayuda.");
  }
}

function conectarChat() {
  const form = document.getElementById("chat-form");
  const caja = document.getElementById("chat-texto");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    enviarChat(caja.value);
    caja.value = "";
    cerrarChat();
  });
  caja.addEventListener("focus", function () {
    JUEGO.escribiendo = true;
  });
  caja.addEventListener("blur", function () {
    JUEGO.escribiendo = false;
  });
  const btn = document.getElementById("btn-chat");
  if (btn) btn.addEventListener("click", abrirChat);
  ponerChat("isla", "T para escribir. /ayuda para comandos.");
}
