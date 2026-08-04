# -*- coding: utf-8 -*-
"""The official Saudi Riyal mark, traced from the artwork Majid supplied.
Two uprights whose feet sweep left, two bars crossing them, and a detached
lower bar. Drawn as outlines so it needs no font support, and applied through
one .rs class that masks currentColor, so it always takes the colour of the
figure it sits with."""
from urllib.parse import quote

W, H = 424, 471

def _bar(x0, y0, x1, y1, t):
    """a slanted bar from (x0,y0) to (x1,y1), thickness t, measured vertically"""
    return "M%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f Z" % (x0, y0, x1, y1, x1, y1 + t, x0, y0 + t)

PARTS = [
    # two uprights, each entering with a curved top-left like a pen stroke.
    # the left one runs on past the lower band; that overhang is the foot.
    "M150 54 C150 27 169 8 199 1 L210 0 L210 398 L150 410 Z",
    "M247 94 C247 67 266 48 296 41 L307 40 L307 366 L247 378 Z",
    # upper band, crossing both uprights, rising to the right
    _bar(14, 246, 414, 174, 54),
    # lower band, full width; its left end is the foot sweeping out
    _bar(8, 378, 414, 278, 54),
    # the detached bar below it, right side only
    _bar(250, 414, 418, 374, 52),
]

def svg():
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d">%s</svg>'
            % (W, H, ''.join('<path d="%s"/>' % p for p in PARTS)))

def css_token():
    u = quote(svg(), safe='')
    return (".rs{display:inline-block;width:.66em;height:.74em;background:currentColor;"
            "vertical-align:-.02em;margin-inline-end:.17em;flex:none;"
            "-webkit-mask:url(\"data:image/svg+xml,%s\") center/contain no-repeat;"
            "mask:url(\"data:image/svg+xml,%s\") center/contain no-repeat}" % (u, u))

if __name__ == '__main__':
    open('riyal_preview.html','w').write(
      '<html><head><style>body{margin:0;background:#fff;font-family:system-ui}%s</style></head><body>'
      '<div style="display:flex;align-items:flex-end;gap:46px;padding:40px">'
      '<div style="width:190px;color:#231F20">%s</div>'
      '<div style="font:700 58px/1 system-ui;color:#081631"><span class="rs"></span>546,798</div>'
      '<div style="font:700 26px/1 system-ui;color:#0b8f92"><span class="rs"></span>1,486</div>'
      '<div style="font:600 15px/1.4 system-ui;color:#42536B"><span class="rs"></span>9,685,235.81</div>'
      '</div></body></html>' % (css_token(), svg()))
    print('preview written')
