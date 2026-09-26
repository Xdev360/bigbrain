# xbigbrainnx.xyz/web3

Static site. No build step. Same stack as the main portfolio (HTML, CSS, vanilla JS, Vercel).

## Deploy
Served from the main portfolio project at `/web3/` — no separate Vercel project. Every push deploys it.

## Files
- `index.html` home · `about.html` · `contact.html`
- `work/` the three case studies
- `css/styles.css` site theme · `css/screens.css` product mock screens
- `js/motion.js` all motion (GSAP + ScrollTrigger) · `js/screens.js` interactive demos
- Type: Geist + Geist Mono via Google Fonts (no local font files)

## Contact form
The form posts to the main site's `/api/inquiry` (root `api/inquiry.js`), which relays to Telegram with the main project's env vars.

## Fill these before going live (search for `class="ph"`)
- Timelines and dates on all three case pages
- Trading platform: users sentence, decision 03, admin detail, all three outcome numbers, "what I'd change"
- Corridor: KYC screen
- About: years, earlier role
- Contact: Telegram, booking link
- Top bar: LinkedIn URL (the button is `hidden` in all three pages until you add it)
- Home: the testimonial
- `assets/Oladele-Ibraheem-CV.pdf` (one page) and `assets/portrait.jpg`, `assets/og.png` (1200×630), `assets/favicon.svg`

## Motion vocabulary
Put these on any element: `data-reveal`, `data-clip`, `data-stagger`, `data-split`, `data-parallax="0.15"`, `data-scrub`, `data-pin` (+ `data-pin-inner`), `data-magnet`, `data-shift`. Press/spring is CSS on `.btn`, `.seg button`, `.scr .b`. Everything is off when the visitor prefers reduced motion.

## Layout
Profile panel (fixed, left) + card feed (right), after kati.framer.website. `js/shell.js` runs the Lagos clock and the tabs: Case studies · Product · Websites · Graphics (`#product`, `#websites`, `#graphics`).
