# Prompt para Claude Diseño — escena 3D de análisis de aceite

Va en la página de Análisis de Aceite, en el punto "Cómo lo hacemos", en el
mismo hueco donde hoy hay una fotografía. Sigue el patrón de
`Animación 3D sensor vibraciones.html` y de `prompt-ultrasonido-3d.md`: Claude
Diseño entrega un HTML suelto y aquí se porta a un componente de React, junto a
`EscenaVibracion.tsx`, y se engancha con una clave nueva en el campo `escena`
del punto en `data/servicios/analisis-de-aceite.json`.

Copia de aquí para abajo.

---

Necesito una escena 3D animada, en un solo archivo HTML autocontenido, para la
página de Análisis de Aceite de Grupo DIAPSA, una empresa mexicana de
mantenimiento predictivo industrial. La escena va dentro de un marco de
proporción 4:3 sobre fondo blanco, junto a una lista de puntos del servicio.

## La idea: el aceite es el mensajero

Las otras técnicas necesitan que la falla se asome. La vibración la detecta
cuando ya mueve la máquina; la termografía, cuando ya calienta. El aceite no
espera a eso: circula por donde ningún sensor llega, recoge las partículas que
se están desprendiendo adentro y las saca por la válvula de muestreo. No se
abre el equipo, se interroga al mensajero.

Eso es lo que quiero que se vea, en este orden: por fuera no pasa nada, adentro
sí está pasando, la gota se lleva la evidencia, y la evidencia tiene nombre y
apellido.

La pieza tiene que dejar claras dos cosas. La primera, que el exterior de la
máquina permanece quieto y gris de principio a fin: nunca vibra, nunca se
calienta, nunca cambia de color. Ahí está el argumento. La segunda, que las
partículas no son polvo genérico: se separan por tipo y cada tipo apunta a un
componente distinto.

## La escena

Un reductor industrial en vista de tres cuartos, ligeramente elevado, apoyado
sobre su base. Construido solo con geometría primitiva:

- **Carcasa**: una caja con las esquinas suavizadas, cerrada.
- **Adentro** (visible solo cuando la carcasa se abre en corte): dos engranes
  acoplados, cada uno un cilindro con dientes hechos de cajas pequeñas
  repartidas alrededor; los ejes, cilindros; los rodamientos y los bujes,
  toros.
- **Abajo, al frente**: una válvula de muestreo pequeña, un cilindro corto con
  una llave de cuarto de vuelta.
- **El aceite**: un volumen traslúcido ámbar que llena la mitad inferior de la
  carcasa y sube por los dientes de los engranes al girar.

Sin detalle decorativo, sin tornillería, sin accesorios. El reductor es el
escenario; los protagonistas son el aceite y lo que lleva dentro.

## La animación, en bucle de doce segundos

- **0 a 2 s** — El reductor cerrado, en gris, completamente quieto. Nada se
  mueve salvo un giro lentísimo de cámara. Rótulo: `Por fuera, nada`.
- **2 a 5.5 s** — La mitad frontal de la carcasa se desvanece y deja ver el
  interior. Los engranes giran y el aceite circula, arrastrado por los dientes.
  De los flancos de los dientes y del buje se desprenden **partículas contadas,
  entre ocho y doce, no una nube**, que se incorporan al flujo y dan la vuelta
  con él. El exterior de la carcasa sigue gris y quieto. Rótulo:
  `Adentro, sí`.
- **5.5 a 8 s** — La llave de la válvula gira un cuarto de vuelta y se forma
  una gota en la boquilla. La gota crece, se desprende y cae. La cámara la
  sigue hacia abajo mientras el reductor sale de cuadro por arriba. Rótulo:
  `Con el equipo operando`.
- **8 a 11 s** — La gota llena el cuadro y se vuelve traslúcida. Las partículas
  que traía adentro se separan y se ordenan en tres grupos, cada uno con su
  color y su rótulo pequeño: `Fierro · engranes` en acero oscuro,
  `Cobre · bujes` en cobrizo, `Agua` en azul. Cada grupo se acomoda con calma,
  no de golpe.
- **11 a 12 s** — Los tres grupos se colapsan en una sola lámpara que enciende
  en ámbar, con el rótulo `Precaución · Filtrar`. Fundido corto y vuelve a
  empezar.

Lo más importante de la pieza es el contraste entre los dos primeros tramos: la
carcasa gris e inmóvil contra el interior lleno de actividad. Si el exterior se
mueve, tiembla o cambia de color en algún momento, la animación pierde el
argumento y no sirve.

Lo segundo más importante es que las partículas se puedan contar. Si se ven
como humo o como polvo, se pierde la idea de que cada una viene de una pieza
identificable.

## Paleta

- Fondo **transparente**, no blanco.
- Carcasa, base y estructura: `#d9e2e8`, `#b7c6d0`, `#8fa4b2`, con las partes
  oscuras en `#002e46`.
- Aceite: ámbar traslúcido, alrededor de `#d99a3a`, con poca opacidad para que
  se vean los engranes a través.
- Partículas de fierro: `#4b5563`. De cobre: `#b45309`. Agua: `#38bdf8`.
- Lámpara final en ámbar `#fbbf24`. Verde `#34d399` y rojo `#f87171` solo si
  decides insinuar la escala completa; no hace falta.
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
- La transparencia del aceite y de la gota, con `material.transparent` y
  `opacity`, no con refracción ni con materiales físicos caros.
- Con `prefers-reduced-motion` activo, pintar **un solo cuadro**: el reductor ya
  en corte, las partículas ya separadas en sus tres grupos con sus rótulos y la
  lámpara encendida. Sin movimiento.
- El puntero solo inclina la escena un poco. Toda la historia tiene que
  entenderse sin cursor, porque en teléfono no hay.
- Que todo lo que se crea se pueda liberar al desmontar: geometrías,
  materiales, renderer y el bucle de animación.

## Lo que no quiero

- Aspecto de render de banco de imágenes o de portada de producto.
- Intentos de fotorrealismo: materiales mate y planos funcionan mejor. El
  aceite traslúcido es la única excepción y aun así va plano.
- Nubes de partículas. Se cuentan con los dedos y cada una se sigue con la
  vista.
- Que la máquina vibre, humee, chispee o se ponga roja. Ese es justo el punto
  contrario al que hace esta técnica.
- Gotas cayendo por toda la escena ni salpicaduras. Una sola gota, la del
  muestreo.
- Instrumental de laboratorio: ni matraces, ni microscopios, ni probetas. La
  evidencia se lee dentro de la gota.
- Texto largo encima de la escena. Los rótulos son de tres palabras como máximo
  y tienen que leerse a 400 píxeles de ancho.
- Interfaz falsa: nada de botones, pestañas ni ventanas dibujadas encima.
