# Concretum Operis Ready Mix (Nuevo Sitio)

Static marketing site (HTML + CSS) for the ready-mix concrete delivery division
of Concretum Operis, Richmond, CA. Bold contractor style (dark photo heroes,
amber accent, Oswald headings), modelled on the layout of
lionconcretereadymixllc.com.

## Structure

```
public/
  index.html       Home (hero, services, feature, call band, gallery, areas, testimonials, CTA)
  about.html       About
  services.html    Services + coverage
  contact.html     Quote request form + contact details
  styles.css       Global styles (light + dark)
  assets/          Logos + gallery photos (from Desktop/galeria)
```

## Local development

```bash
npx serve public -l 5055
```

Then open http://localhost:5055

## Before launch

- Connect the contact form (Formspree / Netlify Forms / custom endpoint) and the
  "Request Received" success message.
- Oswald loads from Google Fonts; site still works offline with a system fallback.
- Gallery PNGs are large (2–3 MB each) — compress/convert to WebP before deploy.
- Confirm phone `(415) 729-6060`, email, hours and license `#1062721`.

## Deployment

Pending (GitHub Pages or Netlify). Publishable content lives in `public/`.
