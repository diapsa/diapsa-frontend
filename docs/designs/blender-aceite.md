# Animación 3D de Análisis de Aceite, en Blender

Primer proyecto de la serie. La idea es que cada disciplina termine teniendo una
animación propia, y que todas se entreguen igual para que integrarlas sea
mecánico.

## Qué se entrega

Un video, no un modelo. Tú animas en Blender sin límite y el sitio recibe un
archivo que pesa poco y no necesita librerías. Se reproduce solo al entrar en
pantalla, sin sonido, una sola vez, y se queda quieto en el último cuadro. No
es un bucle: así no tienes que lograr que el cuadro final empate con el
primero, que es donde se atora todo primer proyecto.

Al final me pasas tres archivos con estos nombres exactos:

1. `aceite.webm` — el video, VP9.
2. `aceite.mp4` — el mismo video en H.264, para Safari viejo.
3. `aceite.jpg` — el último cuadro, que es lo que se ve antes de reproducir y lo
   único que se ve si el visitante tiene las animaciones desactivadas.

## El concepto: el aceite es la muestra de sangre del equipo

Diez segundos, tres actos.

**Acto 1, de 0 a 3 segundos.** Una chumacera en corte, vista de tres cuartos.
Se ve el eje girando dentro y, abajo, el baño de aceite en ámbar translúcido.
Cámara quieta o con un acercamiento muy leve.

**Acto 2, de 3 a 6 segundos.** De la zona donde el eje roza empiezan a
desprenderse partículas que quedan flotando en el aceite. Tres tipos, y que se
distingan: virutas metálicas planas y brillantes, motas de polvo mate e
irregulares, y gotas de agua esféricas y transparentes. Pocas, quince o veinte
en total, no una nube. Se desprenden de una en una y derivan despacio.

**Acto 3, de 6 a 10 segundos.** Una válvula en la parte baja se abre y el aceite
sube por un tubo hacia un frasco de muestra que está a la derecha. El frasco se
llena hasta la mitad y dentro se alcanzan a ver las mismas partículas. Cuadro
final: el frasco lleno, la chumacera al fondo desenfocada.

Ese es el argumento de la página entero, sin una palabra: lo que pasa adentro
termina en un frasco, y el frasco se puede leer.

## Estilo, para que no choque con el sitio

Mate y plano, sin reflejos de estudio, sin fondo negro con luz dramática. La
escena de vibraciones que ya está en el sitio es la referencia: gris azulado,
luz suave y pareja, y el color solo donde importa.

Colores exactos, cópialos tal cual en los materiales:

| Para qué | Hex |
|---|---|
| Fondo de la escena | `#ffffff` |
| Metal claro de la carcasa | `#d9e2e8` |
| Metal medio | `#b7c6d0` |
| Metal oscuro y sombras | `#8fa4b2` |
| Azul de la marca, para piezas de acento | `#002e46` |
| Naranja de la marca, solo para un detalle | `#fc9f01` |
| Aceite limpio | `#c8912f` |
| Viruta metálica | `#e8eef2` |
| Polvo | `#6b5b4a` |

El fondo va blanco y opaco, no transparente. El bloque donde entra tiene fondo
blanco, así que no hace falta canal alfa y te ahorras el problema que da la
transparencia en video.

## Configuración del proyecto

1. Motor de render: **EEVEE**, no Cycles. Es suficiente para materiales mate y
   rinde en minutos en lugar de horas.
2. Resolución: **1200 × 900** al 100 %. Es proporción 4 a 3, que es el marco
   donde va, y a ese tamaño se ve nítido en pantallas de retina sin pesar.
3. Cuadros por segundo: **30**. Duración 10 segundos, o sea del cuadro 1 al 300.
4. Cámara: lente de 50 mm, a la altura del eje de la chumacera, girada unos 30
   grados. Nada de gran angular, deforma y se ve a juguete.
5. Luz: una luz de área grande arriba y al frente, y otra más débil del lado
   opuesto para que las sombras no queden negras. Sin luz de contorno.
6. Salida: **secuencia PNG** a una carpeta, no video directo. Así si se corta el
   render lo retomas, y la compresión la controlamos después.

## Modelado, con primitivas

No necesitas modelar bien, necesitas que se lea.

1. Carcasa de la chumacera: un cilindro, modificador Solidify para darle pared,
   y le quitas la mitad delantera para que se vea el corte.
2. Eje: un cilindro delgado que la atraviesa.
3. Rodamiento: un toro, y sobre él ocho o diez esferas pequeñas repartidas con
   un Array circular.
4. Baño de aceite: un cubo escalado que ocupe el fondo de la carcasa, con el
   material de aceite.
5. Partículas: tres objetos pequeños, un plano irregular para la viruta, un
   icosferoide deformado para el polvo y una esfera para el agua. Se instancian
   con un sistema de partículas o a mano, que para veinte da igual.
6. Frasco: un cilindro con Solidify y material de vidrio sencillo.

Si algo te sale mal, que sea la geometría. Lo que no puede salir mal es que se
distingan las tres clases de partícula, porque eso es lo que la animación
enseña.

## Animación

1. El eje: rotación constante en su eje, del cuadro 1 al 300, con
   interpolación lineal para que no acelere ni frene.
2. Las partículas: cada una aparece con su escala en cero y crece a su tamaño en
   unos diez cuadros, empezando escalonadas entre los cuadros 90 y 180. Después
   derivan con un movimiento lento y aleatorio.
3. La válvula: se abre entre los cuadros 180 y 200.
4. El aceite del frasco: una llave de forma en el nivel del líquido, o el cubo
   del aceite escalando en Z, del cuadro 200 al 280.
5. Cámara: del cuadro 1 al 300 un desplazamiento lateral muy corto, dos o tres
   unidades, con Bezier suave. Poco movimiento se ve caro; mucho movimiento
   marea.
6. Cuadro 300: todo quieto. Ese cuadro es el que queda en pantalla, así que
   compónlo pensando que es una fotografía.

## Comprimir y entregar

Con la secuencia PNG en una carpeta, desde esa carpeta:

```bash
ffmpeg -framerate 30 -i %04d.png -c:v libvpx-vp9 -crf 34 -b:v 0 -an -pix_fmt yuv420p aceite.webm
```

```bash
ffmpeg -framerate 30 -i %04d.png -c:v libx264 -crf 26 -preset slow -an -pix_fmt yuv420p -movflags +faststart aceite.mp4
```

```bash
ffmpeg -i %04d.png -vf "select=eq(n\,299)" -frames:v 1 -q:v 3 aceite.jpg
```

Objetivo de peso: el `webm` por debajo de **1.5 MB** y el `mp4` por debajo de
**2.5 MB**. Si se pasan, sube el `crf` de tres en tres y vuelve a comprimir; a
34 o 37 en VP9 no se nota la diferencia en una animación mate como esta.

## Cómo me lo pasas

Los tres archivos a `public/videos/servicios/`. Yo hago el componente que los
reproduce al entrar en pantalla, con el cuadro final como imagen de espera y
respetando a quien tenga las animaciones desactivadas. La ruta se conecta desde
el JSON del servicio, así que cambiar el video después no toca código.

## Si quieres empezar más fácil

El acto 3, el del frasco, es el que más trabajo da por el vidrio y el líquido.
Puedes entregar primero una versión de seis segundos con los actos 1 y 2, que ya
cuenta lo esencial, y agregar el frasco cuando lo domines. Se integra igual y se
sustituye sin tocar nada.
