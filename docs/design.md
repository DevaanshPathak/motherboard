# bits&bytes Design System Specification

This document details the unified visual language, brand standards, and component architecture for the bits&bytes network operations platform (**bnb-motherboard**). It bridges the bits&bytes™ Brand Kit with a modern Neo-Brutalist design system.

---

## 1. Brand Guidelines & Assets

### 1.1 The Logo
The brand mark is a geometric cube rendered in a bold, isometric style with stylized `B` letterforms on its face and a four-pointed star on top.

* **Primary Lockup:** White / Transparent backgrounds.
* **Dark Lockup:** Black-background contexts.
* **Brand Lockup:** Burgundy `#97192c` environments.
* **Accent Lockup:** Orange `#fc920d` (campaigns / call-to-actions).

#### Usage in Markdown:
```markdown
![bits&bytes™ Logo](https://gobitsnbytes.org/logo)
```

#### Usage in HTML:
```html
<img src="https://gobitsnbytes.org/logo" alt="bits&bytes™ logo" class="h-12 w-auto" />
```

### 1.2 Naming Standards
* **bits&bytes™**: The community-facing brand name. It must **always** be lowercase. The ampersand is mandatory.
* **GOBITSNBYTES FOUNDATION**: The registered legal entity name, reserved for legal documents, invoices, and official filings.

> [!CAUTION]
> Never write "bits & bytes™", "Bits & Bytes", "bits and bytes", "B&B", or "gobitsnbytes" in community-facing or digital platform copy.

---

## 2. Style Foundations & Tokens

Our design system combines the structure of a core color palette with a Neo-Brutalist design language (thick borders, hard offsets, vivid accent colors, boxy outlines).

### 2.1 Typography
We pair high-energy sans-serif typefaces for structure with a traditional serif for readability.

| Role | Typeface | CSS Variable | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary (Headings)** | Helvetica Now / Inter | `var(--font-heading)` | Strict, bold, direct titles and headers |
| **Secondary (Body)** | Georgia Pro / Merriweather | `var(--font-base)` | Content paragraphs, descriptions, longer text |
| **Accent Script** | Palm Club | N/A | Decorative elements |
| **Accent Sans** | Anton | N/A | High-impact condensed callouts |

### 2.2 Color System
To maintain consistency, colors are defined as HSL tokens for Tailwind and CSS variables for the theme.

#### Brand Colors
* **Burgundy (Base: `#97192c` / `hsl(351, 71%, 34%)`):** The core brand color. High contrast, serious, professional. Used for main headings, primary buttons, and critical states.
* **Orange (Base: `#fc920d` / `hsl(34, 80%, 52%)`):** Accent color for highlight states, alerts, visual interest, and hover styles.
* **Neutral Dark (Base: `#120f0a` / `hsl(34, 29%, 6%)`):** Used for solid borders, high-contrast text, and default dark fills.
* **Background Light (Base: `#ffffff` / `hsl(0, 0%, 100%)`):** Primary workspace canvas.

#### System Theme Mappings (Tailwind Config / Global CSS)
* `--main`: `var(--primary)` (Burgundy `#97192c`)
* `--main-foreground`: `#ffffff`
* `--secondary-background`: `#ffffff`
* `--border`: `#120f0a` (Neutral Dark)
* `--bg`: `#ffffff`

---

## 3. Neo-Brutalist Component Rules

All frontend components constructed in `@bnb/ui` must adhere to these structural constraints to maintain the Neo-Brutalist signature style.

### 3.1 Structural Rules

* **Thick Borders:** Every interactive component must have a solid, high-contrast border of exactly `2px` (or `border-2`) using the border color (`--border`).
* **No Shadow Blur:** Shadows must use a hard, solid offset with no blur radius.
  * **Default Shadow:** `4px 4px 0px 0px rgba(0, 0, 0, 1)` (Tailwind `shadow-shadow`)
  * **Hover Translation:** On hover, elements translate up/left and increase the shadow, or translate down/right and eliminate the shadow (representing a physical press).
* **Flat Corners:** Border-radius must be a boxy `4px` (or `rounded-base`) to maintain the raw architectural style.
* **High Contrast:** All text must meet a minimum contrast ratio of **4.5:1** (WCAG AA). Faded/low-contrast text is strictly prohibited.

### 3.2 Visual Texture Accents
To prevent layouts from appearing sterile, pages should selectively incorporate these assets:
* **Gradient Blobs:** Radial background glows transitioning from Orange to Burgundy.
* **Halftone Dots:** Retro print-texture fills.
* **Starburst / Spiky Badges:** Asymmetric spiky containers for announcements/discounts.
* **Accents Stars:** Four-pointed and multi-pointed editorial accents.

---

## 4. Installed Components (shadcn/ui & neobrutalism.dev)

The following components have been installed via the Shadcn CLI from the [neobrutalism.dev](https://neobrutalism.dev) registry into `@bnb/ui` under [packages/ui/src/components/ui](file:///d:/motherboard/packages/ui/src/components/ui):

* **Accordion** ([accordion.tsx](file:///d:/motherboard/packages/ui/src/components/ui/accordion.tsx)) — Collapsible interactive content stacks.
* **Alert Dialog** ([alert-dialog.tsx](file:///d:/motherboard/packages/ui/src/components/ui/alert-dialog.tsx)) — Modal dialog for critical confirmations.
* **Alert** ([alert.tsx](file:///d:/motherboard/packages/ui/src/components/ui/alert.tsx)) — Inline banners for notifications.
* **Avatar** ([avatar.tsx](file:///d:/motherboard/packages/ui/src/components/ui/avatar.tsx)) — Circled user profile fallback initials.
* **Badge** ([badge.tsx](file:///d:/motherboard/packages/ui/src/components/ui/badge.tsx)) — Meta tags and status pills.
* **Breadcrumb** ([breadcrumb.tsx](file:///d:/motherboard/packages/ui/src/components/ui/breadcrumb.tsx)) — Visual trail navigation.
* **Button** ([button.tsx](file:///d:/motherboard/packages/ui/src/components/ui/button.tsx)) — Fully interactive action triggers with hard-offset active presses.
* **Calendar** ([calendar.tsx](file:///d:/motherboard/packages/ui/src/components/ui/calendar.tsx)) — Date picking calendar grid.
* **Card** ([card.tsx](file:///d:/motherboard/packages/ui/src/components/ui/card.tsx)) — Structured container cards.
* **Carousel** ([carousel.tsx](file:///d:/motherboard/packages/ui/src/components/ui/carousel.tsx)) — Sliding horizontal items.
* **Checkbox** ([checkbox.tsx](file:///d:/motherboard/packages/ui/src/components/ui/checkbox.tsx)) — High-contrast list selection boxes.
* **Collapsible** ([collapsible.tsx](file:///d:/motherboard/packages/ui/src/components/ui/collapsible.tsx)) — Basic fold-out panels.
* **Command** ([command.tsx](file:///d:/motherboard/packages/ui/src/components/ui/command.tsx)) — Command palette dialog/popover list.
* **Context Menu** ([context-menu.tsx](file:///d:/motherboard/packages/ui/src/components/ui/context-menu.tsx)) — Right-click context menus.
* **Dialog** ([dialog.tsx](file:///d:/motherboard/packages/ui/src/components/ui/dialog.tsx)) — Overlay modal viewboxes.
* **Drawer** ([drawer.tsx](file:///d:/motherboard/packages/ui/src/components/ui/drawer.tsx)) — Fling-out bottom or side panels.
* **Dropdown Menu** ([dropdown-menu.tsx](file:///d:/motherboard/packages/ui/src/components/ui/dropdown-menu.tsx)) — Triggered overlays for action selections.
* **Form** ([form.tsx](file:///d:/motherboard/packages/ui/src/components/ui/form.tsx)) — React Hook Form wrappers with design tokens.
* **Hover Card** ([hover-card.tsx](file:///d:/motherboard/packages/ui/src/components/ui/hover-card.tsx)) — Mouse-hover detail views.
* **Input OTP** ([input-otp.tsx](file:///d:/motherboard/packages/ui/src/components/ui/input-otp.tsx)) — One-time-password grouped code inputs.
* **Input** ([input.tsx](file:///d:/motherboard/packages/ui/src/components/ui/input.tsx)) — Form text entry lines.
* **Label** ([label.tsx](file:///d:/motherboard/packages/ui/src/components/ui/label.tsx)) — Semantic title labels for inputs.
* **Menubar** ([menubar.tsx](file:///d:/motherboard/packages/ui/src/components/ui/menubar.tsx)) — Persistent desktop-like top navigation menus.
* **Navigation Menu** ([navigation-menu.tsx](file:///d:/motherboard/packages/ui/src/components/ui/navigation-menu.tsx)) — Custom navbar routes and details.
* **Pagination** ([pagination.tsx](file:///d:/motherboard/packages/ui/src/components/ui/pagination.tsx)) — Multipage selector footers.
* **Popover** ([popover.tsx](file:///d:/motherboard/packages/ui/src/components/ui/popover.tsx)) — Contextual details popup.
* **Progress** ([progress.tsx](file:///d:/motherboard/packages/ui/src/components/ui/progress.tsx)) — Loading/state progression bars.
* **Radio Group** ([radio-group.tsx](file:///d:/motherboard/packages/ui/src/components/ui/radio-group.tsx)) — Option choice groupings.
* **Resizable** ([resizable.tsx](file:///d:/motherboard/packages/ui/src/components/ui/resizable.tsx)) — Split draggable/resizable layouts.
* **Scroll Area** ([scroll-area.tsx](file:///d:/motherboard/packages/ui/src/components/ui/scroll-area.tsx)) — Custom scrollbars container.
* **Select** ([select.tsx](file:///d:/motherboard/packages/ui/src/components/ui/select.tsx)) — Styled options list selector.
* **Sheet** ([sheet.tsx](file:///d:/motherboard/packages/ui/src/components/ui/sheet.tsx)) — Side overlays.
* **Sidebar** ([sidebar.tsx](file:///d:/motherboard/packages/ui/src/components/ui/sidebar.tsx)) — Main operational side navigators.
* **Skeleton** ([skeleton.tsx](file:///d:/motherboard/packages/ui/src/components/ui/skeleton.tsx)) — Pulse-animation content placeholders.
* **Slider** ([slider.tsx](file:///d:/motherboard/packages/ui/src/components/ui/slider.tsx)) — Numerical range sliders.
* **Sonner** ([sonner.tsx](file:///d:/motherboard/packages/ui/src/components/ui/sonner.tsx)) — Custom toast notifications container.
* **Switch** ([switch.tsx](file:///d:/motherboard/packages/ui/src/components/ui/switch.tsx)) — Toggle switches.
* **Table** ([table.tsx](file:///d:/motherboard/packages/ui/src/components/ui/table.tsx)) — Row/column data grids.
* **Tabs** ([tabs.tsx](file:///d:/motherboard/packages/ui/src/components/ui/tabs.tsx)) — Section tab selection layouts.
* **Textarea** ([textarea.tsx](file:///d:/motherboard/packages/ui/src/components/ui/textarea.tsx)) — Large multiline text inputs.
* **Tooltip** ([tooltip.tsx](file:///d:/motherboard/packages/ui/src/components/ui/tooltip.tsx)) — Floating hover guides.

---

## 5. QA Verification Checklist

Review the following before committing frontend changes:
1. **Contrast:** Does all text achieve WCAG AA contrast (4.5:1)?
2. **Focus Visible:** Do all interactive elements show a clear focus ring (using `focus-visible:ring-2`) when focused?
3. **Responsive:** Do layouts scale elegantly down to mobile?
4. **Borders & Fills:** Are all borders 2px thick (`border-2 border-border`)? Does the primary active state use Burgundy `#97192c`?
5. **No Blur:** Are drop-shadows solid offsets with `shadow-shadow`?
