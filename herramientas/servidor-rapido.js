/*
  Cocina de respaldo (Node).

  Maxi: si Python todavía no está listo, este archivo
  manda el juego al navegador y guarda el cuaderno.
*/
const http = require("http");
const fs = require("fs");
const path = require("path");

const CARPETA = path.join(__dirname, "..");
const FRONTEND = path.join(CARPETA, "frontend");
const ARCHIVO_CUADERNO = path.join(CARPETA, "data", "cuaderno.json");
const PUERTO = 5005;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

function leerCuaderno() {
  try {
    const datos = JSON.parse(fs.readFileSync(ARCHIVO_CUADERNO, "utf8"));
    return datos && typeof datos === "object" ? datos : {};
  } catch (error) {
    return {};
  }
}

function guardarCuaderno(datos) {
  fs.mkdirSync(path.dirname(ARCHIVO_CUADERNO), { recursive: true });
  fs.writeFileSync(ARCHIVO_CUADERNO, JSON.stringify(datos, null, 2));
}

function enviarJson(res, codigo, datos) {
  const cuerpo = JSON.stringify(datos);
  res.writeHead(codigo, { "Content-Type": "application/json; charset=utf-8" });
  res.end(cuerpo);
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let texto = "";
    req.on("data", (pedazo) => {
      texto += pedazo;
    });
    req.on("end", () => resolve(texto));
    req.on("error", reject);
  });
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  if (url.pathname === "/api/cuaderno" && req.method === "GET") {
    enviarJson(res, 200, leerCuaderno());
    return;
  }

  if (url.pathname === "/api/cuaderno" && req.method === "POST") {
    let datos = {};
    try {
      datos = JSON.parse((await leerCuerpo(req)) || "{}");
    } catch (error) {
      enviarJson(res, 400, { ok: false });
      return;
    }
    if (!datos || typeof datos !== "object") {
      enviarJson(res, 400, { ok: false });
      return;
    }
    guardarCuaderno(datos);
    enviarJson(res, 200, { ok: true });
    return;
  }

  const pedido = url.pathname === "/" ? "/index.html" : url.pathname;
  const archivo = path.resolve(FRONTEND, `.${pedido}`);
  if (!archivo.startsWith(path.resolve(FRONTEND) + path.sep) && archivo !== path.resolve(FRONTEND)) {
    res.writeHead(403);
    res.end("No permitido");
    return;
  }

  fs.readFile(archivo, (error, datos) => {
    if (error) {
      res.writeHead(404);
      res.end("No encontré ese archivo");
      return;
    }
    res.writeHead(200, {
      "Content-Type": TIPOS[path.extname(archivo)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(datos);
  });
});

servidor.listen(PUERTO, "127.0.0.1", () => {
  console.log("isla.1 lista. Abre: http://127.0.0.1:5005");
  console.log("Para apagarlo: presiona Control + C en esta ventana.");
});
