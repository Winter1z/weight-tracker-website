# Weight Arc — website

The public website for **Weight Arc**, an iOS weight-tracking app. It exists to
fill the four App Store Connect URL fields:

| App Store Connect field | URL |
| --- | --- |
| Marketing URL | `https://winter1z.github.io/weight-tracker-website/marketing/` |
| Support URL | `https://winter1z.github.io/weight-tracker-website/support/` |
| Privacy Policy URL | `https://winter1z.github.io/weight-tracker-website/privacy/` |
| Terms of Use (EULA) URL | `https://winter1z.github.io/weight-tracker-website/terms/` |

It is a plain static site: hand-written HTML and CSS, one small optional
JavaScript file, no framework, no build step, no dependencies, no analytics, no
trackers and no cookies.

## Routes

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `index.html` | Landing page |
| `/marketing/` | `marketing/index.html` | Product overview — the App Store **Marketing URL** |
| `/support/` | `support/index.html` | Support page and FAQ |
| `/privacy/` | `privacy/index.html` | Privacy Policy |
| `/terms/` | `terms/index.html` | Terms of Use |
| — | `404.html` | Custom not-found page |

## Repository layout

```
index.html               Landing page
marketing/index.html     Product overview (App Store Marketing URL)
support/index.html       Support page
privacy/index.html       Privacy Policy
terms/index.html         Terms of Use
404.html                 Custom 404 (uses absolute paths — see note below)
site.config.json         Editable public values, in one place
sitemap.xml              Search-engine sitemap
.nojekyll                Tells GitHub Pages to serve files as-is
assets/css/styles.css    The entire design system
assets/js/site.js        Theme toggle only — the site works without it
assets/images/           Favicons, Apple touch icon, Open Graph image
```

## GitHub Pages settings

In the repository, go to **Settings → Pages** and select:

- **Source:** `Deploy from a branch`
- **Branch:** `main`
- **Folder:** `/ (root)`

Then press **Save**. No build process, workflow or action is required — the
files are served exactly as they are committed. `.nojekyll` is present so that
GitHub Pages does not run Jekyll over the repository.

The first deployment usually appears within a minute or two.

### Why `404.html` looks different

Every page uses **relative** paths (`assets/css/styles.css`, `../support/`) so
the site works from the `/weight-tracker-website/` subpath without hardcoding
it.

`404.html` is the one exception and deliberately uses absolute paths that
include the subpath (`/weight-tracker-website/assets/css/styles.css`). GitHub
Pages serves that single file for *any* missing URL, including deep ones like
`/weight-tracker-website/a/b/c/`, so relative paths would resolve differently
every time and break the stylesheet.

**If you rename the repository, update the `/weight-tracker-website/` prefix in
`404.html`,** plus the canonical and Open Graph URLs listed below.

## Previewing locally

Open `index.html` directly in a browser and it will mostly work, but the pretty
URLs (`support/`, `privacy/`, `terms/`) resolve properly only over HTTP. To
match production, serve the folder with any static server you already have —
for example, with Node installed:

```bash
npx --yes serve .
# or
npx --yes http-server . -p 8080
```

Then visit `http://localhost:3000/` (or whichever port is printed).

Nothing here is a project dependency; there is no `package.json` on purpose.

## Public configuration

All editable public values live in **`site.config.json`**.

Because this is a static site with no build step, that file is a *reference
list* rather than something the pages read at runtime — legal text must never
depend on JavaScript to render. Every place a configurable value appears in the
HTML is marked with an HTML comment containing the word `CONFIG`, so you can
find them all by searching the repository for:

```
CONFIG
```

Current values:

| Key | Value |
| --- | --- |
| App name | Weight Arc |
| App Store title | Weight Arc: Weight Tracker |
| Developer | Nikolas |
| Support email | valdivian313@outlook.com |
| Copyright year | 2026 |
| Base URL | `https://winter1z.github.io/weight-tracker-website/` |
| App Store URL | *none yet* |
| Privacy / Terms date | June 12, 2026 |

### Updating the support email

1. Change `supportEmail` in `site.config.json`.
2. Search the repository for the current address and replace every occurrence.
   It appears in `index.html`, `support/index.html`, `privacy/index.html` and
   `terms/index.html`, in both the visible link text and the `mailto:` href.

Keep the `?subject=Weight%20Arc%20Support%20Request` part of the `mailto:` links
so incoming mail stays easy to identify.

### Adding the App Store link later

The app has no public App Store listing yet, so the homepage shows a
non-clickable **“Coming soon on the App Store”** label rather than a fake link.

When the listing is live:

1. Set `appStoreUrl` in `site.config.json`.
2. Open `index.html` and find the comment `CONFIG: appStoreUrl`.
3. Replace the entire `<span class="store-badge">…</span>` block with:

   ```html
   <a class="button primary" href="https://apps.apple.com/app/idYOUR_APP_ID">Download on the App Store</a>
   ```

The `.store-badge` CSS rule can then be deleted from `assets/css/styles.css`.

### Replacing the screenshots

No app screenshots existed when this site was built, so the “Inside the app”
section renders labelled placeholder frames instead of broken images.

To publish real ones:

1. Take screenshots on an iPhone (or the iOS Simulator) and save them as PNG.
2. Put them in `assets/images/` using these names:
   - `home-screen.png` — the Weight tab
   - `insights-screen.png` — the Insights tab
   - `logbook-screen.png` — the Logbook tab
3. In `index.html`, find the comment block starting `SCREENSHOTS:` and replace
   each `<div class="shot">…</div>` with an image, keeping the real pixel
   dimensions so nothing is distorted:

   ```html
   <img class="shot-image" src="assets/images/home-screen.png"
        alt="The Weight tab showing the latest weigh-in and the trend graph."
        width="1179" height="2556" loading="lazy">
   ```

4. Delete the `<div class="note">` paragraph underneath that says screenshots
   have not been added yet.

Write a real description in each `alt` attribute — it is what screen-reader
users get instead of the image.

### Changing the canonical / Open Graph URLs

If the repository or account name changes, update the absolute URLs in the
`<head>` of all five HTML pages (`<link rel="canonical">`, `og:url`, `og:image`
and `twitter:image`), plus `sitemap.xml` and the paths in `404.html`.

## Design

Colours, radii and spacing are taken from the app's own theme so the site reads
as the same product:

- Dark: background `#0a0c0b`, surface `#121613`, accent `#5fd68a` (mint)
- Light: background `#ffffff`, surface `#f6f1e7` (sand), accent `#3f6b54` (pine)

The site follows the visitor's system light/dark preference and adds a manual
toggle in the header. The toggle is the only thing `assets/js/site.js` does; it
stores the choice in `localStorage` on the visitor's own device and is hidden
entirely when JavaScript is unavailable, so no dead control is ever shown.

Accessibility: skip-to-content link, semantic landmarks and heading order,
visible keyboard focus rings, `prefers-reduced-motion` support, and navigation
that needs no JavaScript.

## Reference project

The content was written by inspecting the app project at:

```
c:\Users\nikol\OneDrive\Skrivebord\Weight tracker
```

**That folder is reference material only and must stay read-only.** Nothing in
it was modified, committed or pushed while this site was built, and no source
code, environment file, API key, Supabase credential or Apple credential from it
has been copied into this public repository.

The privacy and terms wording is carried over from the legal pages the app
already publishes (its `legal` Supabase edge function), with only the product
name updated. Both pages carry a visible review note listing the points that
still need a decision before the App Store submission — remove those notes once
they are settled.

## Licence

Content and branding © 2026 Nikolas. All rights reserved.
