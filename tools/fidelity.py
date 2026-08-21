"""Verify every text string scraped from grandmarkca.com survives in the rebuild."""
import json, re, html, urllib.request, sys

BASE = 'http://localhost:4321'
DATA = '/Users/himanshusharma/grandmark-redesign/src/content/data.json'
data = json.load(open(DATA))


def norm(s):
    s = html.unescape(s)
    s = s.replace('’', "'").replace('‘', "'")
    s = s.replace('“', '"').replace('”', '"')
    s = s.replace('–', '-').replace('—', '-').replace('−', '-')
    s = s.replace('\xa0', ' ')
    return re.sub(r'\s+', ' ', s).strip().lower()


def page_text(path):
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        h = r.read().decode('utf-8', 'ignore')
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', h, flags=re.S | re.I)
    return norm(re.sub(r'<[^>]+>', ' ', h))


strings = {}          # route -> [strings that must appear]
for route, page in data['pages'].items():
    want = []
    for b in page['blocks']:
        if b['type'] == 'ul':
            want.extend(b['items'])
        elif b['type'] != 'img':
            want.append(b['text'])
    for c in page.get('cards', []):
        want.append(c['title'])
    strings[route] = want

# partner + office records must survive too
strings.setdefault('/partners', [])
for p in data['partners']:
    strings['/partners'] += [p['name'], p['designation'], p['qualifications'],
                             p['memberSince'], p['email']]
strings.setdefault('/contact', [])
for o in data['offices']:
    strings['/contact'] += [o['city'], o['contact'], o['phone'], o['address']]

missing = {}
checked = 0
for route, want in sorted(strings.items()):
    try:
        body = page_text(route)
    except Exception as e:
        missing[route] = ['<<page failed: %s>>' % e]
        continue
    gone = []
    for w in want:
        if not w or len(w.strip()) < 3:
            continue
        checked += 1
        if norm(w) not in body:
            gone.append(w)
    if gone:
        missing[route] = gone

print('routes checked : %d' % len(strings))
print('strings checked: %d' % checked)
print('routes with missing content: %d' % len(missing))
print()
for route, gone in sorted(missing.items()):
    print('=== %s  (%d missing)' % (route, len(gone)))
    for g in gone[:8]:
        print('    - %s' % g[:130])
    if len(gone) > 8:
        print('    ... and %d more' % (len(gone) - 8))
sys.exit(0)
