import xml.etree.ElementTree as ET

SVG_IN  = 'assets/ranita-neon-3-dg.svg'
SVG_OUT = 'ranita-neon-numbered.svg'
NS = {'svg': 'http://www.w3.org/2000/svg'}
ET.register_namespace('', NS['svg'])

tree = ET.parse(SVG_IN)
root = tree.getroot()

# Buscar todos los grupos <g> que contienen un <polygon> amarillo
estrellas = []
for g in root.findall('.//svg:g', NS):
    polygon = g.find('svg:polygon', NS)
    if polygon is not None and polygon.get('fill', '').lower() == '#ffd93b':
        estrellas.append(g)

# Asignar class="estrella" y data-star="n"
for i, estrella in enumerate(estrellas, 1):
    estrella.set('class', 'estrella')
    estrella.set('data-star', str(i))

# Guardar el archivo nuevo
tree.write(SVG_OUT, encoding='utf-8', xml_declaration=True)
print(f'✅ Listo: {SVG_OUT} generado con {len(estrellas)} estrellas etiquetadas.')
