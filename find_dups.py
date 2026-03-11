import re

lines = open('src/dictionary.js', encoding='utf-8').read().splitlines()
subset = lines[142:382]
keys = []
for l in subset:
    m = re.match(r"\s*['\"]?([^'\"]+)['\"]?\s*:", l)
    if m:
        keys.append(m.group(1))
dups = {k: keys.count(k) for k in set(keys) if keys.count(k) > 1}
print('duplicates in range 143-382:')
print(dups)

# whole file duplicates
keys_all=[]
for l in lines:
    m=re.match(r"\s*['\"]?([^'\"]+)['\"]?\s*:",l)
    if m:
        keys_all.append(m.group(1))
dups_all={k:keys_all.count(k) for k in set(keys_all) if keys_all.count(k)>1}
print('duplicates entire file:')
print(dups_all)
