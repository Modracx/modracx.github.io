# MODRACX Blog Editorial & Technical Guidelines

This document defines the editorial voice, structural requirements, technical metadata specifications, and code snippet standards for authoring blog posts on **MODRACX** (`modracx.com`). All future AI agents and human contributors must strictly follow these guidelines.

---

## 1. Editorial Voice & Tone

### Core Tone
* **Author Persona:** Written by **Kenneth D'Silva**, an experienced Ecommerce & Systems Developer.
* **Style:** Direct, authoritative, highly technical, analytical, and practical.
* **Atmospheric vs. Plain-Spoken:**
  * Mystical/atmospheric branding vocabulary (*Grimoire*, *Rune*, *Orrery*, *Spine*, *Threshold*, *Cosmos*) belongs strictly in site UI elements, section subtitles, and decorative metadata framing.
  * The actual body copy, engineering advice, and business logic must remain 100% plain-spoken, practical, and grounded in empirical reality.
* **First-Person Narrative Grounding:**
  * Articles must be grounded in real-world scenario framing (e.g., *"In February a lighting retailer I work with had their Meta ad account suspended..."* or *"When auditing a 450,000-SKU Magento cluster..."*).
  * Use specific, plausible figures (margins, conversion rates, server specs, latency reductions, hit ratios) rather than vague generalizations.
* **Honest Engineering Trade-offs:**
  * Never present a technology or tactic as a silver bullet.
  * Always include a dedicated section detailing **when NOT to use** the approach or **where the trade-offs fail**.

---

## 2. Target Categories

Posts must be assigned to one of the canonical categories defined across the platform:
1. `SEO & Marketing`
2. `Security & Compliance`
3. `UX & Design`
4. `Performance & Speed`
5. `Architecture & Cloud`

---

## 3. Structural & HTML Requirements

Every post is deployed as a static HTML page located at `/blog/<slug>/index.html` and cataloged in `/blog/posts.json`.

### HTML Layout Skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google Consent Mode v2 Default -->
  <!-- Google Tag Manager / gtag.js -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#07071a" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  
  <!-- Google Fonts: Cormorant Garamond, Space Grotesk, DM Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600&display=swap" media="print" onload="this.media='all'" />
  
  <!-- Early Theme Application Script -->
  <script>(function(){try{var t=localStorage.getItem('modracx_theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  <link rel="stylesheet" href="/style.min.css?v=20260807-atlas2" />

  <!-- Metadata Tags (See Section 4) -->
  <title><TITLE> | MODRACX</title>
  <meta name="description" content="<DESCRIPTION>" />
  <!-- OpenGraph & Twitter Cards -->
  <!-- Schema.org JSON-LD (TechArticle, BreadcrumbList, FAQPage) -->
</head>
<body data-page="blog">
  <a class="skip-link" href="#realm">Skip to content</a>

  <!-- Ambient Cosmos Background Structure -->
  <div class="cosmos" aria-hidden="true">...</div>
  <canvas id="particles" aria-hidden="true"></canvas>
  <div class="grain" aria-hidden="true"></div>
  <div class="vignette" aria-hidden="true"></div>
  <div class="wisp" aria-hidden="true"></div>

  <!-- Sky Header & Navigation -->
  <header class="sky-header">...</header>

  <!-- Main Article Body -->
  <main id="realm" class="realm">
    <section class="container threshold">
      <div class="threshold-copy reveal">
        <p class="rune"><a href="/blog/">← Archive &amp; Insights</a></p>
        <h1><POST TITLE></h1>
        <p class="lede"><COMPELLING LEDE SENTENCE></p>
        <div class="blog-meta-info">
          <span>By <strong>Kenneth D'Silva</strong></span> •
          <span>Reading Time: <X> min read</span> •
          <span>Category: <a href="/blog/?category=<ENCODED_CAT>"><CATEGORY></a></span>
        </div>
      </div>
      <!-- Decorative Orrery Canvas/SVG -->
      <div class="orrery reveal" aria-hidden="true">...</div>
    </section>

    <!-- Animated Spine Decorator -->
    <div data-spine>...</div>

    <section class="chapter container">
      <article class="blog-post reveal">
        <!-- Numbered Section Headings (H2s, H3s, Paragraphs, Code Blocks, Tables) -->
      </article>
    </section>
  </main>

  <!-- Standard Footer -->
</body>
</html>
```

### Article Section Structure
* Main sections MUST use numbered `<h2>` headings (e.g. `<h2>1. The Month The Ad Account Went Dark</h2>`).
* Body paragraphs should remain digestible (3-6 lines).
* Include visual breaks:
  * **Data Tables:** HTML tables with `class="data-table"` comparing metrics, inputs vs. outputs, or benchmarks.
  * **Executable Code Snippets:** Self-contained Python, JavaScript, Bash, or PHP snippets that model the concept mathematically or functionally.

---

## 4. Metadata & SEO Requirements

### Page Metadata
1. **Title:** `<Post Title> | MODRACX` (under 65 characters preferred).
2. **Description:** Clear, high-density summary (140-160 characters).
3. **Canonical URL:** `https://modracx.com/blog/<slug>/` (with trailing slash).
4. **Hreflang Tags:** `en` and `x-default` pointing to the canonical URL.
5. **OpenGraph & Twitter Cards:** Full metadata including `og:image` and `twitter:image` set to `https://modracx.com/og-image.png`.

### Structured Data (JSON-LD `@graph`)
Every article must include a `<script type="application/ld+json">` block containing:
1. `TechArticle`:
   * `@id`: `https://modracx.com/blog/<slug>/#article`
   * `headline`, `description`, `url`, `datePublished`, `dateModified`, `timeRequired`
   * Author entity pointing to Kenneth D'Silva (`https://modracx.com/about/`)
   * Publisher entity pointing to MODRACX
2. `BreadcrumbList`:
   * Home (`/`) -> Blog (`/blog/`) -> Article (`/blog/<slug>/`)
3. `FAQPage`:
   * Include 2-4 technical Q&As addressing common edge cases covered in the article.

---

## 5. Code & Benchmark Specifications

* **Language Preference:** Python for mathematical models/calculations; Node.js/JS for frontend/PWA/Core Web Vitals; Bash/PHP/SQL for infrastructure, Magento, and server configurations.
* **Production-Grade Quality:** Code blocks must be well-commented, complete, and syntactically valid (no incomplete pseudocode placeholders like `// do work here`).
* **Standalone Execution:** Scripts should be runnable as standalone tools (e.g., including shebang line `#!/usr/bin/env python3` and runnable main execution block).

---

## 6. Blog Catalog Entry (`/blog/posts.json`)

When creating a new blog post, an entry **must** be appended to `/blog/posts.json` using the following schema:

```json
{
  "id": <NEXT_INCREMENTAL_INTEGER_ID>,
  "title": "<Full Article Title>",
  "url": "/blog/<slug>/",
  "category": "<Canonical Category>",
  "excerpt": "<1-2 sentence compelling technical summary>"
}
```

---

## 7. Quality Checklist for New Blog Posts

Before finalizing a blog post:
- [ ] HTML file placed at `/blog/<slug>/index.html`.
- [ ] `posts.json` updated with new post metadata.
- [ ] Atmospheric labels (*Rune*, *Orrery*, etc.) present in section wrappers, plain-spoken technical tone used in body copy.
- [ ] Author set to `Kenneth D'Silva`.
- [ ] Sections structured with numbered `<h2>` headings.
- [ ] Included at least 1 runnable code snippet or mathematical model script.
- [ ] Included at least 1 `data-table` for comparisons or benchmarks.
- [ ] Full `@graph` JSON-LD schema (TechArticle, BreadcrumbList, FAQPage) included in `<head>`.
- [ ] Contrast audit verified (passes 5:1 text contrast on dark and light themes).
