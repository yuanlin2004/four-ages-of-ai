# The Four Ages of AI

**How Humanity Lost—and Rediscovered—Itself**

A complete English and Simplified Chinese editorial website about authenticity, agency, purpose, and human reinvention. This is a standalone GitHub Pages-ready edition based on `OUR_PERSPECTIVE.md`, `ATTACK_PLAN.md`, and the supplied original poster.

## Run locally

Open `index.html` in a browser. The pages, images, fonts, chapter navigation, and poster viewer are bundled; no installation or build is required.

For an HTTP preview, open a terminal in this folder and run:

```sh
python3 -m http.server 8000
```

Visit <http://localhost:8000>. Stop the server with Ctrl+C.

## Publish on GitHub Pages

1. Use the repository [yuanlin2004/four-ages-of-ai](https://github.com/yuanlin2004/four-ages-of-ai).
2. Add the **contents of this folder** to the repository's `main` branch. `index.html` must be at the repository root, beside `styles.css`, `script.js`, `.nojekyll`, and `assets/`. Upload the unzipped files, not the ZIP itself or its enclosing folder. Keep the nested fonts folder intact.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**. Select **main** and **/ (root)**, then **Save**.
5. After GitHub finishes publishing, use **Visit site** in Pages settings. The site address is <https://yuanlin2004.github.io/four-ages-of-ai/>.

All local assets use relative paths, so the site works at a domain root or under a repository subfolder. `.nojekyll` disables unnecessary Jekyll processing. GitHub handles deployment from the selected branch. The included checks workflow validates local references and JavaScript syntax on pushes and pull requests.

Official instructions: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

Every page has its own canonical URL and sharing metadata. The English home page is <https://yuanlin2004.github.io/four-ages-of-ai/> and the Chinese home page is <https://yuanlin2004.github.io/four-ages-of-ai/zh.html>. Alternate-language metadata connects each page with its counterpart. If you move the site to another repository or domain, update these URLs in every HTML file.

## What is included

```text
index.html                 English home: poster, the four ages, the premise
mirror.html                Age one: The Mirror
surrender.html             Age two: The Surrender
irrelevance.html           Age three: The Irrelevance
becoming.html              Age four: The Becoming, followed by the afterword
song.html                  The song, told from the machine's side
perspective.html           Comparison with RooAGI's four stages
notes.html                 The eight research notes
zh.html, zh-*.html         Simplified Chinese edition of each page above
styles.css                 Responsive design and print styles
script.js                  Reading progress, poster zoom, and print
.nojekyll                  GitHub Pages static-site marker
assets/
  four-ages-poster.png      Original English poster, 1536 × 1024 pixels
  four-ages-poster-zh.png   Original Chinese poster, 1536 × 1024 pixels
  favicon.svg              Small browser icon
  fonts/                   Local fonts and their OFL licenses
tools/check_site.py        Dependency-free link and asset check
README.md                  These instructions
THIRD_PARTY.md             Font attribution and asset provenance
```

## Editing

Each English page has a Chinese counterpart with a `zh-` prefix (`index.html` pairs with `zh.html`). Edit both when changing content. The masthead, footer, and page-turn links are repeated on every page, so a change to them goes into all sixteen files. Shared styles and interactions live in `styles.css` and `script.js`. Keep corresponding IDs the same in both languages so the language switch keeps the reader's place. Links from the earlier single-page edition, such as `index.html#surrender` or `zh.html#note-work`, are redirected to the matching page by a small script at the top of `index.html` and `zh.html`. The eight expandable research notes distinguish technical foundations, empirical findings, and interpretation. All four opening scenes are explicitly fictional, and the dates in the artwork are treated as scenario labels. Each chapter also has a dark “Through the Black Mirror” panel (`.screen-note`) that pairs the age with episodes of the series; note 07 marks them as fiction used for thought experiments.

Change the paper, ink, and four chapter colors in the `:root` variables at the top of `styles.css`. The layout adapts to small screens; the chapter strip stays available while reading. The poster is never cropped, and its viewer supports keyboard dismissal, zoom, a full-resolution link, and a direct download.

The complete essay and links remain usable without JavaScript. JavaScript adds reading progress, in-page enlargement, and the print control. “Print this page” uses the browser's print dialog, with an option to save as PDF; research notes open automatically for printing.

There are no analytics, cookies, accounts, external runtime scripts, or font-service requests. Research links open external source pages only when followed. The song video loads from YouTube only when someone presses play.

## Language switching and posters

The English/中文 controls in the header and footer link each page to its counterpart in the other edition. With JavaScript enabled, switching also keeps an open research note or section anchor. Every page stays readable and switchable without JavaScript. Poster controls use the page language.

Each edition uses its own supplied original poster. The English page uses `assets/four-ages-poster.png`; the Chinese page uses `assets/four-ages-poster-zh.png`. Each page points its display, zoom viewer, downloads, and sharing image metadata to the corresponding asset. Both images retain their original resolution and aspect ratio.

English display fonts are bundled; Chinese text uses available system serif and sans-serif fonts, with no runtime font download.

## Check changes

From this folder:

```sh
python3 tools/check_site.py
node --check script.js
```

The first command checks local links, fragment targets, image descriptions, font/image files, and duplicate IDs. The second checks JavaScript syntax if Node.js is installed. Neither command is required to run the site.

When changing the design, also inspect a desktop and a phone-sized browser window, open and close the poster, and follow chapter and citation links. The original poster's SHA-256 is `3a525158915693c3ee29962256e50771a203689242f80f069d4cd188ac140292`.

Repository: <https://github.com/yuanlin2004/four-ages-of-ai>

GitHub Pages address: <https://yuanlin2004.github.io/four-ages-of-ai/>
