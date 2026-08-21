"""Emit the site data consumed by the Next.js app. All strings verbatim."""
import json, re, os, struct, html as H

ROOT = '/Users/himanshusharma/grandmark-redesign'
ent = json.load(open('entities.json'))
content = json.load(open('content.json'))

# ------------------------------------------------- old URL -> new route map
def route(old):
    # strip any scheme/host variant the source uses (http, https, with or
    # without www) so every link normalises to a site-relative path
    p = re.sub(r'^https?://(?:www\.)?grandmarkca\.com', '', old.strip())
    p = '/' + p.strip('/')
    if p == '/':
        return '/'
    rules = [
        (r'^/about-grandmark-our-partners$', '/about'),
        (r'^/about-grandmark$', '/about'),
        (r'^/about-grandmark-our-partners/(.+)$', r'/partners/\1'),
        (r'^/about-grandmark/(.+)$', r'/partners/\1'),
        (r'^/grandmark-associates-top-10-ca-firm-in-india/(.+)$', r'/partners/\1'),
        (r'^/indias-top-ca-firm/about_the_firm$', '/about/the-firm'),
        (r'^/home/about_the_firm$', '/about/the-firm'),
        (r'^/home/sectors$', '/sectors'),
        (r'^/services-offered-by-grandmark/various-corporate-laws/(.+)$', r'/services/\1'),
        (r'^/services-offered-by-grandmark$', '/services'),
        (r'^/services-offered-by-grandmark/(.+)$', r'/services/\1'),
        (r'^/contact-us$', '/contact'),
        (r'^/blogs$', '/blog'),
    ]
    for pat, rep in rules:
        if re.match(pat, p):
            return re.sub(pat, rep, p)
    return p


IMG_DIR = ROOT + '/public/img'
ON_DISK = set(os.listdir(IMG_DIR)) if os.path.isdir(IMG_DIR) else set()


def _dimensions(path):
    """Read pixel dimensions straight from the PNG/JPEG/GIF header."""
    with open(path, 'rb') as f:
        head = f.read(32)
        if head[:8] == b'\x89PNG\r\n\x1a\n':
            w, h = struct.unpack('>II', head[16:24])
            return int(w), int(h)
        if head[:2] == b'\xff\xd8':                       # JPEG: walk segments
            f.seek(2)
            while True:
                b = f.read(1)
                while b and b != b'\xff':
                    b = f.read(1)
                marker = f.read(1)
                while marker == b'\xff':
                    marker = f.read(1)
                if not marker:
                    return 0, 0
                if marker[0] in range(0xC0, 0xD0) and marker[0] not in (0xC4, 0xC8, 0xCC):
                    f.read(3)
                    h, w = struct.unpack('>HH', f.read(4))
                    return int(w), int(h)
                seg = f.read(2)
                if len(seg) < 2:
                    return 0, 0
                f.seek(struct.unpack('>H', seg)[0] - 2, 1)
        if head[:6] in (b'GIF87a', b'GIF89a'):
            w, h = struct.unpack('<HH', head[6:10])
            return int(w), int(h)
    return 0, 0


# Measure every asset once. Hero selection is then a property of the image
# itself (is it big and landscape enough to sit behind a masthead?) rather
# than a hand-maintained list of route exceptions.
IMAGE_SIZES = {}
for name in sorted(ON_DISK):
    try:
        w, h = _dimensions(os.path.join(IMG_DIR, name))
        if w and h:
            IMAGE_SIZES[name] = [w, h]
    except Exception:
        pass


def imgname(u):
    """Map a source image URL to a file we actually hold.

    WordPress serves resized variants (name-600x380.jpg). Where only the
    full-size original was downloaded, fall back to it rather than emitting a
    reference to a file that does not exist.
    """
    if not u:
        return ''
    base = os.path.basename(u)
    if base in ON_DISK:
        return '/img/' + base
    full = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', base)
    if full in ON_DISK:
        return '/img/' + full
    return '/img/' + base


# --------------------------------------------------------------- navigation
NAV = [
    {'label': 'Home', 'href': '/'},
    {'label': 'About Us', 'href': '/about', 'children': [
        {'label': 'About the Firm', 'href': '/about/the-firm'},
        {'label': 'Partners', 'href': '/partners'},
        {'label': 'Sectors', 'href': '/sectors'},
        {'label': 'Events', 'href': '/events'},
    ]},
    {'label': 'Services', 'href': '/services', 'children': [
        {'label': 'Tax Consulting', 'href': '/services/tax-consulting', 'children': [
            {'label': 'Direct Tax', 'href': '/services/tax-consulting/direct-tax'},
            {'label': 'Indirect Tax – GST Expert', 'href': '/services/tax-consulting/indirect-tax-gst-expert'},
            {'label': 'International Taxations', 'href': '/services/tax-consulting/international-taxations'},
        ]},
        {'label': 'Audit & Assurance', 'href': '/services/audit-assurance', 'children': [
            {'label': 'Statutory Audit', 'href': '/services/audit-assurance/statutory-audit'},
            {'label': 'Internal Audit', 'href': '/services/audit-assurance/internal-audit'},
            {'label': 'Bank Audit', 'href': '/services/audit-assurance/bank-audit'},
            {'label': 'Information Systems Audit', 'href': '/services/audit-assurance/information-systems-audit'},
            {'label': 'SSAE 18 SOC 1 and SOC 2 Attestations', 'href': '/services/audit-assurance/ssae18'},
        ]},
        {'label': 'Business Consulting & Outsourcing Services', 'href': '/services/business-consulting-outsourcing-services', 'children': [
            {'label': 'Valuations', 'href': '/services/business-consulting-outsourcing-services/valuations'},
            {'label': 'Import- Export Advisory', 'href': '/services/business-consulting-outsourcing-services/import-export-advisory'},
            {'label': 'Insurance Expert', 'href': '/services/business-consulting-outsourcing-services/insurance-expert'},
            {'label': 'Ngo Expert', 'href': '/services/business-consulting-outsourcing-services/ngo-expert'},
            {'label': 'Merger & Acquisition', 'href': '/services/business-consulting-outsourcing-services/merger-acquisition'},
            {'label': 'Financial Restructuring', 'href': '/services/business-consulting-outsourcing-services/financial-restructuring'},
            {'label': 'Fund Management Services', 'href': '/services/business-consulting-outsourcing-services/fund-management-services'},
            {'label': 'Registration & Start-Up Services', 'href': '/services/business-consulting-outsourcing-services/registration-start-up-services'},
            {'label': 'Accounting Service/BPO Services', 'href': '/services/business-consulting-outsourcing-services/accounting-service-bpo-services'},
            {'label': 'Ind-As Implementation', 'href': '/services/business-consulting-outsourcing-services/ind-as-implementation'},
        ]},
        {'label': 'Forensic Audit And Fraud Detection', 'href': '/services/forensic-audit-and-fraud-detection'},
        {'label': 'Corporate Law & Compliances', 'children': [
            {'label': 'Corporate law & Compliances', 'href': '/services/corporate-law-compliances'},
            {'label': 'GDPR / CCPA / Privacy', 'href': '/services/gdprprivacy'},
        ]},
        {'label': 'Insolvency Professionals', 'href': '/services/insolvency-professionals'},
    ]},
    {'label': 'Global Services', 'href': '/global-services', 'children': [
        {'label': 'Canada Desk', 'href': '/global-services/canada-desk'},
        {'label': 'Australia Desk', 'href': '/global-services/australia-desk'},
        {'label': 'UAE Desk', 'href': '/global-services/uae-desk'},
        {'label': 'Singapore Desk', 'href': '/global-services/singapore-desk'},
        {'label': 'United Kingdom Desk', 'href': '/global-services/united-kingdom-desk'},
        {'label': 'USA Desk', 'href': '/global-services/usa-desk'},
        {'label': 'NRI Desk', 'href': '/services/tax-consulting/nri-desk'},
    ]},
    {'label': 'Legal Desk', 'href': '/legal-desk'},
    {'label': 'Blog', 'href': '/blog'},
    {'label': 'Contact Us', 'href': '/contact'},
]

# ------------------------------------------------------------------ slides
# The home slider is the firm's own pairing of a full-width banner with the
# service it illustrates. Reading it here means masthead imagery is derived
# from the site's own data rather than hand-assigned per route.
def slides():
    doc = open('html/home.html', encoding='utf-8', errors='ignore').read()
    out = []
    for m in re.finditer(
            r'<li[^>]*data-link="([^"]+)"[^>]*>\s*(?:<!--[^>]*-->\s*)*<img[^>]+src="([^"]+)"',
            doc, re.S):
        href, img = route(m.group(1)), imgname(m.group(2))
        if any(o['img'] == img for o in out):
            continue
        out.append({'href': href, 'img': img})
    return out


SLIDES = slides()

# ------------------------------------------------------------------- pages
import difflib

def norm(s):
    s = re.sub(r'\band\b', '', s.lower())
    return re.sub(r'[^a-z0-9]', '', s)


pages = {}
for slug, p in content.items():
    e = ent['pages'][slug]
    r = route(p['path'])
    blocks = []
    for b in e['blocks'] + e['tail']:
        if b['type'] == 'img':
            blocks.append({'type': 'img', 'src': imgname(b['src'])})
        else:
            blocks.append(b)
    pages[r] = {
        'route': r,
        'title': p['title'],
        'sourceUrl': p['url'],
        'blocks': blocks,
    }

# ---- hub pages: lift "image + title" pairs out of the body into link cards.
# Several card titles carry typos on the live site ("VALUTIONS",
# "FINANCIAL RESTRUCTING"). The label is preserved exactly as published; only
# the destination is resolved, by fuzzy-matching against real descendant pages.
ALL_ROUTES = {r: v['title'] for r, v in pages.items()}

for r, page in pages.items():
    if r.startswith('/partners') or r == '/about':
        continue  # partner directories are rendered from structured data

    kids = {k: t for k, t in ALL_ROUTES.items()
            if k.startswith(r.rstrip('/') + '/') and k != r}
    if not kids:
        continue

    lookup = {}
    for k, t in kids.items():
        lookup.setdefault(norm(t), k)
        lookup.setdefault(norm(k.rsplit('/', 1)[-1]), k)

    cards, rest, i = [], [], 0
    bl = page['blocks']
    while i < len(bl):
        b = bl[i]
        nxt = bl[i + 1] if i + 1 < len(bl) else None
        if b['type'] == 'img' and nxt and nxt['type'] in ('h3', 'h4'):
            title = nxt['text']
            key = norm(title)
            href = lookup.get(key)
            if not href:
                m = difflib.get_close_matches(key, list(lookup), n=1, cutoff=0.6)
                href = lookup[m[0]] if m else ''
            if href:
                cards.append({'title': title, 'img': b['src'], 'href': href})
                i += 2
                continue
        rest.append(b)
        i += 1

    if cards:
        page['cards'] = cards
        page['blocks'] = rest

# --------------------------------------------------------------- partners
partners = []
for x in ent['partners']:
    prof = route(x['profileUrl']) if x['profileUrl'] else ''
    partners.append({
        'name': x['name'],
        'cardName': x.get('cardName', ''),
        'cardRole': x['cardRole'],
        'designation': x['designation'],
        'qualifications': x['qualifications'],
        'memberSince': x['memberSince'],
        'email': x['email'],
        'photo': imgname(x['photo']),
        'href': prof,
    })

profiles = {}
for s, x in ent['profiles'].items():
    profiles[s] = {**x, 'photo': imgname(x['photo']), 'href': '/partners/' + s}

about_team = []
for x in ent.get('aboutTeam', []):
    about_team.append({
        'name': x['name'],
        'cardName': x.get('cardName', ''),
        'cardRole': x['cardRole'],
        'designation': x['designation'],
        'qualifications': x['qualifications'],
        'memberSince': x['memberSince'],
        'email': x['email'],
        'photo': imgname(x['photo']),
        'href': route(x['profileUrl']) if x['profileUrl'] else '',
    })

out = {
    'nav': NAV,
    'imageSizes': IMAGE_SIZES,
    'slides': [{**sl, 'label': pages.get(sl['href'], {}).get('title', '')} for sl in SLIDES],
    'aboutTeam': about_team,
    'pages': pages,
    'partners': partners,
    'profiles': profiles,
    'offices': [{**o, 'photo': imgname(o.get('photo', ''))} for o in ent['offices']],
}

os.makedirs(ROOT + '/src/content', exist_ok=True)
json.dump(out, open(ROOT + '/src/content/data.json', 'w'), indent=1, ensure_ascii=False)
print('routes:', len(pages))
for r in sorted(pages):
    print('  ', r)
