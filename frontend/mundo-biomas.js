/*
  Biomas: cada rincón de la isla tiene su piso.
*/
function zonaEn(x, z) {
  if (x < -280 && z > 420) return "nieve";
  if (x < -280 && z < -480) return "pantano";
  if (x > 280 && z < -420) return "pradera";
  if (x > 480 && z > -220 && z < 260 && x + z < 780) return "desierto";
  if (x >= 0 && z >= 0) {
    if (x > 220 && z > 220 && x + z > 620) return "agua";
    return "playa";
  }
  if (x < 0 && z >= 0) return "montana";
  if (x >= 0 && z < 0) return "bosque";
  return "ciudad";
}

function nombreZona(zona) {
  const n = {
    ciudad: "Ciudad",
    bosque: "Bosque",
    montana: "Montañas",
    playa: "Playa",
    agua: "Mar",
    pradera: "Pradera",
    desierto: "Desierto",
    nieve: "Nieve",
    pantano: "Pantano",
  };
  return n[zona] || "Isla";
}

function esAgua(x, z) {
  return zonaEn(x, z) === "agua";
}

function alturaEn(x, z) {
  const zona = zonaEn(x, z);
  if (zona === "agua") return AGUA_Y - 0.8;
  if (zona === "playa") return 0.08 + ruidoSuave(x * 0.035, z * 0.035) * 0.42;
  if (zona === "ciudad") return 0;
  if (zona === "bosque") return ruidoSuave(x * 0.022, z * 0.022) * 4.4;
  if (zona === "pradera") return 0.12 + ruidoSuave(x * 0.028, z * 0.028) * 1.6;
  if (zona === "desierto") return 0.18 + ruidoSuave(x * 0.016, z * 0.016) * 4.8;
  if (zona === "nieve") return 7 + ruidoSuave(x * 0.014, z * 0.014) * 18;
  if (zona === "pantano") return 0.05 + ruidoSuave(x * 0.05, z * 0.05) * 0.5;
  return 1.8 + ruidoSuave(x * 0.016, z * 0.016) * 22 + ruidoSuave(x * 0.07, z * 0.07) * 3.2;
}

function colorZona(zona) {
  const c = {
    ciudad: new THREE.Color(0x6f675c),
    bosque: new THREE.Color(0x3a5c28),
    montana: new THREE.Color(0x8a8478),
    playa: new THREE.Color(0xd4b56a),
    agua: new THREE.Color(0x1f6fad),
    pradera: new THREE.Color(0x6a9a3a),
    desierto: new THREE.Color(0xc9a56b),
    nieve: new THREE.Color(0xe4eaf0),
    pantano: new THREE.Color(0x3a4a30),
  };
  return c[zona] || c.ciudad;
}

function colorCssZona(zona) {
  const c = {
    ciudad: "#8b7f70",
    bosque: "#3d8c40",
    montana: "#c5ccd4",
    playa: "#e7d089",
    agua: "#2a7ec4",
    pradera: "#8bc34a",
    desierto: "#e0c078",
    nieve: "#eef4f8",
    pantano: "#4a5c3a",
  };
  return c[zona] || "#888";
}
