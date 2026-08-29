# Cartunez Design System

**Direction:** Precision Performance
**Style:** OLED dark mode + exaggerated minimalism
**Pattern:** Hero-centric automotive commerce
**Design dials:** Variance 7/10 | Motion 7/10 | Density 5/10

## Brand idea

Cartunez should feel engineered, cinematic and specific—not like a generic accessories marketplace. Use dramatic automotive scale, restrained technical details, close product imagery and a single cyan signal color. The experience should communicate exact fitment and human expertise before visual novelty.

## Color

| Role | Value | Usage |
|---|---:|---|
| Background | `#030405` | Primary OLED canvas |
| Raised | `#07090B` | Navigation and elevated regions |
| Surface | `#0B0E11` | Cards and controls |
| Foreground | `#F5F7F8` | Primary copy |
| Silver | `#C6CDD2` | Secondary copy |
| Muted | `#818A92` | Metadata only |
| Border | `rgba(255,255,255,.12)` | Precision dividers |
| Accent | `#31CFFF` | Primary actions and status signals |
| Accent hover | `#75E0FF` | Interactive hover |
| Destructive | `#E74856` | Errors and destructive actions only |

Rules:

- Cyan is a signal, not a background theme. Reserve it for calls to action, verified fitment and active states.
- Use gradients for depth and legibility, never as decorative rainbow effects.
- Maintain WCAG AA contrast for body copy and controls.

## Typography

- **Display:** Barlow Condensed, 600–700, uppercase, tightly tracked.
- **Body:** Barlow, 400–600, sentence case and relaxed line height.
- **Technical:** Space Mono, 400–700, uppercase, 10–12px with generous tracking.
- Large display text may use a transparent fill and subtle stroke for hierarchy; never apply outline treatment to body copy.

## Layout

- Container: max `1600px`; gutters `16px` mobile, `32px` desktop.
- Section rhythm: `96px` mobile, `128px` desktop where content allows.
- Use 12-column composition on desktop and asymmetric bento grids for product/category storytelling.
- Corners are precise: `2–4px` for most controls and cards. Avoid soft, pill-shaped UI except status indicators.
- Use thin borders, grid overlays and mono labels as technical structure—not visual clutter.

## Components

### Buttons

- Minimum interactive size: `44px`.
- Primary: cyan background, black label, mono uppercase text.
- Secondary: transparent dark background, precision border, white label.
- Focus: visible 2px cyan ring with offset.
- Hover may change color or move an icon by a few pixels; do not resize the control.

### Product cards

- Strong imagery first, with gradient support for overlaid technical metadata.
- Product name, price, fitment and stock state remain visible without hover.
- Quick add remains persistent and must disable when unavailable.
- Wishlist is a separate button; never nest an interactive control inside a link.

### Navigation

- Fixed glass navigation with one dominant fitment CTA.
- Desktop targets are at least 44px; mobile navigation is full-width and easy to scan.
- Do not duplicate destinations under different labels.

## Motion

- Use Framer Motion for entry, scroll-linked depth and small state transitions.
- Default easing: `[0.16, 1, 0.3, 1]`; typical duration `450–600ms`.
- Stagger related content by `50–90ms`.
- Motion should reinforce speed, depth and hierarchy. Avoid bouncing or playful overshoot.
- Respect `prefers-reduced-motion`; stop continuous marquees and remove parallax when requested.
- Pause or avoid expensive 3D/media work when offscreen.

## Voice

Short, assured and specific. Prefer “Verified fit for your vehicle” over “Perfect products for everyone.” Lead with the transformation, then support it with fitment, material and installation proof.

## Do not use

- Gold-on-cream fashion-luxury styling
- Cyberpunk neon overload
- Rounded-card grids with identical hierarchy
- Hover-only actions
- Tiny interaction targets or low-contrast metadata
- Uncontrolled animation, layout-shifting hover effects or hidden focus states

## Pre-delivery checklist

- Keyboard focus is visible and source order is logical.
- All controls have accessible names and 44px targets.
- Reduced motion is respected.
- Layout works at 375px, 768px, 1024px and 1440px.
- No horizontal overflow or content hidden behind fixed navigation.
- Product actions, fitment states and stock states work without hover.
- Typecheck and production build pass.
