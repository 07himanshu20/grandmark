import json, re, html, os, sys

pages = json.load(open('pages-full.json'))
os.makedirs('text', exist_ok=True)

BLOCK = r'(?:p|div|section|h[1-6]|li|br|tr|td|th|article|header|footer|ul|ol|table)'

def clean(h):
    if not h: return ''
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', h, flags=re.S | re.I)
    # keep heading markers
    for i in range(1, 7):
        h = re.sub(r'<h%d[^>]*>' % i, '\n\n[H%d] ' % i, h, flags=re.I)
        h = re.sub(r'</h%d>' % i, '\n', h, flags=re.I)
    h = re.sub(r'<li[^>]*>', '\n  - ', h, flags=re.I)
    h = re.sub(r'<br\s*/?>', '\n', h, flags=re.I)
    h = re.sub(r'</(p|div|section|tr|ul|ol|table)>', '\n', h, flags=re.I)
    h = re.sub(r'<a [^>]*href="([^"]*)"[^>]*>(.*?)</a>', r'\2 {\1}', h, flags=re.S | re.I)
    h = re.sub(r'<img[^>]*src="([^"]*)"[^>]*>', r'\n[IMG \1]\n', h, flags=re.I)
    h = re.sub(r'<[^>]+>', ' ', h)
    h = html.unescape(h)
    # strip WPBakery / page-builder shortcodes (presentation only, not content)
    for _ in range(6):
        h = re.sub(r'\[/?(?:vc_|rev_slider|boc_|trx_|us_)[a-z_0-9]*(?:[^\[\]]|\[[^\]]*\])*?\]', '\n', h)
    h = re.sub(r'\[/?[a-z_0-9]+[^\]]{0,400}\]', '\n', h)
    h = h.replace(' ', ' ')
    h = re.sub(r'[ \t]+', ' ', h)
    h = re.sub(r' *\n *', '\n', h)
    h = re.sub(r'\n{3,}', '\n\n', h)
    return h.strip()

index = []
for p in pages:
    slug = p['link'].replace('https://www.grandmarkca.com/', '').strip('/').replace('/', '__') or 'home'
    title = html.unescape(p['title']['rendered'])
    body = clean(p['content']['rendered'])
    index.append((p['id'], p['link'], title, len(body)))
    with open('text/%s.txt' % slug, 'w') as f:
        f.write('=== %s ===\nURL: %s\nID: %s\n\n%s\n' % (title, p['link'], p['id'], body))

index.sort(key=lambda x: -x[3])
print('%-6s %-8s %s' % ('ID', 'CHARS', 'TITLE / URL'))
for i, l, t, n in index:
    print('%-6s %-8s %s  ->  %s' % (i, n, t, l.replace('https://www.grandmarkca.com', '')))
