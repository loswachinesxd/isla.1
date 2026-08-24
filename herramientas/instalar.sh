#!/bin/zsh
# Una sola vez, CON EL ADULTO. Pide la contraseña de la Mac.
# Instala: herramientas de Apple, Homebrew, Git y Python.
set -euo pipefail

echo "========================================"
echo "  Laboratorio de Maxi: instalar herramientas"
echo "========================================"
echo

if ! xcode-select -p >/dev/null 2>&1; then
  echo "1) Apple va a abrir una ventana: Command Line Tools."
  echo "   Dale a Instalar y espera. Puede tardar varios minutos."
  xcode-select --install 2>/dev/null || true
  echo "   Esperando a que termine..."
  until xcode-select -p >/dev/null 2>&1; do
    sleep 8
  done
  echo "   Listo: herramientas de Apple."
else
  echo "1) Herramientas de Apple: ya estaban."
fi

if ! command -v brew >/dev/null 2>&1; then
  echo
  echo "2) Instalando Homebrew (el supermercado de programas)."
  echo "   Te va a pedir la contraseña de la Mac."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "2) Homebrew: ya estaba."
fi

if [[ -x /usr/local/bin/brew ]]; then
  BREW=/usr/local/bin/brew
elif [[ -x /opt/homebrew/bin/brew ]]; then
  BREW=/opt/homebrew/bin/brew
else
  echo "No encontré brew después de instalarlo."
  exit 1
fi

eval "$("$BREW" shellenv)"

ZPROFILE="$HOME/.zprofile"
LINE='eval "$('"$BREW"' shellenv)"'
if [[ ! -f "$ZPROFILE" ]] || ! grep -Fq "brew shellenv" "$ZPROFILE"; then
  echo "$LINE" >> "$ZPROFILE"
  echo "   Guardé brew en ~/.zprofile para las próximas terminales."
fi

echo
echo "3) Instalando Git y Python con brew..."
"$BREW" bundle --file="$(cd "$(dirname "$0")" && pwd)/Brewfile"

echo
echo "4) Comprobando..."
echo "   brew    -> $("$BREW" --version | head -1)"
echo "   git     -> $(git --version)"
echo "   python3 -> $(python3 --version)"

echo
echo "========================================"
echo "  ¡Listo! Cierra esta Terminal y abre otra."
echo "  Después, Maxi solo corre:  ./jugar.sh"
echo "========================================"
