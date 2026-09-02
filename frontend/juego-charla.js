/*
  Encargos que se activan al hablar con alguien.
*/
function mJ(id) {
  return misionPorId(JUEGO.misiones, id);
}

function arrancar(mision, texto, aviso) {
  if (!mision || mision.hecha || mision.paso !== 0) return;
  mision.paso = 1;
  mision.texto = texto;
  if (aviso) avisar(aviso);
}

function entregarSi(mision, juntas, texto) {
  if (!mision || mision.hecha || (mision.juntas || 0) < juntas) return false;
  completar(mision);
  mision.texto = texto;
  return true;
}

function hablarMision(npc) {
  const perroM = mJ("perro");
  if (npc.id === "ana" && perroM && !perroM.hecha) {
    if (perroM.paso === 0) {
      perroM.paso = 1;
      perroM.texto = "Buscá a Luna en el bosque";
    } else if (perroM.paso === 2 && JUEGO.perro.siguiendo) {
      JUEGO.perro.siguiendo = false;
      JUEGO.perro.mesh.visible = false;
      completar(perroM);
      perroM.texto = "Luna ya está en casa";
    }
  }
  if (npc.id === "luis") arrancar(mJ("paquete"), "Llevá el paquete a la cabaña de la montaña", "Agarraste el paquete.");
  if (npc.id === "nico") {
    entregarSi(mJ("conchas"), 5, "Nico está feliz con las conchas");
    arrancar(mJ("boya"), "Nadá hasta la boya roja en el mar", "¡A nadar hacia la boya!");
  }
  if (npc.id === "kira") {
    if (!entregarSi(mJ("flores"), 6, "Kira armó un ramo")) {
      arrancar(mJ("flores"), "Juntá 6 flores rosas en el bosque", "Buscá flores entre los árboles.");
    }
  }
  if (npc.id === "omar") arrancar(mJ("mirador"), "Subí a la cima de las montañas", "La cima está más arriba.");
  if (npc.id === "lila") arrancar(mJ("tesoro"), "Buscá el cofre más allá de las sombrillas", "El cofre está en la playa lejana.");
  if (npc.id === "bela") {
    if (!entregarSi(mJ("manzanas"), 5, "Bela recuperó las manzanas")) {
      arrancar(mJ("manzanas"), "Juntá 5 manzanas en el bosque", "Las manzanas están entre los árboles.");
    }
  }
  const cartaM = mJ("carta");
  if (npc.id === "caminante1") arrancar(cartaM, "Llevá la carta a Tito", "Sofi te dio una carta.");
  if (npc.id === "caminante2" && cartaM && !cartaM.hecha && cartaM.paso === 1) {
    completar(cartaM);
    cartaM.texto = "Tito leyó la carta de Sofi";
  }
  if (npc.id === "paz") arrancar(mJ("gato"), "Buscá al gato gris cerca de la plaza", "El gato está por la plaza.");
  guardar();
}
