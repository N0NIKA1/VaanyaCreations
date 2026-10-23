"""Generates /app/lib/facets-meta.js — real deity/category facets (counts + tile images)."""
import json
from collections import defaultdict, Counter

cat = json.load(open('/app/lib/catalog.json'))
prods = cat['products']

deity_count = Counter()
deity_cats = defaultdict(Counter)
deity_img = {}
cat_count = Counter()
cat_img = {}
type_by_deity = defaultdict(Counter)

for p in prods:
    d, c = p['deity'], p['category']
    deity_count[d] += 1
    cat_count[c] += 1
    deity_cats[d][c] += 1
    type_by_deity[d][p['productType']] += 1
    if p['images']:
        deity_img.setdefault(d, p['images'][0])
        cat_img.setdefault(c, p['images'][0])

lines = ["// AUTO-GENERATED from lib/catalog.json — real facet counts and tile images.",
         "export const DEITY_FACETS = {"]
for d, n in deity_count.most_common():
    cats = ', '.join(f"'{c}'" for c, _ in deity_cats[d].most_common())
    lines.append(f"  '{d}': {{ count: {n}, categories: [{cats}], image: '{deity_img.get(d,'')}' }},")
lines.append("};\n")
lines.append("export const CATEGORY_FACETS = {")
for c, n in cat_count.most_common():
    lines.append(f"  '{c}': {{ count: {n}, image: '{cat_img.get(c,'')}' }},")
lines.append("};")

open('/app/lib/facets-meta.js', 'w').write('\n'.join(lines) + '\n')
print(open('/app/lib/facets-meta.js').read())
