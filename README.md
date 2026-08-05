# Badrul & Sasha — Portfolio Site

A single-page portfolio with a futuristic HUD theme: dark void background, drifting grid, a soft scanline sweep, and cyan/violet glow accents. Built with plain HTML, CSS and JavaScript — no build step, no framework.

## Files

```
index.html     The whole site
style.css      All styling and design tokens
script.js      Mobile nav toggle and scroll reveal
```

## Opening it in Visual Studio / VS Code

1. Unzip/copy this folder anywhere on your machine.
2. In VS Code: **File → Open Folder…** and select the folder.
   In Visual Studio: **File → Open → Web Site…** and select the folder.
3. Install the **Live Server** extension (VS Code) if you don't have it, then right-click `index.html` → **Open with Live Server**. In Visual Studio, just press **Run**.
4. Edit and save — the browser refreshes automatically.

## Making it yours

- **Names & bio**: search `index.html` for "Badrul" and "Sasha" — the hero heading, role line, email addresses, and footer all reference them. Replace with your own names/details.
- **Colors**: everything is driven by the CSS variables at the top of `style.css` under `:root`. `--cyan` and `--violet` are the two accent colors; change them and the glows, gradients, and hover states all update together.
- **Grid / scanline effects**: controlled by `.grid-overlay` and `.scanline` in `style.css`. Delete either rule (or the matching `<div>` in `index.html`) to turn that effect off; both respect `prefers-reduced-motion`.
- **Projects**: each project is a `.card` block inside the `work-grid` in `index.html` — copy/paste the block to add more. Hovering a card reveals cyan corner brackets.

No dependencies to install — it's just static files.
