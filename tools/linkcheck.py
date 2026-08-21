"""Crawl the local build and report broken links, missing images and empty pages."""
import json, re, urllib.request, urllib.error, html
from collections import defaultdict

BASE = 'http://localhost:4321'
data = json.load(open('/Users/himanshusharma/grandmark-redesign/src/content/data.json'))
routes = sorted(data['pages'].keys())

seen_status = {}


def fetch(path):
    if path in seen_status:
        return seen_status[path]
    try:
        with urllib.request.urlopen(BASE + path, timeout=20) as r:
            seen_status[path] = (r.status, r.read().decode('utf-8', 'ignore'))
    except urllib.error.HTTPError as e:
        seen_status[path] = (e.code, '')
    except Exception as e:
        seen_status[path] = (0, str(e))
    return seen_status[path]


broken = defaultdict(set)
missing_img = defaultdict(set)
empty = []
ext = set()

for r in routes:
    status, body = fetch(r)
    if status != 200:
        broken['<page itself>'].add('%s -> %s' % (r, status))
        continue

    # main content length as a rough "is this page actually populated" check
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', body, flags=re.S)
    text = html.unescape(re.sub(r'<[^>]+>', ' ', text))
    if len(re.sub(r'\s+', ' ', text).strip()) < 900:
        empty.append((r, len(text)))

    for href in set(re.findall(r'href="(/[^"#?]*)"', body)):
        if href.startswith('/_next') or href.startswith('/img'):
            continue
        s, _ = fetch(href)
        if s != 200:
            broken[href].add(r)

    for src in set(re.findall(r'src="(/img/[^"?]+)"', body)):
        s, _ = fetch(src)
        if s != 200:
            missing_img[src].add(r)

    for u in set(re.findall(r'href="(https?://[^"]+)"', body)):
        ext.add(u)

print('routes crawled:', len(routes))
print()
print('--- BROKEN INTERNAL LINKS ---')
if not broken:
    print('  none')
for k, v in sorted(broken.items()):
    print('  %-62s  <- on %d page(s) e.g. %s' % (k, len(v), sorted(v)[0]))

print()
print('--- MISSING IMAGES ---')
if not missing_img:
    print('  none')
for k, v in sorted(missing_img.items()):
    print('  %-62s  <- %s' % (k, sorted(v)[0]))

print()
print('--- THIN PAGES (<900 chars of text) ---')
if not empty:
    print('  none')
for r, n in empty:
    print('  %-62s %d' % (r, n))

print()
print('--- EXTERNAL LINKS (%d) ---' % len(ext))
for u in sorted(ext):
    print('  ', u)
