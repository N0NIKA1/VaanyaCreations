"""One-off importer: pulls the real Devastram taxonomy + products into /app/lib/catalog.json

Run:  python3 /app/scripts/scrape_devastram.py
"""
import json, re, html, urllib.request, concurrent.futures, os, sys

BASE = "https://www.devastram.com"
PER_COLLECTION = 12
OUT = "/app/lib/catalog.json"
NAV_TREE = "/tmp/nav_tree.json"

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122 Safari/537.36"}


def fetch(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            if i == tries - 1:
                print("  !! fail", url, e, file=sys.stderr)
                return None


def strip_html(s):
    s = re.sub(r"<br\s*/?>", " ", s or "")
    s = re.sub(r"</(p|li|ul|div)>", " ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def clean_img(src):
    src = src.split("?")[0]
    if src.startswith("//"):
        src = "https:" + src
    return src + "?width=900"


DEITY_RULES = [
    ("laddu-gopal", ["laddu", "kanha", "bal gopal", "gopal", "chatri", "bedding"]),
    ("radha-krishna", ["rk ", "radhe", "radha krishna", "yugal", "radhakrishna", "-rk"]),
    ("radha-rani", ["radha-rani", "radha rani"]),
    ("mata-rani", ["mata", "devi", "durga", "lakshmi", "laxmi"]),
    ("hanuman", ["hanuman", "bajrang"]),
    ("shiv-parivar", ["shiv", "mahadev", "parivar"]),
    ("sai-baba", ["sai"]),
    ("ganesh", ["ganesh", "ganpati"]),
]

CATEGORY_RULES = [
    ("poshak", ["dress", "poshak", "lehenga", "patka", "dhoti", "vastra", "bedding", "chunri"]),
    ("jewellery", ["necklace", "haar", "mukut", "kangan", "kangana", "bansuri", "earring", "maang",
                   "chandrika", "kamar", "payal", "trishul", "shringar", "jewellery", "hairs", "chattar"]),
    ("wedding", ["potli", "envelope", "gift bag", "zip", "clutch", "pouch", "bag"]),
    ("home-decor", ["diya", "candle", "toran", "bandhanwal", "rangoli", "shubh", "labh"]),
    ("puja", ["attar", "ittar", "chandan", "puja", "umbrella", "chatri", "toys"]),
]


def classify(text, fallback_deity="general", fallback_cat="accessories"):
    t = text.lower()
    deity = fallback_deity
    for name, keys in DEITY_RULES:
        if any(k in t for k in keys):
            deity = name
            break
    cat = fallback_cat
    for name, keys in CATEGORY_RULES:
        if any(k in t for k in keys):
            cat = name
            break
    return deity, cat


def collect_handles(nodes, acc):
    for n in nodes:
        href = n.get("href") or ""
        m = re.match(r"^/collections/([a-z0-9\-]+)$", href)
        if m:
            acc.setdefault(m.group(1), n["label"])
        collect_handles(n.get("children") or [], acc)
    return acc


def main():
    nav = json.load(open(NAV_TREE))
    handles = collect_handles(nav, {})
    # a few collections that exist on site but are only reachable via nested labels
    handles.setdefault("designer-rk", "Designer RK Dresses")
    handles.setdefault("summer-laddu-gopal", "Summer Collection")
    print(f"{len(handles)} collections to import")

    def job(item):
        handle, label = item
        data = fetch(f"{BASE}/collections/{handle}/products.json?limit={PER_COLLECTION}")
        return handle, label, (data or {}).get("products", [])

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        for handle, label, prods in ex.map(job, handles.items()):
            print(f"  {handle:45s} {len(prods):3d} products")
            results.append((handle, label, prods))

    products = {}
    collections = {}

    for handle, label, prods in results:
        tile = None
        for p in prods:
            imgs = [clean_img(i["src"]) for i in (p.get("images") or [])][:3]
            if not imgs:
                continue
            if tile is None:
                tile = imgs[0]
            pid = p["handle"]
            variants = p.get("variants") or [{}]
            v = variants[0]
            price = int(round(float(v.get("price") or 0)))
            cap = v.get("compare_at_price")
            mrp = int(round(float(cap))) if cap else None
            if mrp and mrp <= price:
                mrp = None
            blob = f"{handle} {label} {p.get('product_type','')} {p['title']} {' '.join(p.get('tags') or [])}"
            deity, cat = classify(blob)
            if pid in products:
                products[pid]["collections"].append(handle)
                continue
            sizes = [v.get("title") for v in variants if v.get("title") and v.get("title") != "Default Title"]
            products[pid] = {
                "id": pid,
                "name": p["title"],
                "price": price,
                "mrp": mrp,
                "images": imgs,
                "description": strip_html(p.get("body_html"))[:600],
                "deity": deity,
                "category": cat,
                "productType": p.get("product_type") or label,
                "tags": (p.get("tags") or [])[:8],
                "sizes": sizes[:8],
                "collections": [handle],
                "inStock": any(v.get("available") for v in variants),
            }
        collections[handle] = {
            "handle": handle,
            "title": label,
            "image": tile,
            "count": len(prods),
        }

    plist = list(products.values())
    for p in plist:
        p["bestSeller"] = "newin-bestsellers" in p["collections"] or "devotee-collection" in p["collections"]
        p["isNew"] = "newin-bestsellers" in p["collections"]
        p["onSale"] = bool(p["mrp"])

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({"collections": collections, "products": plist}, open(OUT, "w"), indent=0)
    print(f"\nWROTE {OUT}: {len(plist)} unique products across {len(collections)} collections")
    missing = [h for h, c in collections.items() if not c["image"]]
    print("collections with NO products/image:", missing)


if __name__ == "__main__":
    main()
