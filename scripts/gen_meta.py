"""Generates /app/lib/collections-meta.js (small, client-safe) from catalog.json"""
import json

cat = json.load(open('/app/lib/catalog.json'))
cols = cat['collections']
prods = cat['products']

# real product counts per handle (after dedupe) + up to 4 preview images
from collections import defaultdict
counts = defaultdict(int)
previews = defaultdict(list)
for p in prods:
    for h in p['collections']:
        counts[h] += 1
        if len(previews[h]) < 4 and p['images']:
            previews[h].append(p['images'][0])

lines = [
    "// AUTO-GENERATED from lib/catalog.json (real Devastram collection data).",
    "// Client-safe: titles, tile images and counts only — no product bodies.",
    "export const COLLECTIONS = {",
]
for h, c in sorted(cols.items()):
    if counts[h] == 0:
        continue
    title = c['title'].replace("'", "\\'")
    img = (c['image'] or (previews[h][0] if previews[h] else ''))
    prev = ', '.join("'" + i + "'" for i in previews[h])
    lines.append(
        f"  '{h}': {{ handle: '{h}', title: '{title}', image: '{img}', count: {counts[h]}, previews: [{prev}] }},"
    )
lines.append("};\n")
lines.append("export const collectionMeta = (handle) => COLLECTIONS[handle] || null;")
lines.append("export const collectionTitle = (handle) => COLLECTIONS[handle]?.title || handle;")
lines.append("export const collectionImage = (handle) => COLLECTIONS[handle]?.image || '';\n")

open('/app/lib/collections-meta.js', 'w').write('\n'.join(lines))
live = [h for h in cols if counts[h] > 0]
print(f"wrote collections-meta.js with {len(live)} live collections (skipped {set(cols)-set(live)})")
