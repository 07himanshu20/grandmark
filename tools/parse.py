"""Parse rendered Grandmark pages into structured, VERBATIM content blocks."""
import json, re, html as H, os, glob

SITE = 'https://www.grandmarkca.com'

# Characters the old theme used as visible list bullets, authored straight
# into the copy. A marker is presentation, not content, so these are split out
# once here and never reach a renderer.
BULLET_SPLIT = re.compile(
    '[\u21d2\u2192\u2022\u25ba\u2023\u25aa\u25cf\u00bb\u203a\u2043\u25b6\u2794]\\s*')


def slug_of(url):
    return url.replace('https://www.grandmarkca.com/', '').replace('https://grandmarkca.com/', '').strip('/').replace('/', '__') or 'home'


def grab_content(doc):
    """Return the inner HTML of the main .post_content container."""
    m = re.search(r"<div class='post_content'>", doc)
    if not m:
        m = re.search(r'<div class="post_content"[^>]*>', doc)
    if not m:
        return ''
    start = m.end()
    # walk divs to find the matching close
    depth = 1
    i = start
    tag = re.compile(r'<(/?)div\b[^>]*>', re.I)
    while depth > 0:
        mm = tag.search(doc, i)
        if not mm:
            break
        depth += -1 if mm.group(1) else 1
        i = mm.end()
    return doc[start:i]


def txt(s):
    s = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', s, flags=re.S | re.I)
    s = re.sub(r'<br\s*/?>', ' ', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    s = H.unescape(s).replace('\xa0', ' ')
    return re.sub(r'\s+', ' ', s).strip()


NOISE = re.compile(
    r'^(know more\.*|read more\.*|learn more|view full profile|meet out team|meet our team|'
    r'previous|next|submit|send|search|\d+|)$', re.I)


def parse(docpath):
    doc = open(docpath, encoding='utf-8', errors='ignore').read()
    body = grab_content(doc)
    if not body:
        return None

    blocks = []
    # Tokenise headings, paragraphs, list items and images in document order.
    # The theme renders most bullet lists as styled <div class="boc_list_item_text">
    # rather than <li>, so those count as list items too.
    pat = re.compile(
        r'<h([1-6])[^>]*>(.*?)</h\1>'                              # 1,2 heading
        r'|<li[^>]*>(.*?)</li>'                                     # 3 list item
        r'|<div class="boc_list_item_text[^"]*">(.*?)</div>'        # 4 themed item
        r'|<p[^>]*>(.*?)</p>'                                       # 5 paragraph
        r'|<img[^>]+src="([^"]+)"[^>]*>',                           # 6 image
        re.S | re.I)

    def emit(kind, chunk):
        """One source element often holds several logical lines.

        Two quirks of the old theme are normalised here, once, for every
        page: list wrappers contain unbalanced <p> tags, so lines are broken
        on paragraph boundaries as well as <br>; and list markers authored as
        literal glyphs are stripped and promoted to real list items, so the
        rebuild renders a semantic list instead of doubling up markers.
        """
        for part in re.split(r'<br\s*/?>|</p>|<p[^>]*>', chunk, flags=re.I):
            t = txt(part)
            if not t:
                continue
            # a marker glyph anywhere in the line starts a new list item
            pieces = BULLET_SPLIT.split(t)
            lead = pieces[0].strip()
            if lead and not NOISE.match(lead):
                blocks.append({'type': kind, 'text': lead})
            for item in pieces[1:]:
                item = item.strip()
                if item and not NOISE.match(item):
                    blocks.append({'type': 'li', 'text': item})

    for m in pat.finditer(body):
        if m.group(1):
            emit('h%s' % m.group(1), m.group(2))
        elif m.group(3) is not None:
            emit('li', m.group(3))
        elif m.group(4) is not None:
            emit('li', m.group(4))
        elif m.group(5) is not None:
            emit('p', m.group(5))
        elif m.group(6):
            src = m.group(6)
            if 'data:image' not in src:
                blocks.append({'type': 'img', 'src': src})

    # collapse consecutive li into ul
    out = []
    for b in blocks:
        if b['type'] == 'li':
            if out and out[-1]['type'] == 'ul':
                if b['text'] not in out[-1]['items']:
                    out[-1]['items'].append(b['text'])
            else:
                out.append({'type': 'ul', 'items': [b['text']]})
        else:
            out.append(b)

    # de-duplicate immediately repeated text blocks (theme renders some twice)
    dedup = []
    for b in out:
        if dedup and b.get('text') and dedup[-1].get('text') == b.get('text'):
            continue
        dedup.append(b)
    return dedup


pages = json.load(open('pages-full.json'))
result = {}
for p in pages:
    s = slug_of(p['link'])
    f = 'html/%s.html' % s
    if not os.path.exists(f):
        continue
    blocks = parse(f)
    result[s] = {
        'id': p['id'],
        'title': H.unescape(p['title']['rendered']),
        'url': p['link'],
        'path': p['link'].replace(SITE, '') or '/',
        'blocks': blocks or [],
    }

json.dump(result, open('content.json', 'w'), indent=1)
print('parsed %d pages' % len(result))
for k, v in sorted(result.items(), key=lambda x: -len(x[1]['blocks']))[:12]:
    print('%-58s %3d blocks  %s' % (k[:58], len(v['blocks']), v['title'][:30]))
