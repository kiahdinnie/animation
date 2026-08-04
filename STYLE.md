# Playing with the look & feel

Everything here is a small, safe change. After any edit: save, re-upload the file,
and hard-refresh the site (⌘⇧R) to see it.

---

## 1. Light or dark — one word

In **`content.js`**:

```js
theme: "light",   // change to "dark"
```

That flips the whole site — background, text, name, panels — instantly.

---

## 2. The first panel (the name screen) — swap it for anything

Also in **`content.js`**, the `hero` block decides what sits behind the name:

```js
hero: {
  background: "gradient",       // "gradient" | "image" | "video"
  image: "assets/hero.jpg",     // your own picture (drop it in the assets folder)
  video: "",                    // a Vimeo link — plays muted & looping behind the name
  dim: 0.4                      // 0–1, fades the image/video so the name stays readable
}
```

- **`"gradient"`** → the colourful mesh (the default).
- **`"image"`** → set `background: "image"` and put a file at `assets/hero.jpg`
  (e.g. one of Kiah's stills or artworks).
- **`"video"`** → set `background: "video"` and paste a Vimeo link into `video`
  (e.g. a showreel loop). Turn `dim` up if the name is hard to read.

---

## 3. Colours — change the whole palette

In **`css/styles.css`**, right at the top, is a block called **THEME TOKENS**.
Change a value, and everything using it updates. The ones worth trying:

| Token | Controls | Try |
|-------|----------|-----|
| `--accent` | buttons, arrow, links, highlights | `#7c5cff` (purple), `#0aa` (teal) |
| `--name-1` / `--name-2` | the big name's top/bottom colour | any two shades |
| `--page-mesh` | the colourful background blobs | edit the colours or move the `at x% y%` positions |

There are two blocks: the first (`:root`) is the **light** palette, the second
(`:root[data-theme="dark"]`) is the **dark** one. Edit whichever theme you're using.

**Make it calmer/bolder:** in `--page-mesh`, the `.45` / `.42` numbers are how
strong each colour is (0 = invisible, 1 = full). Lower them for subtle, raise for punchy.

---

## 4. The font

The site uses **Space Grotesk**. To try another:
1. Pick one at [fonts.google.com](https://fonts.google.com).
2. In each `.html` file, swap the `<link ... fonts.googleapis.com ...>` line for the new font's link.
3. In `css/styles.css`, change `--font:` to the new name.

---

## Not sure what a change will look like?

Ask me — tell me the vibe ("warmer", "more minimal", "match this poster") and I'll
set it up and show you before it goes live.
