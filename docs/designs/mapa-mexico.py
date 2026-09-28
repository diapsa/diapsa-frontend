# -*- coding: utf-8 -*-
"""Mapa de puntos de México por estado para la sección de presencia.
Contorno del país aproximado a mano y cada punto asignado al estado de la
semilla más cercana (Voronoi). Es un dibujo ilustrativo, no un mapa de
límites exactos. Genera data/presencia-mexico.json."""
import json, math

CONTORNO = [
    (-117.1,32.5),(-114.7,32.7),(-111.1,31.3),(-108.2,31.3),(-108.2,31.8),(-106.5,31.8),(-104.9,30.6),(-104.4,29.6),
    (-103.2,29.0),(-102.4,29.8),(-101.4,29.8),(-100.5,28.7),(-99.5,27.5),(-99.1,26.4),(-98.2,26.1),(-97.2,25.9),
    (-97.5,24.5),(-97.8,22.4),(-97.2,20.9),(-96.4,19.8),(-96.1,19.2),(-95.2,18.7),(-94.5,18.15),(-93.2,18.4),
    (-92.0,18.7),(-91.3,18.6),(-90.7,19.4),(-90.4,20.9),(-90.3,21.1),(-89.6,21.3),(-88.0,21.6),(-87.0,21.5),
    (-86.8,21.1),(-87.4,20.2),(-87.7,19.3),(-87.9,18.4),(-88.3,18.5),(-88.9,17.9),(-89.15,17.8),(-90.98,17.8),
    (-90.98,17.25),(-91.4,17.25),(-90.4,16.1),(-91.7,16.1),(-92.2,15.3),(-92.2,14.55),(-93.0,15.6),(-94.2,16.1),
    (-95.2,16.2),(-96.5,15.65),(-97.8,16.0),(-99.9,16.85),(-101.5,17.6),(-102.2,17.95),(-103.5,18.3),(-104.6,19.1),
    (-105.5,20.0),(-105.3,20.6),(-105.7,21.4),(-105.3,22.0),(-106.4,23.2),(-107.5,24.5),(-108.8,25.5),(-109.4,26.2),
    (-110.6,27.9),(-111.5,28.9),(-112.6,30.2),(-113.1,31.2),(-114.8,31.8),(-114.5,30.9),(-114.0,29.5),(-112.9,28.3),
    (-112.3,27.0),(-111.6,26.0),(-110.7,24.8),(-110.3,24.2),(-109.4,23.2),(-109.9,22.9),(-110.3,23.4),(-111.8,24.6),
    (-112.2,25.9),(-113.2,26.8),(-114.5,27.8),(-114.2,28.6),(-115.7,29.8),(-116.6,31.3),(-117.1,32.5),
]

SEMILLAS = {
    "Aguascalientes": [(-102.3,21.95)],
    "Baja California": [(-115.8,31.3),(-114.6,29.4)],
    "Baja California Sur": [(-112.8,26.8),(-111.2,24.8),(-110.2,23.6)],
    "Campeche": [(-90.3,19.3),(-90.1,18.2)],
    "Chiapas": [(-92.6,16.5),(-93.5,16.4)],
    "Chihuahua": [(-106.2,29.3),(-106.5,27.3)],
    "Ciudad de México": [(-99.13,19.32)],
    "Coahuila": [(-102.0,27.6),(-101.3,26.0),(-103.2,26.3)],
    "Colima": [(-103.9,19.1)],
    "Durango": [(-104.8,24.8),(-105.6,25.9)],
    "Estado de México": [(-99.75,19.5),(-99.95,19.0)],
    "Guanajuato": [(-101.0,20.9)],
    "Guerrero": [(-100.3,17.7),(-99.0,17.4)],
    "Hidalgo": [(-98.9,20.5)],
    "Jalisco": [(-103.5,20.5),(-104.5,19.7),(-103.4,21.6)],
    "Michoacán": [(-101.9,19.3),(-102.9,18.8)],
    "Morelos": [(-99.05,18.75)],
    "Nayarit": [(-104.9,21.8)],
    "Nuevo León": [(-100.0,25.9),(-99.7,24.3)],
    "Oaxaca": [(-96.7,17.1),(-95.2,16.7),(-97.8,16.9)],
    "Puebla": [(-97.9,18.6),(-97.8,19.9)],
    "Querétaro": [(-99.9,20.85)],
    "Quintana Roo": [(-88.3,19.3),(-87.5,20.7)],
    "San Luis Potosí": [(-100.6,22.6),(-99.1,21.9)],
    "Sinaloa": [(-108.3,25.8),(-106.7,23.8)],
    "Sonora": [(-111.6,30.3),(-110.1,28.3),(-112.9,31.4)],
    "Tabasco": [(-92.9,17.95)],
    "Tamaulipas": [(-98.5,25.4),(-98.3,23.4)],
    "Tlaxcala": [(-98.2,19.45)],
    "Veracruz": [(-97.6,21.2),(-96.7,19.6),(-95.1,18.0),(-97.9,22.0)],
    "Yucatán": [(-89.0,20.8)],
    "Zacatecas": [(-102.7,23.2),(-103.5,24.2)],
}

TRABAJAMOS = ["Aguascalientes","Baja California","Baja California Sur","Campeche","Chihuahua","Coahuila","Guanajuato",
              "Jalisco","Estado de México","Nayarit","Nuevo León","Querétaro","Quintana Roo","San Luis Potosí","Sonora",
              "Tabasco","Tamaulipas","Veracruz","Yucatán","Zacatecas","Ciudad de México"]
assert all(e in SEMILLAS for e in TRABAJAMOS)

def dentro(x, y, p):
    c = False; j = len(p) - 1
    for i in range(len(p)):
        xi, yi = p[i]; xj, yj = p[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c

LON0, LON1, LAT0, LAT1 = -118, -86, 14, 33
PASO = 0.36
PASO_X = 0.36 / 0.92  # misma separación en pantalla en los dos ejes
ESC = 30  # px por grado
KX = 0.92  # cos(23°): corrige el estiramiento horizontal
W, H = round((LON1 - LON0) * ESC * KX), round((LAT1 - LAT0) * ESC)
estados = {e: [] for e in SEMILLAS}
fila = 0
lat = LAT1
while lat >= LAT0:
    lon = LON0 + (PASO_X / 2 if fila % 2 else 0)  # rejilla escalonada
    while lon <= LON1:
        if dentro(lon, lat, CONTORNO):
            k = math.cos(math.radians(lat))
            mejor = min(SEMILLAS, key=lambda e: min(((lon - a) * k) ** 2 + (lat - b) ** 2 for a, b in SEMILLAS[e]))
            estados[mejor].append([round((lon - LON0) * ESC * KX, 1), round((LAT1 - lat) * ESC, 1)])
        lon += PASO_X
    lat -= PASO
    fila += 1

base = {"nombre": "Saltillo, Coahuila", "x": round((-101.0 - LON0) * ESC * KX, 1), "y": round((LAT1 - 25.42) * ESC, 1)}
salida = {
    "_nota": "Estados donde trabaja DIAPSA (lista de Emiliano, 2026-09-28). Mapa de puntos ilustrativo generado con scratchpad/mapa-mexico.py: contorno aproximado y cada punto asignado al estado más cercano, no son límites exactos.",
    "ancho": W, "alto": H, "radio": 3.6,
    "base": base,
    "internacional": ["Panamá", "República Dominicana", "Ecuador", "Uruguay", "Argentina", "España"],
    "estados": [{"nombre": e, "trabajamos": e in TRABAJAMOS, "puntos": estados[e]} for e in SEMILLAS],
}
json.dump(salida, open(r"C:\laragon\www\diapsa-frontend\data\presencia-mexico.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(W, H, sum(len(v) for v in estados.values()), {e: len(v) for e, v in estados.items() if len(v) < 4})

# vista previa en PNG
from PIL import Image, ImageDraw
im = Image.new("RGB", (W, H), (13, 26, 56)); d = ImageDraw.Draw(im)
for e, pts in estados.items():
    c = (255, 195, 77) if e in TRABAJAMOS else (70, 90, 130)
    for x, y in pts:
        d.ellipse([x - 3.4, y - 3.4, x + 3.4, y + 3.4], fill=c)
d.ellipse([base["x"] - 8, base["y"] - 8, base["x"] + 8, base["y"] + 8], outline=(255, 255, 255), width=3)
im.save(r"C:\Users\emili\AppData\Local\Temp\claude\C--Users-emili-OneDrive-Desktop-Juridico-proyecto-cumplimiento-04-desarrollo\1581a0b7-ea58-4f97-9db3-79939369854d\scratchpad\mapa-mexico.png")
