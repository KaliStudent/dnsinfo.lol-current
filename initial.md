# Requirements
## Summary
DNSINFO.LOL is a retro-terminal-themed Network Intelligence Tool that lets users scan any domain for DNS records, zone health, subdomain enumeration, WHOIS data, SSL status, and DNS propagation. The app replicates the original HTML frontend's aesthetic (gold-on-black CRT style) and connects to a real backend API at `/api/scan/:domain`. It serves security researchers, DevOps engineers, and developers who need quick, comprehensive DNS intelligence about any domain.

## Use cases
- DNS Console (Main Scanner)
  1) User lands on the app and sees the retro "Network Intelligence Terminal" UI with a domain input and scan module toggles.
  2) User types a domain name into the TARGET DOMAIN input field.
  3) User toggles scan modules on/off: DNS Records, Zone Health, Subdomains, WHOIS, Propagation, SSL Check.
  4) User clicks QUERY or presses Enter to initiate the scan.
  5) The LCD terminal output animates with status messages and a progress meter fills.
  6) Results are rendered below in labelled sections: DNS Records table, Zone Health grade, Subdomain chips, WHOIS cards, Propagation node grid.
  7) If the backend API (`/api/scan/:domain`) is unavailable, the app falls back to querying Cloudflare DoH directly from the browser.

- Contact Form
  1) User clicks the CONTACT tab in the navigation.
  2) User fills in Sender Name, Email, Subject, and Message body.
  3) User clicks TRANSMIT to submit the message.
  4) UI shows a "SENT ✓" confirmation state.

- Terms of Service
  1) User clicks the TERMS tab.
  2) User reads the Terms of Service (Acceptable Use, Privacy, Rate Limiting, Disclaimer, Liability).

## Plan
### DNS Console (Main Scanner)
1. [x] Create the main app shell with retro-terminal styling: dark gold-on-black color palette (`--chassis`, `--gold`, `--amber`, `--lcd-on` CSS variables), Orbitron + Share Tech Mono + VT323 Google Fonts, max-width 900px centered chassis container, corner rivets, brushed-metal gradient background.
2. [x] Build the nameplate header row: "DNSINFO.LOL — NETWORK INTELLIGENCE TERMINAL" title with REV 1.0 badge, and a status LED row showing ONLINE / SCANNING / DNS / ZONE HEALTH / SUBDOMAINS / WHOIS / ERROR LED indicators that react to scan state.
3. [x] Implement a tab navigation bar with three tabs: DNS CONSOLE (active by default), CONTACT, TERMS — styled as retro panel tabs with gold active highlight.
4. [x] Build the TARGET DOMAIN panel (left column): monospace VT323 text input with `$` prefix, domain validation (no protocol, no paths), and a 2×3 grid of flat toggle switches for DNS Records, Zone Health, Subdomains, WHOIS, Propagation, SSL Check — each toggle has an LED indicator that glows gold when on and red when off. Add decorative DEPTH and TIMEOUT knobs below.
5. [x] Build the COMMAND TERMINAL panel (right column): large circular QUERY button (90px ring) with active/scanning animation (amber glow pulse), SCAN PROGRESS bar with percentage meter that animates during scanning, and a QUICK STATS mini-grid showing Domain, Records count, Subdomains count, Zone Grade after scan completes.
6. [x] Build the SYSTEM OUTPUT LCD panel (full width): terminal-style display with amber glow text, CRT scanline overlay, showing multi-line status messages during each scan phase. Wire up all LCD message states: idle, validating, querying, fallback mode, success, error.
7. [x] Implement the scan logic: call `/api/scan/:domain?subdomains=true&whois=true&propagation=true` (pass toggles as query params), handle HTTP errors; if API fails, fall back to Cloudflare DoH (`https://cloudflare-dns.com/dns-query`) for A, AAAA, MX, TXT, NS, CNAME, SOA record types. Animate the progress meter through stages (0→20→45→100%).
8. [x] Render DNS Records section: sortable table with TYPE badge (amber bordered), NAME, VALUE (truncated), TTL columns; max 60 records displayed.
9. [x] Render Zone Health section: large letter grade badge (A=green, B=gold, C=amber, D/F=red), score out of 100, issues count, and pass/fail check cards for individual health checks.
10. [x] Render Subdomain Enumeration section: summary cards (Found, SSL Secured, Resolving counts), scrollable chip list where each chip has a green/red SSL dot indicator.
11. [x] Render WHOIS section: card grid showing Registrar, Registered, Expires, Updated, Registrant, Status, Privacy, Country fields.
12. [x] Render DNS Propagation section: summary cards (propagated/total, consistency), and a flex-wrap grid of resolver nodes each with a green/red dot.
13. [x] Show a fallback notice banner at the bottom of results when running in browser-side DoH mode.

### Contact Form
1. [x] Build the CONTACT tab panel with retro input styling: SENDER DESIGNATION (text), RETURN ADDRESS (email), SUBJECT (text), MESSAGE BODY (textarea) fields with amber-glow focus states.
2. [x] Implement TRANSMIT button with loading → SENT ✓ → reset state animation.

### Terms of Service
1. [x] Build the TERMS tab panel with scrollable retro-styled TOS text body covering: Acceptable Use, Data & Privacy, Rate Limiting, Disclaimer, Limitation of Liability sections.
2. [x] Add footer bar below the chassis with copyright, TERMS and CONTACT links, and an expandable SHARE tray with social platform chips (X, Instagram, LinkedIn, TikTok, Reddit, Email).
