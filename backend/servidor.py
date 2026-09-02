"""
El BACKEND (la cocina).

Maxi: este archivo no se ve. Sirve el juego al navegador
y guarda el CUADERNO (dinero, misiones, compras).
"""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote
import json
import os

CARPETA_BACKEND = Path(__file__).resolve().parent
CARPETA_PROYECTO = CARPETA_BACKEND.parent
CARPETA_FRONTEND = CARPETA_PROYECTO / "frontend"
CARPETA_DATOS = CARPETA_PROYECTO / "data"
ARCHIVO_CUADERNO = CARPETA_DATOS / "cuaderno.json"

# En la Mac: 5005. En Railway: el puerto que te dan.
PUERTO = int(os.environ.get("PORT", "5005"))
HOST = "0.0.0.0" if os.environ.get("PORT") else "127.0.0.1"

TIPOS = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".json": "application/json; charset=utf-8",
    ".woff2": "font/woff2",
}


def leer_cuaderno():
    if not ARCHIVO_CUADERNO.exists():
        return {}
    try:
        datos = json.loads(ARCHIVO_CUADERNO.read_text(encoding="utf-8"))
        if isinstance(datos, dict):
            return datos
    except (OSError, json.JSONDecodeError):
        return {}
    return {}


def guardar_cuaderno(datos):
    CARPETA_DATOS.mkdir(parents=True, exist_ok=True)
    ARCHIVO_CUADERNO.write_text(
        json.dumps(datos, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


class Cocina(BaseHTTPRequestHandler):
    """Atiende el mapa, las misiones y el cuaderno."""

    def log_message(self, formato, *args):
        print("Pedido:", args[0] if args else formato)

    def _enviar(self, codigo, cuerpo, tipo="text/plain; charset=utf-8"):
        if isinstance(cuerpo, str):
            cuerpo = cuerpo.encode("utf-8")
        self.send_response(codigo)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(cuerpo)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(cuerpo)

    def _enviar_json(self, codigo, datos):
        self._enviar(
            codigo,
            json.dumps(datos, ensure_ascii=False),
            "application/json; charset=utf-8",
        )

    def do_GET(self):
        camino = unquote(self.path.split("?", 1)[0])
        if camino == "/api/cuaderno":
            self._enviar_json(200, leer_cuaderno())
            return

        if camino == "/":
            camino = "/index.html"

        archivo = (CARPETA_FRONTEND / camino.lstrip("/")).resolve()
        if not str(archivo).startswith(str(CARPETA_FRONTEND.resolve())):
            self._enviar(403, "No permitido")
            return

        if not archivo.is_file():
            self._enviar(404, "No encontré ese archivo")
            return

        tipo = TIPOS.get(archivo.suffix, "application/octet-stream")
        self._enviar(200, archivo.read_bytes(), tipo)

    def do_POST(self):
        camino = self.path.split("?", 1)[0]
        if camino != "/api/cuaderno":
            self._enviar(404, "No encontré ese lugar")
            return

        largo = int(self.headers.get("Content-Length", "0") or 0)
        crudo = self.rfile.read(largo)
        try:
            datos = json.loads(crudo.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self._enviar_json(400, {"ok": False})
            return

        if not isinstance(datos, dict):
            self._enviar_json(400, {"ok": False})
            return

        guardar_cuaderno(datos)
        self._enviar_json(200, {"ok": True})


if __name__ == "__main__":
    servidor = ThreadingHTTPServer((HOST, PUERTO), Cocina)
    print("isla.1 lista. Abre: http://" + HOST + ":" + str(PUERTO))
    print("Para apagarlo: presiona Control + C en esta ventana.")
    servidor.serve_forever()
