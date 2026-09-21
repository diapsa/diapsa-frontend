# -*- coding: utf-8 -*-
#
# Escena de Analisis de Aceite para Grupo DIAPSA, construida por codigo.
#
# COMO SE USA
# En la consola de Python de Blender (pestana Scripts, abajo a la izquierda),
# pega esta linea y pulsa Enter:
#
#   exec(open(r"C:/laragon/www/diapsa-frontend/docs/designs/blender-aceite.py", encoding="utf-8").read())
#
# Renderizar: menu Procesar y luego Procesar imagen para un cuadro, o
# Procesar animacion para los 240. En esta laptop F12 la tiene tomada el modo
# avion, asi que mejor por menu.
#
# QUE CAMBIO EN ESTA VERSION, y por que
# 1. Transformacion de color a Standard. Blender 4 y 5 traen AgX por defecto,
#    hecha para fotorrealismo, y lava los colores planos: el blanco salia gris
#    y el azul marino del rodamiento salia cafe.
# 2. La carcasa era mas ancha que larga y se veia como un rollo de papel.
#    Ahora es mas larga y delgada, con proporcion de maquina.
# 3. El aceite llenaba todo el interior y tenia de ambar hasta el rodamiento.
#    Ahora es un bano en el fondo, recortado con un booleano.
# 4. Las luces estaban a 900 vatios sobre materiales casi blancos: quemaban.
#    Bajaron, y los materiales son de tono medio para que haya contraste.
# 5. Las particulas eran diminutas y quedaban escondidas. Son mas grandes y
#    viven dentro del bano, que es donde se depositan de verdad.

import bpy
import os
import math
import random
from mathutils import Vector

# ---------------------------------------------------------------- ajustes ---

SALIDA = "C:/Users/emili/OneDrive/Desktop/render-aceite/"
DURACION = 240          # cuadros; a 30 por segundo son 8 segundos
ANCHO, ALTO = 1200, 900
PARTICULAS = 15

random.seed(7)

# Medidas de la escena, juntas para poder ajustarlas de un tiron.
CARCASA_RADIO = 1.15
CARCASA_LARGO = 4.00
PARED = 0.08
EJE_RADIO = 0.30
EJE_LARGO = 4.80
RODAMIENTO_X = 1.00
RODA_MAYOR = 0.62
ACEITE_RADIO = 1.02
ACEITE_TAPA = -0.12     # altura a la que se corta el bano

# ---------------------------------------------------------------- colores ---

def hex_a_rgba(h, alfa=1.0):
    # Blender trabaja en lineal, asi que hay que convertir el sRGB del sitio.
    h = h.lstrip("#")
    def canal(v):
        v = v / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (canal(int(h[0:2], 16)), canal(int(h[2:4], 16)), canal(int(h[4:6], 16)), alfa)

BLANCO      = hex_a_rgba("ffffff")
METAL_CLARO = hex_a_rgba("d9e2e8")
METAL_MEDIO = hex_a_rgba("b7c6d0")
METAL_OSC   = hex_a_rgba("8fa4b2")
AZUL        = hex_a_rgba("002e46")
NARANJA     = hex_a_rgba("fc9f01")
ACEITE      = hex_a_rgba("c8912f", 0.55)
VIRUTA      = hex_a_rgba("eef3f6")
POLVO       = hex_a_rgba("4a3f33")
AGUA        = hex_a_rgba("dff0f5", 0.40)

# ------------------------------------------------------------- utilidades ---

def limpiar():
    # Borra todo para poder ejecutar el script las veces que haga falta.
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for coleccion in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for item in list(coleccion):
            coleccion.remove(item)

def bsdf_de(mat):
    # Busca el nodo Principled POR TIPO. Por nombre falla, porque con Blender
    # en espanol y la traduccion de nombres nuevos activada no se llama igual.
    arbol = mat.node_tree
    for n in arbol.nodes:
        if n.type == "BSDF_PRINCIPLED":
            return n
    nodo = arbol.nodes.new("ShaderNodeBsdfPrincipled")
    salida = None
    for n in arbol.nodes:
        if n.type == "OUTPUT_MATERIAL":
            salida = n
            break
    if salida is None:
        salida = arbol.nodes.new("ShaderNodeOutputMaterial")
    arbol.links.new(nodo.outputs[0], salida.inputs[0])
    return nodo

def poner(nodo, nombres, valor):
    # Asigna una entrada probando contra el nombre visible y contra el
    # identificador interno. Blender 4 renombro casi todas las del Principled.
    for n in nombres:
        objetivo = n.lower()
        for entrada in nodo.inputs:
            if entrada.name.lower() == objetivo or entrada.identifier.lower() == objetivo:
                try:
                    entrada.default_value = valor
                    return True
                except Exception:
                    pass
    return False

def material(nombre, color, rugosidad=0.6, metalico=0.0, translucido=False):
    mat = bpy.data.materials.new(nombre)
    mat.use_nodes = True
    bsdf = bsdf_de(mat)
    poner(bsdf, ["Base Color"], color)
    poner(bsdf, ["Roughness"], rugosidad)
    poner(bsdf, ["Metallic"], metalico)
    if translucido:
        poner(bsdf, ["Alpha"], color[3])
        poner(bsdf, ["Transmission Weight", "Transmission"], 0.5)
        poner(bsdf, ["IOR", "IOR Level"], 1.45)
        for campo, valor in (("blend_method", "BLEND"), ("surface_render_method", "BLENDED")):
            try:
                setattr(mat, campo, valor)
            except Exception:
                pass
    return mat

def vestir(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj

def mirar_a(obj, punto):
    d = Vector(punto) - obj.location
    obj.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()

def clave(obj, cuadro, **campos):
    for campo, valor in campos.items():
        setattr(obj, campo, valor)
        obj.keyframe_insert(data_path=campo, frame=cuadro)

def interpolacion(tipo):
    # Fija con que interpolacion nacen las llaves siguientes. Se hace asi y no
    # recorriendo action.fcurves porque en Blender 4.4 y 5.x las acciones
    # pasaron a capas y ese atributo ya no existe.
    try:
        bpy.context.preferences.edit.keyframe_new_interpolation_type = tipo
    except Exception:
        pass

# ----------------------------------------------------------------- escena ---

limpiar()
escena = bpy.context.scene

for motor in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        escena.render.engine = motor
        break
    except TypeError:
        continue

escena.render.resolution_x = ANCHO
escena.render.resolution_y = ALTO
escena.render.resolution_percentage = 100
escena.render.fps = 30
escena.frame_start = 1
escena.frame_end = DURACION
escena.render.image_settings.file_format = "PNG"
os.makedirs(SALIDA, exist_ok=True)
escena.render.filepath = SALIDA
escena.render.film_transparent = False
try:
    escena.eevee.taa_render_samples = 48
except Exception:
    pass

# Colores planos, no fotorrealismo. Sin esto todo sale gris lavado.
try:
    escena.view_settings.view_transform = "Standard"
except Exception:
    pass
try:
    escena.view_settings.look = "None"
except Exception:
    pass

# Fondo blanco. Tambien hace de luz ambiente, asi que las lamparas van bajas.
mundo = escena.world or bpy.data.worlds.new("Mundo")
escena.world = mundo
mundo.use_nodes = True
fondo = None
for n in mundo.node_tree.nodes:
    if n.type == "BACKGROUND":
        fondo = n
        break
if fondo is None:
    fondo = mundo.node_tree.nodes.new("ShaderNodeBackground")
    for n in mundo.node_tree.nodes:
        if n.type == "OUTPUT_WORLD":
            mundo.node_tree.links.new(fondo.outputs[0], n.inputs[0])
            break
poner(fondo, ["Color"], BLANCO)
poner(fondo, ["Strength", "Fuerza"], 1.0)

# --- Materiales, de tono medio para que haya contraste contra el fondo blanco
m_carcasa = material("Carcasa", METAL_MEDIO, rugosidad=0.5)
m_base    = material("Base", METAL_OSC, rugosidad=0.6)
m_eje     = material("Eje", METAL_OSC, rugosidad=0.3, metalico=0.5)
m_toro    = material("Rodamiento", AZUL, rugosidad=0.4)
m_bola    = material("Bola", METAL_CLARO, rugosidad=0.2, metalico=0.8)
m_aceite  = material("Aceite", ACEITE, rugosidad=0.08, translucido=True)
m_viruta  = material("Viruta", VIRUTA, rugosidad=0.15, metalico=0.9)
m_polvo   = material("Polvo", POLVO, rugosidad=0.9)
m_agua    = material("Agua", AGUA, rugosidad=0.05, translucido=True)
m_marca   = material("Marca", NARANJA, rugosidad=0.35)

# --- Carcasa: tubo abierto, para ver lo de adentro sin hacer cortes
bpy.ops.mesh.primitive_cylinder_add(
    vertices=72, radius=CARCASA_RADIO, depth=CARCASA_LARGO, end_fill_type="NOTHING",
    rotation=(0, math.radians(90), 0), location=(0, 0, 0))
carcasa = bpy.context.object
carcasa.name = "Carcasa"
carcasa.modifiers.new(name="Grosor", type="SOLIDIFY").thickness = PARED
vestir(carcasa, m_carcasa)

# --- Base sobre la que se apoya
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -(CARCASA_RADIO + 0.16)))
base = bpy.context.object
base.name = "Base"
base.scale = (CARCASA_LARGO * 0.62, CARCASA_RADIO * 1.5, 0.16)
vestir(base, m_base)

# --- Eje
bpy.ops.mesh.primitive_cylinder_add(
    vertices=56, radius=EJE_RADIO, depth=EJE_LARGO,
    rotation=(0, math.radians(90), 0), location=(0, 0, 0))
eje = bpy.context.object
eje.name = "Eje"
vestir(eje, m_eje)

# --- Rodamiento con sus bolas, emparentadas al eje para que giren con el
bpy.ops.mesh.primitive_torus_add(
    major_radius=RODA_MAYOR, minor_radius=0.12, major_segments=48, minor_segments=16,
    rotation=(0, math.radians(90), 0), location=(RODAMIENTO_X, 0, 0))
toro = bpy.context.object
toro.name = "Rodamiento"
vestir(toro, m_toro)

for i in range(10):
    a = i * (2 * math.pi / 10)
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.12, segments=20, ring_count=12,
        location=(RODAMIENTO_X, RODA_MAYOR * math.cos(a), RODA_MAYOR * math.sin(a)))
    b = bpy.context.object
    b.name = "Bola%02d" % i
    vestir(b, m_bola)
    b.parent = eje
    b.matrix_parent_inverse = eje.matrix_world.inverted()

# --- Marca naranja en la zona de contacto: de ahi sale el desgaste
bpy.ops.mesh.primitive_torus_add(
    major_radius=RODA_MAYOR + 0.14, minor_radius=0.025, major_segments=48, minor_segments=8,
    rotation=(0, math.radians(90), 0), location=(RODAMIENTO_X, 0, 0))
marca = bpy.context.object
marca.name = "ZonaDeContacto"
vestir(marca, m_marca)

# --- Bano de aceite: cilindro recortado por arriba con un booleano, para que
#     sea un bano en el fondo y no un tapon que tine todo el interior.
bpy.ops.mesh.primitive_cylinder_add(
    vertices=72, radius=ACEITE_RADIO, depth=CARCASA_LARGO - 0.12,
    rotation=(0, math.radians(90), 0), location=(0, 0, 0))
aceite = bpy.context.object
aceite.name = "Aceite"
vestir(aceite, m_aceite)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, ACEITE_TAPA + 1.5))
cortador = bpy.context.object
cortador.name = "CortadorAceite"
cortador.scale = (CARCASA_LARGO, CARCASA_RADIO * 3, 3.0)
cortador.hide_render = True
cortador.hide_viewport = True

corte = aceite.modifiers.new(name="Corte", type="BOOLEAN")
corte.operation = "DIFFERENCE"
corte.object = cortador
try:
    corte.solver = "EXACT"
except Exception:
    pass

# --- Particulas: nacen junto al rodamiento y se depositan en el bano
formas = [("viruta", m_viruta), ("polvo", m_polvo), ("agua", m_agua)]
for i in range(PARTICULAS):
    tipo, mat = formas[i % 3]
    inicio = (
        RODAMIENTO_X + random.uniform(-0.25, 0.25),
        random.uniform(-0.55, 0.55),
        random.uniform(-0.75, -0.25),
    )

    if tipo == "viruta":
        bpy.ops.mesh.primitive_plane_add(size=0.19, location=inicio)
        p = bpy.context.object
        p.rotation_euler = (random.uniform(0, 3), random.uniform(0, 3), random.uniform(0, 3))
    elif tipo == "polvo":
        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.075, subdivisions=1, location=inicio)
        p = bpy.context.object
        p.scale = (1.0, random.uniform(0.7, 1.3), random.uniform(0.7, 1.3))
    else:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, segments=16, ring_count=10, location=inicio)
        p = bpy.context.object

    p.name = "Part_%s_%02d" % (tipo, i)
    vestir(p, mat)

    nace = 70 + int(i * (80 / max(1, PARTICULAS)))
    tam = p.scale.copy()
    clave(p, nace, scale=(0.0, 0.0, 0.0))
    clave(p, nace + 12, scale=tam)

    destino = (
        inicio[0] + random.uniform(-1.5, -0.4),
        inicio[1] + random.uniform(-0.35, 0.35),
        max(-0.88, inicio[2] + random.uniform(-0.25, 0.05)),
    )
    clave(p, nace, location=inicio)
    clave(p, DURACION, location=destino)

# --- El eje gira parejo de principio a fin
interpolacion("LINEAR")
clave(eje, 1, rotation_euler=(0, math.radians(90), 0))
clave(eje, DURACION, rotation_euler=(0, math.radians(90), math.radians(1080)))
interpolacion("BEZIER")

# --- Camara: tres cuartos, para que se lea el cuerpo del equipo y ademas se
#     alcance a ver dentro por el extremo abierto
cam_datos = bpy.data.cameras.new("Camara")
cam_datos.lens = 50
camara = bpy.data.objects.new("Camara", cam_datos)
bpy.context.collection.objects.link(camara)
escena.camera = camara

camara.location = (4.3, -7.9, 2.4)
mirar_a(camara, (0.1, 0, -0.15))
clave(camara, 1, location=camara.location)
camara.location = (3.7, -7.7, 2.1)
mirar_a(camara, (0.3, 0, -0.15))
clave(camara, DURACION, location=camara.location)

# --- Luz: baja, porque el fondo blanco ya ilumina bastante
def luz(nombre, pos, energia, tam):
    d = bpy.data.lights.new(nombre, type="AREA")
    d.energy = energia
    d.size = tam
    o = bpy.data.objects.new(nombre, d)
    bpy.context.collection.objects.link(o)
    o.location = pos
    mirar_a(o, (0, 0, 0))
    return o

luz("LuzPrincipal", (3.5, -5.0, 5.0), 220, 6.0)
luz("LuzRelleno", (-4.5, 2.5, 1.5), 70, 5.0)

print("Escena de aceite construida. Cuadros 1 a %d. Render a: %s" % (DURACION, SALIDA))
