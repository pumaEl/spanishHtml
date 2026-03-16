import re

# htmlAttr.js: español (sin comillas): "inglés"
with open('src/htmlAttr.js', encoding='utf-8') as f:
    lines = f.readlines()

# Extraer del formato: clave: "valor"
dict1 = {}
for line in lines:
    m = re.match(r'\s*([a-zA-Z]\w*):\s*"([^"]+)"', line)
    if m:
        dict1[m.group(1)] = m.group(2)

# AllCssProps.js: "inglés": "español"
with open('src/AllCssProps.js', encoding='utf-8') as f:
    lines = f.readlines()

dict2 = {}
for line in lines:
    m = re.match(r'\s*"([^"]+)":\s*"([^"]+)"', line)
    if m:
        dict2[m.group(2)] = m.group(1)  # Invertido: español -> inglés

print(f'Términos españoles en htmlAttr.js: {len(dict1)}')
print(f'Términos españoles en AllCssProps.js: {len(dict2)}')

# Encontrar términos españoles en ambos con diferentes inglés
conflictos = {}
for esp in dict1:
    if esp in dict2 and dict1[esp] != dict2[esp]:
        conflictos[esp] = (dict1[esp], dict2[esp])

if conflictos:
    print('\nConflictos encontrados:')
    for esp, (ing1, ing2) in sorted(conflictos.items()):
        print(f'  {esp}: htmlAttr="{ing1}" vs AllCssProps="{ing2}"')
else:
    print('\nSin conflictos - todas las traducciones son consistentes')
