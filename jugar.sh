#!/bin/zsh
# Maxi: corre esto cada vez que quieras jugar.
# Usa Python si está listo. Si no, usa el Node que trae Cursor.
set -euo pipefail
cd "$(dirname "$0")"

verde() { printf "\n\033[32m%s\033[0m\n" "$1"; }
rojo() { printf "\n\033[31m%s\033[0m\n" "$1"; }

NODE_CURSOR="/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node"

python_sirve() {
  local bin="$1"
  [[ -x "$bin" ]] || return 1
  "$bin" -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)" 2>/dev/null
}

buscar_python() {
  local candidato
  if command -v brew >/dev/null 2>&1; then
    for candidato in "$(brew --prefix python@3 2>/dev/null)/bin/python3" "$(brew --prefix)/bin/python3"; do
      if python_sirve "$candidato"; then
        echo "$candidato"
        return 0
      fi
    done
  fi
  for candidato in "$HOME/.local/bin/python3.12" /usr/local/bin/python3 /opt/homebrew/bin/python3; do
    if python_sirve "$candidato"; then
      echo "$candidato"
      return 0
    fi
  done
  return 1
}

encender_python() {
  local PYTHON="$1"
  if [[ ! -d .venv ]]; then
    verde "Creando la caja de útiles de este juego (.venv)..."
    "$PYTHON" -m venv .venv
  fi
  # shellcheck disable=SC1091
  source .venv/bin/activate
  if [[ -f requirements.txt ]]; then
    pip install -q -r requirements.txt
  fi
  verde "isla.1 lista (Python). Abre:  http://127.0.0.1:5005"
  echo "Para apagar: Control + C"
  echo
  exec python backend/servidor.py
}

encender_node() {
  local NODE="$1"
  verde "Python todavía no está. Encendiendo isla.1 con el motor de Cursor..."
  echo "Abre:  http://127.0.0.1:5005"
  echo "Para apagar: Control + C"
  echo
  exec "$NODE" herramientas/servidor-rapido.js
}

if PYTHON="$(buscar_python)"; then
  encender_python "$PYTHON"
elif [[ -x "$NODE_CURSOR" ]]; then
  encender_node "$NODE_CURSOR"
elif command -v node >/dev/null 2>&1; then
  encender_node "$(command -v node)"
else
  rojo "Todavía no puedo encender el juego."
  echo "Pídele al adulto que corra:  zsh herramientas/instalar.sh"
  exit 1
fi
