# Your portfolio website

A fast, no-frills portfolio for animation / motion graphics / 3D work.
Plain HTML, CSS and JavaScript — **no build step, no dependencies.** Just files.

---

## 1. Make it yours (5 minutes)

**Everything you edit lives in one file: [`content.js`](content.js).**

Open it in any text editor and change:

- `name` — your name
- `tagline` — already set to *"Animation, motion graphics, modelling, rigging, rendering."*
- `email` and `socials` — your contact links (leave any social as `""` to hide it)
- `about` — your bio paragraphs and skills
- `videos` — your Vimeo links (see below)

Then add a photo of yourself at `assets/profile.jpg` for the About page.

### Adding a video

Copy the link from Vimeo and paste it in a new block:

```js
{
  url: "https://vimeo.com/76979871",
  title: "My Showreel",
  description: "One line about this piece.",
  orientation: "landscape"   // "landscape", "portrait" or "square"
}
```

- **Landscape** = wide showreels (16:9). **Portrait** = phone / Instagram-reel shape (9:16).
- Videos autoplay muted as you scroll (like Instagram). **Click one to watch it with sound.**
- **Private / unlisted videos:** the Vimeo link looks like `https://vimeo.com/76979871/abc123def`.
  Paste the *whole* thing — the code after the slash is what lets it play.
- In Vimeo, make sure each video's privacy allows embedding
  (*Settings → Privacy → "Where can this be embedded?" → Anywhere*).

---

## 2. Preview it on your computer

Double-click `index.html` — it opens in your browser. That's it.

---

## 3. Publish it free with GitHub Pages

**Yes, you need a (free) GitHub account.** Here's the whole process:

1. **Make an account** at <https://github.com/join> (free).
2. **Create a repository:** click the **+** (top-right) → **New repository**.
   - Name it `your-name.github.io` (use your real GitHub username) — this gives you the
     cleanest web address. *Or* name it anything, e.g. `portfolio`.
   - Set it to **Public**. Click **Create repository**.
3. **Upload your files:** on the repo page click **Add file → Upload files**.
   Drag in *everything inside this folder* (all the files and the `css`, `js`, `assets`
   folders). Scroll down and click **Commit changes**.
4. **Turn on Pages:** go to **Settings → Pages**.
   - Under *Build and deployment*, **Source = Deploy from a branch**.
   - **Branch = `main`**, **folder = `/ (root)`**. Click **Save**.
5. Wait ~1 minute, refresh the Pages screen, and your live link appears at the top:
   - If you named the repo `your-name.github.io` → `https://your-name.github.io`
   - Otherwise → `https://your-name.github.io/portfolio`

To update the site later, upload the changed file(s) the same way (step 3) — the live site
refreshes automatically within a minute.

> "GitHub Pages" is the free hosting feature — some people call it "GitHub docs." Same thing.

### Prefer the command line?

```bash
git init
git add .
git commit -m "My portfolio site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then do step 4 above to switch Pages on.

---

## 4. (Optional) Use your own domain

Bought a domain like `yourname.com`? In **Settings → Pages → Custom domain**, enter it and
follow the DNS instructions. Free HTTPS is included.

---

## File map

| File | What it's for |
|------|----------------|
| `content.js` | **The only file you edit** — your name, links and videos |
| `index.html` | Landing page + video feed |
| `about.html` | About page |
| `contact.html` | Contact page |
| `css/styles.css` | Look and feel |
| `js/main.js` | Builds the video feed, autoplay, click-to-watch |
| `assets/` | Your photo (`profile.jpg`) and the site icon |
