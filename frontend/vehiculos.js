/*
  Vehículos: autos y motos.

  Maxi: un vehículo es un atajo. El auto es estable,
  como una bicicleta con rueditas. La moto es más rápida,
  como una bicicleta de verdad.
*/

function crearRueda(x, y, z) {
  const rueda = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.28, 10),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
  );
  rueda.rotation.z = Math.PI / 2;
  rueda.position.set(x, y, z);
  return rueda;
}

function crearAuto() {
  const grupo = new THREE.Group();
  const carroceria = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.7, 4.2),
    new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.45, metalness: 0.2 })
  );
  carroceria.position.y = 0.7;
  carroceria.castShadow = true;
  const techo = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.7, 2.1),
    new THREE.MeshStandardMaterial({ color: 0xf1faee, roughness: 0.5 })
  );
  techo.position.set(0, 1.35, -0.2);
  grupo.add(carroceria, techo);
  grupo.add(crearRueda(-1.05, 0.38, 1.3));
  grupo.add(crearRueda(1.05, 0.38, 1.3));
  grupo.add(crearRueda(-1.05, 0.38, -1.3));
  grupo.add(crearRueda(1.05, 0.38, -1.3));
  return grupo;
}

function crearMoto() {
  const grupo = new THREE.Group();
  const cuerpo = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.45, 2.1),
    new THREE.MeshStandardMaterial({ color: 0x457b9d, roughness: 0.4, metalness: 0.25 })
  );
  cuerpo.position.y = 0.65;
  cuerpo.castShadow = true;
  const asiento = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.18, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  asiento.position.set(0, 0.95, -0.15);
  grupo.add(cuerpo, asiento);
  grupo.add(crearRueda(0, 0.38, 0.85));
  grupo.add(crearRueda(0, 0.38, -0.85));
  return grupo;
}

function crearVehiculos(escena, puntos) {
  const auto = {
    tipo: "auto",
    mesh: crearAuto(),
    vel: 0,
    yaw: 0,
    ocupado: false,
    pasajeros: [],
    maxVel: 22,
  };
  auto.mesh.position.set(puntos.auto.x, alturaEn(puntos.auto.x, puntos.auto.z), puntos.auto.z);
  const moto = {
    tipo: "moto",
    mesh: crearMoto(),
    vel: 0,
    yaw: 0,
    ocupado: false,
    pasajeros: [],
    maxVel: 30,
  };
  moto.mesh.position.set(puntos.moto.x, alturaEn(puntos.moto.x, puntos.moto.z), puntos.moto.z);
  escena.add(auto.mesh, moto.mesh);
  return [auto, moto];
}

function vehiculoCercano(jugador, vehiculos) {
  const p = jugador.mesh.position;
  let mejor = null;
  let distMejor = 4.2;
  vehiculos.forEach((v) => {
    const d = p.distanceTo(v.mesh.position);
    if (d < distMejor) {
      distMejor = d;
      mejor = v;
    }
  });
  return mejor;
}

function actualizarVehiculo(vehiculo, dt, teclas, mundo, toques) {
  const adelante = teclas.KeyW || teclas.ArrowUp || toques.arriba;
  const atras = teclas.KeyS || teclas.ArrowDown || toques.abajo;
  const izq = teclas.KeyA || teclas.ArrowLeft || toques.izq;
  const der = teclas.KeyD || teclas.ArrowRight || toques.der;
  const acel = vehiculo.tipo === "moto" ? 18 : 12;

  if (adelante) vehiculo.vel += acel * dt;
  else if (atras) vehiculo.vel -= acel * 0.7 * dt;
  else vehiculo.vel *= 0.98;

  vehiculo.vel = THREE.MathUtils.clamp(vehiculo.vel, -8, vehiculo.maxVel);
  const giro = (vehiculo.tipo === "moto" ? 1.8 : 1.35) * dt * Math.sign(Math.abs(vehiculo.vel) + 0.01);
  if (izq) vehiculo.yaw += giro * Math.max(Math.abs(vehiculo.vel) / 10, 0.4);
  if (der) vehiculo.yaw -= giro * Math.max(Math.abs(vehiculo.vel) / 10, 0.4);

  const pos = vehiculo.mesh.position;
  const dx = -Math.sin(vehiculo.yaw) * vehiculo.vel * dt;
  const dz = -Math.cos(vehiculo.yaw) * vehiculo.vel * dt;
  const nx = THREE.MathUtils.clamp(pos.x + dx, -MITAD_MAPA + 5, MITAD_MAPA - 5);
  const nz = THREE.MathUtils.clamp(pos.z + dz, -MITAD_MAPA + 5, MITAD_MAPA - 5);

  if (esAgua(nx, nz)) {
    vehiculo.vel *= 0.92;
  }

  if (!chocaCaja(nx, nz, mundo.cajas)) {
    pos.x = nx;
    pos.z = nz;
  } else {
    vehiculo.vel *= 0.3;
  }

  pos.y = Math.max(alturaEn(pos.x, pos.z), AGUA_Y);
  vehiculo.mesh.rotation.y = vehiculo.yaw;
  vehiculo.mesh.rotation.z = THREE.MathUtils.clamp((izq ? 0.12 : 0) - (der ? 0.12 : 0), -0.18, 0.18);
}
