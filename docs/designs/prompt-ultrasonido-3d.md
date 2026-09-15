# Prompt para Claude Diseño — escena 3D de ultrasonido

Va en la página de Análisis de Ultrasonido, en el apartado "Dónde se aplica", en
el mismo hueco donde hoy hay una fotografía. Sigue el patrón de
`Animación 3D sensor vibraciones.html`: Claude Diseño entrega un HTML suelto y
aquí se porta a un componente de React.

Copia de aquí para abajo.

---

Necesito una escena 3D animada, en un solo archivo HTML autocontenido, para la
página de Análisis de Ultrasonido de Grupo DIAPSA, una empresa mexicana de
mantenimiento predictivo industrial. La escena va dentro de un marco de
proporción 4:3 sobre fondo blanco, junto a una lista de aplicaciones.

## La idea: el oído que ve

El argumento de la página es que el ultrasonido no sirve solo para rodamientos:
también encuentra fugas de aire comprimido y descargas eléctricas en tableros.
Cada una de esas tres fallas suena distinto, y una cámara acústica las pinta
como un mapa de color sobre el equipo. Eso es lo que quiero que se vea: tres
equipos industriales apagados en gris y, uno por uno, la mancha de sonido
apareciendo sobre el punto exacto que está fallando.

## La escena

Una plataforma industrial en vista de tres cuartos, ligeramente elevada, con
tres elementos separados y bien espaciados:

1. **Izquierda**: un motor eléctrico acoplado a una bomba, sobre su base.
2. **Centro, un poco al fondo**: un tramo de tubería de aire comprimido que
   corre horizontal, con un acople o brida a la mitad.
3. **Derecha**: un gabinete eléctrico cerrado, alto y angosto, de media tensión.

Todo construido solo con geometría primitiva: cilindros, cajas, toros y conos.
Nada de detalle decorativo ni de accesorios. Los tres equipos son el escenario,
no el protagonista; el protagonista es el sonido.

## La animación, en bucle de doce segundos

- **0 a 1.5 s** — La cámara entra con un movimiento corto y suave. Los tres
  equipos están en gris, quietos, sin ninguna marca.
- **1.5 a 4.5 s** — Un cono de escucha muy tenue barre de izquierda a derecha
  desde el frente de la escena. Al llegar al motor, sobre su rodamiento florece
  una mancha ámbar que **pulsa con impactos discretos**, y de ella salen anillos
  concéntricos que se expanden y se desvanecen. Rótulo pequeño: `Rodamiento`.
- **4.5 a 7.5 s** — El cono llega al acople de la tubería. Ahí aparece una
  mancha roja alargada que **no pulsa: es continua**, con un chorro fino de
  partículas que se escapa del acople en diagonal. Rótulo: `Fuga de aire`.
- **7.5 a 10.5 s** — El cono llega al gabinete. Dentro, a través de una rejilla,
  se ve una mancha roja que **estalla a intervalo perfectamente regular**, dos
  veces por ciclo, como enganchada a la onda eléctrica. El ritmo tiene que
  leerse como ritmo, no como parpadeo al azar. Rótulo: `Descarga eléctrica`.
- **10.5 a 12 s** — Los tres mapas quedan encendidos a la vez, atenuados, y
  aparece un rótulo central: `Todo esto suena`. Fundido corto y vuelve a
  empezar.

Esa diferencia entre las tres firmas es lo más importante de la pieza: pulsos
discretos, chorro continuo y estallidos rítmicos. Si las tres se ven igual, la
animación no sirve.

## Paleta

- Fondo **transparente**, no blanco.
- Estructura y equipos: `#d9e2e8`, `#b7c6d0`, `#8fa4b2`, con las partes oscuras
  en `#002e46`.
- Mapas acústicos: ámbar `#fbbf24` para el rodamiento, rojo `#f87171` para la
  fuga y la descarga. Verde `#34d399` solo si decides mostrar algún punto sano.
- El naranja de marca `#fc9f01` únicamente para el rótulo activo.
- Luz suave y pareja, ambiente claro. Nada de escena nocturna ni de neón.

## Reglas técnicas

- Un solo archivo HTML autocontenido.
- Three.js **r128** exactamente, desde cdnjs. Ninguna otra dependencia.
- Toda la geometría creada por código. Sin modelos `.glb` ni `.obj`, sin
  texturas, sin imágenes externas, sin fuentes externas.
- `renderer.setClearColor(0x000000, 0)` para que el fondo sea transparente.
- El lienzo se adapta al ancho de su contenedor y **la altura se deriva del
  ancho** en proporción 4:3. Nunca calcular la altura a partir del contenido, y
  nunca dejar que el lienzo entre en el flujo normal: posicionarlo absoluto
  dentro de un contenedor relativo.
- `setPixelRatio` limitado a 2 como máximo.
- Sin post-procesado y sin sombras costosas: tiene que ir a 60 cuadros en una
  laptop de oficina.
- Con `prefers-reduced-motion` activo, pintar **un solo cuadro** con los tres
  mapas ya encendidos y los rótulos puestos, sin movimiento.
- El puntero solo inclina la escena un poco. Toda la historia tiene que
  entenderse sin cursor, porque en teléfono no hay.
- Que todo lo que se crea se pueda liberar al desmontar: geometrías,
  materiales, renderer y el bucle de animación.

## Lo que no quiero

- Aspecto de render de banco de imágenes o de portada de producto.
- Intentos de fotorrealismo: materiales mate y planos funcionan mejor.
- Partículas por toda la escena. Solo el chorro de la fuga las lleva.
- Texto largo encima de la escena. Los rótulos son de tres palabras como máximo
  y tienen que leerse a 400 píxeles de ancho.
- Interfaz falsa: nada de botones, pestañas ni ventanas dibujadas encima.
