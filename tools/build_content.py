"""Build structured, verbatim content entities for the React site."""
import json, re, html as H, os

content = json.load(open('content.json'))


def txt(s):
    s = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', s, flags=re.S | re.I)
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    s = H.unescape(s).replace('\xa0', ' ')
    s = re.sub(r'[ \t]+', ' ', s)
    return '\n'.join(l.strip() for l in s.split('\n')).strip()


def read(slug):
    return open('html/%s.html' % slug, encoding='utf-8', errors='ignore').read()


def pslug(url):
    return url.rstrip('/').split('/')[-1]


# ---------------------------------------------------------------- PARTNERS
def partners(source='partners'):
    doc = read(source)
    chunks = doc.split('class="pic_info_link_type4"')
    out = []
    for ch in chunks[1:]:
        ch = ch[:6000]
        href = re.search(r'href="([^"]+)"', chunks[chunks.index(ch) - 1][-400:]) if False else None
        # href sits just before the class attr
        prev = ch
        m_img = re.search(r'<img[^>]+src="([^"]+)"', ch)
        m_name = re.search(r'<div class="info_desc">.*?<h3>(.*?)</h3>\s*<p>(.*?)</p>', ch, re.S)
        m_h3 = re.search(r'<h3 class="boc_heading[^"]*"[^>]*><span>(.*?)</span></h3>', ch, re.S)
        m_desig = re.search(r'<p><em>(.*?)</em></p>', ch, re.S)
        m_qual = re.search(r'<p><strong>(.*?)</strong><br\s*/?>\s*(.*?)</p>', ch, re.S)
        # prefer the visible link text: one source record has an href that
        # disagrees with the address actually shown on the page
        m_mail = re.search(r'<a href="mailto:[^"]*">([^<]+@[^<]+)</a>', ch) \
            or re.search(r'href="mailto:([^"]+)"', ch)
        m_prof = re.search(r'<a href="(https?://[^"]*?)">View full profile</a>', ch)
        if not (m_img and m_h3):
            continue
        out.append({
            'name': txt(m_h3.group(1)),
            'cardName': txt(m_name.group(1)) if m_name else '',
            'cardRole': txt(m_name.group(2)) if m_name else '',
            'designation': txt(m_desig.group(1)) if m_desig else '',
            'qualifications': txt(m_qual.group(1)) if m_qual else '',
            'memberSince': txt(m_qual.group(2)) if m_qual else '',
            'email': m_mail.group(1) if m_mail else '',
            'photo': m_img.group(1),
            'profileUrl': m_prof.group(1) if m_prof else '',
        })
    return out


# ------------------------------------------------------- PARTNER PROFILES
def profiles():
    out = {}
    for slug, page in content.items():
        if not slug.startswith('about-grandmark-our-partners__'):
            continue
        b = page['blocks']
        photo = next((x['src'] for x in b if x['type'] == 'img'), '')
        h1 = next((x['text'] for x in b if x['type'] == 'h1'), page['title'])
        # header meta = first h3/p cluster
        desig = ''
        qual = ''
        member = ''
        phone = ''
        email = ''
        doc = read(slug)
        m_desig = re.search(r'<p><em>(.*?)</em></p>', doc, re.S)
        if m_desig:
            desig = txt(m_desig.group(1))
        m_qual = re.search(r'<p><strong>(.*?)</strong><br\s*/?>\s*(.*?)</p>', doc, re.S)
        if m_qual:
            qual, member = txt(m_qual.group(1)), txt(m_qual.group(2))
        m_mail = re.search(r'<a href="mailto:[^"]*">([^<]+@[^<]+)</a>', doc) \
            or re.search(r'href="mailto:([^"]+)"', doc)
        if m_mail:
            email = txt(m_mail.group(1))
        m_ph = re.search(r'icon-phone[^>]*></i></span>\s*<div class="boc_list_item_text[^"]*">(?:<a[^>]*>)?([^<]+)', doc)
        if m_ph:
            phone = txt(m_ph.group(1))
        # bio = everything after the h1
        idx = next((i for i, x in enumerate(b) if x['type'] == 'h1'), None)
        bio = []
        if idx is not None:
            for x in b[idx + 1:]:
                if x['type'] in ('p', 'ul', 'h2', 'h3', 'h4'):
                    bio.append(x)
        out[pslug(page['path'])] = {
            'slug': pslug(page['path']),
            'name': h1,
            'title': page['title'],
            'designation': desig,
            'qualifications': qual,
            'memberSince': member,
            'email': email,
            'phone': phone,
            'photo': photo,
            'bio': bio,
        }
    return out


# ----------------------------------------------------------------- OFFICES
def offices():
    doc = read('contact-us')
    body = doc[doc.find("<div class='post_content'>"):]
    out = []
    # each office = h3 city, then text column with contact + address
    parts = re.split(r'<h3 class="boc_heading[^"]*"[^>]*><span>(.*?)</span></h3>', body)
    for i in range(1, len(parts) - 1, 2):
        city = txt(parts[i])
        seg = parts[i + 1][:4000]
        if 'Point of Contact' not in seg:
            continue
        # the final office block runs on into the enquiry form; stop before it
        # so the form's field labels never leak into an address
        for marker in ('wpcf7', 'Your Name (required)', 'Contact Us'):
            cut = seg.find(marker)
            if cut > 0:
                seg = seg[:cut]
        # the city photograph is rendered immediately above its heading
        before = parts[i - 1]
        imgs = re.findall(r'src="([^"]*wp-content/uploads/[^"]+)"', before)
        photo = imgs[-1] if imgs else ''
        block = txt(re.sub(r'<(script|style)[^>]*>.*?</\1>', '', seg, flags=re.S))
        lines = [l for l in block.split('\n') if l.strip()]
        # contact person = line after "Point of Contact:"
        person = phone = email = address = ''
        maps = ''
        m = re.search(r'href="(https?://(?:goo\.gl|maps\.google|www\.google\.com/maps)[^"]*)"', seg)
        if m:
            maps = H.unescape(m.group(1))
        emails = re.findall(r'mailto:([^"]+)"', seg)
        email = ' | '.join(dict.fromkeys(emails))
        try:
            k = next(i2 for i2, l in enumerate(lines) if l.lower().startswith('point of contact'))
            person = lines[k + 1] if k + 1 < len(lines) else ''
            phone = lines[k + 2] if k + 2 < len(lines) else ''
        except StopIteration:
            pass
        # address = last long line not containing @
        cands = [l for l in lines if len(l) > 30 and '@' not in l and 'Point of Contact' not in l]
        address = cands[-1] if cands else ''
        out.append({'city': city, 'contact': person, 'phone': phone,
                    'email': email, 'address': address, 'maps': maps,
                    'photo': photo})
    return out


# ---------------------------------------------------------------- SERVICES
NAV = json.load(open('nav.json')) if os.path.exists('nav.json') else None


def page_entry(slug):
    p = content.get(slug)
    if not p:
        return None
    blocks = p['blocks']
    # split trailing site-furniture (Knowledge Pool / Ask the Expert) from the body
    cut = len(blocks)
    for i, b in enumerate(blocks):
        if b.get('text', '').strip().lower() in ('knowledge pool', 'ask the expert'):
            cut = min(cut, i)
    return {
        'slug': pslug(p['path']),
        'path': p['path'],
        'title': p['title'],
        'blocks': blocks[:cut],
        'tail': blocks[cut:],
    }


data = {
    'partners': partners(),
    'aboutTeam': partners('about-grandmark-our-partners'),
    'profiles': profiles(),
    'offices': offices(),
    'pages': {s: page_entry(s) for s in content},
}
json.dump(data, open('entities.json', 'w'), indent=1)
print('partners      :', len(data['partners']))
print('profiles      :', len(data['profiles']))
print('offices       :', len(data['offices']))
print()
for p in data['partners']:
    print('  %-32s %-16s %-24s %s' % (p['name'][:32], p['designation'][:16], p['qualifications'][:24], p['email']))
print()
for o in data['offices']:
    print('  %-18s %-24s %s' % (o['city'][:18], o['contact'][:24], o['phone'][:28]))
