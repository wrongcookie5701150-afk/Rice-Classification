# Design System Strategy: The Agrarian Editorial

This design system is a high-end framework built for a rice grain classification web app. It rejects the "industrial" aesthetic of traditional agricultural software in favor of an "Editorial Agrarian" approach—combining the precision of scientific classification with the warmth of organic growth.

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Agronomist"**
This system is defined by **Precision through Breathability**. Instead of dense grids and heavy borders, we use expansive white space and intentional asymmetry to guide the user’s eye. The interface should feel like a premium scientific journal: authoritative, clean, and meticulously organized.

**Key Design Principles:**
*   **Organic Brutalism:** We use sharp, confident typography paired with soft, rounded containers (`xl` and `full` radius tokens) to mirror the hard science of classification and the soft nature of the grain.
*   **Asymmetric Balance:** Break the "bootstrap" look by offsetting header content and using wide margins (Spacing `20` and `24`) to create a sense of luxury and focus.
*   **Tonal Depth:** We abandon 1px lines. Hierarchy is defined by the physical stacking of surfaces, creating a tactile, "paper-on-stone" feel.

---

## 2. Color & Surface Architecture
The palette is rooted in the lifecycle of rice: from the deep chlorophyll of the leaf (`primary`) to the golden hue of the harvest (`secondary`).

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts.
*   **Surface:** `#f8faf3` (Base layer)
*   **Surface Container Low:** `#f2f4ed` (Secondary sections)
*   **Surface Container High:** `#e7e9e2` (Interactive areas/Cards)

### Glass & Gradient Signature
To move beyond a "standard" flat UI, use **Glassmorphism** for floating classification panels:
*   **Material:** `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur.
*   **Signature Gradient:** For Hero CTAs and Analysis States, use a subtle linear gradient from `primary` (#3a6716) to `primary_container` (#52812d) at a 135° angle. This adds "soul" and depth to the classification results.

---

## 3. Typography: The Editorial Scale
We pair **Manrope** (a modern geometric sans) for high-impact data with **Public Sans** for utilitarian legibility.

*   **Display (Manrope):** Use `display-lg` for classification percentages. The large scale conveys "Authority."
*   **Headline (Manrope):** Use `headline-sm` for card titles. Set letter-spacing to `-0.02em` for a tighter, premium feel.
*   **Body (Public Sans):** Use `body-md` for all metadata and grain descriptions. The neutral tone ensures the focus remains on the image data.
*   **Label (Public Sans):** Use `label-md` in all-caps with `0.05em` letter-spacing for category tags (e.g., "LONG GRAIN", "JASMINE").

---

## 4. Elevation & Depth: The Layering Principle
Depth is achieved through **Tonal Layering** rather than structural shadows.

*   **The Stack:** Place a `surface_container_lowest` card on top of a `surface_container_low` section. This creates a soft, natural lift.
*   **Ambient Shadows:** For "Floating" grain analysis modals, use a custom shadow: 
    *   `y: 20px, blur: 40px, color: rgba(25, 28, 24, 0.06)` (A tinted version of `on_surface`).
*   **The Ghost Border:** If a boundary is required for accessibility, use the `outline_variant` token at **15% opacity**. Never use a 100% opaque border.

---

## 5. Component Logic

### Buttons & Interaction
*   **Primary:** A pill-shaped (`full` radius) button using the `primary` fill. No border. On hover, shift to `primary_container`.
*   **Secondary:** `surface_container_highest` fill with `on_surface` text. This feels integrated into the background rather than floating.
*   **Tertiary:** No background. Use `primary` text with an underline that only appears on hover.

### Form Elements & Inputs
*   **Inputs:** Use `surface_container_low` for the field background. Instead of a bottom border, use a 2px "Focus Bar" of `primary` that animates from the center outward when the field is active.
*   **Checkboxes/Radios:** Use `secondary_container` for the "selected" state. The golden yellow (#fcd773) provides a high-contrast, "sun-drenched" highlight that signifies a successful selection.

### Cards & Classification Lists
*   **The Card:** Absolutely no divider lines. Separate "Grain Type" from "Confidence Score" using a Spacing `6` (1.5rem) vertical gap.
*   **The List:** Use `surface_container_lowest` for list items on a `surface` background. On hover, transition the background to `surface_bright` to create a subtle "glow."

### Custom Component: The Classification Overlay
For grain analysis, use a "Magnifier" component: A `full` radius circle with a `2px` `outline` of `secondary` (#755b00) that follows the cursor, providing a high-trust, technical feel to the classification process.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use asymmetric padding. For example, a card might have `6` (1.5rem) padding on the top/left but `8` (2rem) on the bottom/right to create visual "movement."
*   **DO** use `secondary` (Yellow) sparingly as an accent for "Warning" or "High Confidence" states.
*   **DO** leave at least `12` (3rem) of margin between major UI sections to allow the "Editorial" look to breathe.

### Don’t
*   **DON'T** use pure black (#000000). Always use `on_surface` (#191c18) for text to maintain a soft, organic contrast.
*   **DON'T** use 90-degree corners for buttons or cards. Use the `xl` (0.75rem) or `full` tokens to keep the interface feeling approachable and "grown."
*   **DON'T** use "Drop Shadows" on cards. Rely on the surface color transitions (`surface` → `surface_container_low`).