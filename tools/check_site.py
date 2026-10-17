#!/usr/bin/env python3
"""Check the static site's internal references using only Python's standard library."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
errors = []


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.urls = []
        self.idrefs = []
        self.headings = 0
        self.language = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for name in ("href", "src"):
            if attrs.get(name):
                self.urls.append(attrs[name])
        for name in ("aria-labelledby", "aria-describedby", "aria-controls"):
            self.idrefs.extend(attrs.get(name, "").split())
        if tag == "img" and not attrs.get("alt"):
            errors.append("An image is missing descriptive alt text")
        if tag == "h1":
            self.headings += 1
        if tag == "html":
            self.language = attrs.get("lang")


def counterpart(filename):
    """The other language's edition of a page: index.html <-> zh.html, song.html <-> zh-song.html."""
    if filename == "index.html":
        return "zh.html"
    if filename == "zh.html":
        return "index.html"
    return filename[3:] if filename.startswith("zh-") else "zh-" + filename


pages = {}
for source in sorted(ROOT.glob("*.html")):
    filename = source.name
    language = "zh-CN" if filename.startswith("zh") else "en"
    if not (ROOT / counterpart(filename)).is_file():
        errors.append(f"{filename}: missing other-language edition {counterpart(filename)}")
    page = Page()
    page.feed(source.read_text(encoding="utf-8"))
    pages[source] = page
    if page.language != language:
        errors.append(f"{filename}: expected language {language}, found {page.language}")
    for key, count in Counter(page.ids).items():
        if count > 1:
            errors.append(f"{filename}: duplicate id: {key}")
    if page.headings != 1:
        errors.append(f"{filename}: expected one main heading, found {page.headings}")
    for key in page.idrefs:
        if key not in page.ids:
            errors.append(f"{filename}: missing accessibility target: {key}")


def check_url(url, source):
    parts = urlsplit(url)
    if parts.scheme or parts.netloc:
        return
    if parts.path.startswith("/"):
        errors.append(f"Root-relative path will not survive a Pages subfolder: {url}")
        return
    target = (source.parent / unquote(parts.path)).resolve() if parts.path else source
    if not target.is_relative_to(ROOT):
        errors.append(f"Local reference escapes the site folder: {url}")
    elif not target.exists():
        errors.append(f"Missing local file: {url}")
    elif parts.fragment and target in pages and unquote(parts.fragment) not in pages[target].ids:
        errors.append(f"Missing anchor: {url}")


for source, page in pages.items():
    for url in page.urls:
        check_url(url, source)
css = (ROOT / "styles.css").read_text(encoding="utf-8")
for url in re.findall(r"url\(['\"]?([^)'\"]+)", css):
    check_url(url, ROOT / "styles.css")

if not (ROOT / ".nojekyll").is_file():
    errors.append("Missing .nojekyll marker")
if errors:
    print("Site checks failed:\n" + "\n".join(f"- {error}" for error in errors))
    sys.exit(1)
print(f"PASS: {len(pages)} pages in two language editions, {sum(len(page.urls) for page in pages.values())} HTML references, CSS assets, accessibility targets, and Pages-relative paths.")
