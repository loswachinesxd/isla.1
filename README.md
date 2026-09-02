# isla.1

Un mapa grande con **ciudad**, **bosque**, **montañas** y **playa**.
Caminás en tercera persona: la cámara va detrás de vos, como si
alguien filmara tu espalda.

Esto **no es Unreal Engine 5**. Unreal es un programa enorme
(como un estudio de cine). En esta Mac no está instalado, y un
juego así lo arma un equipo durante años.

Este juego es el **primo** hecho con las mismas ideas, en el
navegador, para que lo puedas jugar hoy. Igual que Aviones.

## Cómo jugar

1. En la Terminal, dentro de esta carpeta, escribí:

```bash
./jugar.sh
```

2. Abre [http://127.0.0.1:5005](http://127.0.0.1:5005)
3. Tocá **ENTRAR A LA ISLA**.
4. Para apagar: **Control + C** en la Terminal.

## Publicar en Railway (para que jueguen otros)

1. El código está en GitHub: https://github.com/loswachinesxd/isla.1
2. El adulto entra a https://railway.app con GitHub.
3. New Project → Deploy from GitHub repo → **isla.1**.
4. Generate Domain. Sale un link tipo `isla-1.up.railway.app`.
5. **Republicar:** cada `git push` a `main` vuelve a subir el juego solo.

Cada jugador guarda su progreso en su navegador, no en un cuaderno compartido.

## Controles

| Tecla | Qué hace |
| --- | --- |
| W A S D o flechas | Caminar y girar |
| Shift | Correr |
| Espacio | Saltar (en el mar, nadás) |
| E | Hablar, subir al auto/moto, comprar |

## Qué hay en la isla

- **Ciudad**: edificios, gente caminando, auto rojo, moto y tienda amarilla.
- **Bosque**: árboles. Ahí se escondió Luna, el perro de Ana.
- **Montañas**: rocas altas y una cabaña.
- **Playa**: arena, mar para nadar y conchas.

El cielo cambia solo: de día a noche, y a veces llueve o hay tormenta.

## Misiones

1. **Principal:** hablá con Ana, buscá a Luna en el bosque y devolvela.
2. **Secundaria:** juntá 5 conchas y hablá con Nico en la playa.
3. **Secundaria:** hablá con Luis y llevá el paquete a la cabaña.

El dinero sirve en la **tienda** (edificio amarillo).

## Carpetas (como cajones)

| Carpeta o archivo | Qué es |
| --- | --- |
| `jugar.sh` | El botón de encender |
| `backend/servidor.py` | La cocina: sirve el juego y guarda el cuaderno |
| `frontend/` | Lo que se ve |
| `frontend/mundo.js` | El mapa de 4 zonas |
| `frontend/jugador.js` | Correr, saltar y nadar |
| `frontend/vehiculos.js` | Auto y moto |
| `frontend/npcs.js` | Vecinos que caminan |
| `frontend/misiones.js` | Encargos |
| `frontend/clima.js` | Sol, lluvia, día y noche |
| `frontend/minimapa.js` | El GPS chiquito |
| `frontend/tienda.js` | Compras |
| `frontend/juego.js` | El director: junta todo |
| `.venv` | La caja de útiles de Python (se crea sola) |

## Sobre Lumen y Nanite

En Unreal, **Lumen** hace que la luz rebote (un cuarto se ilumina
con el sol de la ventana). **Nanite** pone millones de detalles
sin frenar la computadora.

Acá imitamos eso con un sol que se mueve, sombras suaves y
bloques simples. Así la Mac no se cansa.

## Nota para el adulto

Unreal Engine 5 no está instalado. Pesá decenas de gigas, pide
cuenta de Epic y no es el siguiente paso después de Snake.
Si más adelante quieren Unreal de verdad, se baja Epic Games
Launcher y el template Third Person. Este proyecto es el
entrenamiento: mismas ideas, tamaño de juguete.
