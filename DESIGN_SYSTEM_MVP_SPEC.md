# LinkedIn Positioning AI — MVP Design System Specification (Refactored)

## 1) Design system vision

Design direction: **premium clarity**.
- Clean and strategic, not flashy.
- Aspirational and trustworthy, not playful.
- Elegant and accessible, not visually heavy.

Emotional goal:
- Users should feel they are receiving a high-value strategic diagnosis.

Interface personality translation:
- **Clarity:** strong hierarchy, explicit next actions.
- **Confidence:** disciplined spacing and restrained color use.
- **Intelligence:** structured content blocks and semantic UI.
- **Sophistication:** subtle elevation, refined typography, minimal decoration.

---

## 2) Visual style foundation

## Color philosophy
- Trust-first primary (blue family), warm neutrals, restrained accent.
- Functional colors only for state communication.

## Typography philosophy
- Highly legible modern sans-serif.
- Text-first product means typography must carry authority.

## Spacing philosophy
- 4px scale with 8px rhythm.
- More whitespace in marketing, medium density in app.

## Border radius philosophy
- `8–14px` range: modern without playful excess.

## Shadow/elevation philosophy
- Use border and contrast first; soft shadows second.

## Iconography philosophy
- Functional stroke icons; semantic support, no visual clutter.

## Motion philosophy
- Fast, subtle, purposeful; communicates state change, never spectacle.

---

## 3) Design tokens

Use a two-layer token model:
1. **Primitives**: raw values (colors, radii, spacing, shadows).
2. **Semantics**: usage-based tokens (`bg.canvas`, `text.primary`, `action.primary.bg`).

Required token groups:
- `color`
- `typography`
- `space`
- `size`
- `radius`
- `shadow`
- `opacity`
- `z`
- `motion`
- `breakpoint`

Implementation rules:
- Source of truth in JSON/TS token files.
- Publish as CSS custom properties.
- Map Tailwind theme to semantic tokens (not direct hex usage).

---

## 4) Color system

## 4.1 Palette values (light mode)

### Primary (brand/action)
- `primary.50  #EEF3FF`
- `primary.100 #DCE7FF`
- `primary.200 #BACFFF`
- `primary.300 #8FB0FF`
- `primary.400 #5F8CFA`
- `primary.500 #3F6EEB`
- `primary.600 #3159C8`
- `primary.700 #2747A3`
- `primary.800 #1E377F`
- `primary.900 #172C63`

### Secondary (strategic accent)
- `secondary.500 #0F766E`

### Neutrals
- `neutral.0   #FFFFFF`
- `neutral.50  #F8FAFC`
- `neutral.100 #F1F5F9`
- `neutral.200 #E2E8F0`
- `neutral.300 #CBD5E1`
- `neutral.400 #94A3B8`
- `neutral.500 #64748B`
- `neutral.600 #475569`
- `neutral.700 #334155`
- `neutral.800 #1E293B`
- `neutral.900 #0F172A`

### Status
- `success.500 #16A34A`
- `warning.500 #D97706`
- `error.500   #DC2626`
- `info.500    #2563EB`

## 4.2 Semantic roles
- Background: `bg.canvas`, `bg.section`, `bg.subtle`
- Surface: `surface.default`, `surface.muted`, `surface.elevated`
- Text: `text.primary`, `text.secondary`, `text.tertiary`, `text.inverse`
- Border: `border.default`, `border.strong`, `border.focus`
- Action: `action.primary.*`, `action.secondary.*`, `action.disabled.*`
- Feedback: `status.success.*`, `status.warning.*`, `status.error.*`, `status.info.*`

## 4.3 Usage guidance
- Keep primary color mostly for CTA and selected states.
- Keep dashboards neutral to maximize text readability.
- Use state colors consistently and sparingly.

## 4.4 Dark mode note
Not required for MVP. Add later only after core journey is stable.

---

## 5) Typography system

## Font strategy
- Primary: **Inter** (recommended for speed/readability)
- Alternative: Plus Jakarta Sans
- Fallback: system sans stack

## Type scale
- `display-lg: 48/56, 700`
- `display-md: 40/48, 700`
- `h1: 32/40, 700`
- `h2: 28/36, 600`
- `h3: 24/32, 600`
- `h4: 20/28, 600`
- `body-lg: 18/30, 400`
- `body-md: 16/26, 400`
- `body-sm: 14/22, 400`
- `label: 13/18, 600`
- `caption: 12/18, 500`

## Letter spacing
- Headlines: `-0.01em`
- Body: `0`
- Labels: `0.01em`

How typography communicates trust:
- High legibility, stable rhythm, and consistent hierarchy across marketing + app.

---

## 6) Layout system

## Grid
- Mobile-first single-column flow.
- Desktop 12-column grid.

## Container widths
- `sm 640`, `md 768`, `lg 1024`, `xl 1200`, `2xl 1320`

## Spacing
- Section: mobile `48–64`, desktop `72–96`
- Card padding: `16/20/24`

## Dashboard rules
- Header + KPI strip + primary action area.
- Max 3 columns for readability.

## Form rules
- One column on mobile.
- Two columns only for short related fields on desktop.
- Always show progress in multi-step intake.

## Mobile rules
- Minimum page padding `16px`.
- Sticky CTA for long steps.
- Sidebar collapses into drawer.

---

## 7) Component design language

For each family: visual style, hierarchy, states, usage, avoid.

### Buttons
- Styles: primary, secondary (outline), ghost, destructive.
- One primary action per region.
- States: default/hover/focus/active/disabled/loading.
- Avoid: many competing primary CTAs.

### Inputs / Textareas / Selects
- Clear label + helper + error message pattern.
- High-contrast focus ring.
- Avoid placeholder-as-label.

### Checkboxes / Radios / Toggles
- Checkbox = multi-select; radio = exclusive choice; toggle = immediate setting.
- Avoid toggle for deferred-submit options.

### Badges / Tags / Pills
- Status or metadata only.
- Avoid using as primary action elements.

### Alerts
- Concise, semantic, actionable when needed.
- Avoid stacked persistent warnings.

### Cards
- Subtle borders, restrained shadow, clear heading.
- Avoid deep card nesting.

### Modals / Drawers
- Modal for focused short tasks.
- Drawer for mobile nav/secondary panels.
- Avoid multi-step flows in modal.

### Tables
- Admin/data-heavy contexts.
- Add responsive fallback for mobile.

### Tabs / Accordions
- Tabs for peer views; accordions for progressive disclosure.
- Avoid nested tab systems.

### Tooltips
- Short clarification only.
- Never hide critical info in tooltip.

### Progress / Loader
- Use step-aware loading language.
- Avoid spinner-only for long operations.

### Empty state
- Explain context + offer next action.

### Toast
- Ephemeral, low-criticality feedback.

### Navigation
- Sidebar (desktop app), top bar, breadcrumbs (deep admin), pagination (lists).
- Avoid deep IA trees in MVP.

---

## 8) Core product patterns

### Landing page
- Outcome-led hero, trust proof, clear CTA repetition.

### Checkout
- Short flow, local payment confidence, security/refund reassurance.

### Onboarding
- Fast start, expectation setting, visible progress.

### Intake form
- Sectioned blocks, autosave, conditional questions.

### Generation loading
- Stage-based feedback and realistic wait messaging.

### Results dashboard
- Diagnosis first, then actionable rewritten content.

### PDF preview
- Readability-first structure with version/date cues.

### Upsell prompts
- Contextual and value-based, never pushy.

### Admin panel
- Operational scanability: failures, retries, payment state, queue health.

---

## 9) Interaction states

Global state behavior:
- `hover`: subtle visual lift (120–160ms)
- `focus`: 2px visible ring with strong contrast
- `active`: light press effect
- `selected`: persistent semantic style
- `disabled`: low emphasis but still readable
- `loading`: preserve layout; inline spinner + text
- `error`: local + summary feedback pattern
- `success`: confirmation + next action
- `empty`: explanatory message + CTA
- `skeleton`: layout-faithful placeholders

---

## 10) Accessibility baseline

- Contrast: WCAG AA minimum (4.5:1 text).
- Keyboard: all core flows operable without mouse.
- Focus: never hidden; strong visible indicator.
- Touch targets: minimum `44x44`.
- Forms: labels always visible, error text explicit, no color-only meaning.
- Semantics: use proper HTML elements before ARIA.

---

## 11) Motion and microinteractions

## Motion tokens
- Duration: `fast 120ms`, `base 180ms`, `slow 240ms`
- Easing: smooth entry/exit curves

## Usage
- Hover transitions: color/shadow only.
- Panel transitions: fade + slight translate.
- Loaders: calm and informative.
- Progress: explicit state copy.
- Delight: subtle one-time completion cue.

Principle: motion should increase clarity, not decoration.

---

## 12) Design system structure for implementation

## Code organization (recommended)
```txt
packages/
  design-tokens/
    src/
      primitives.json
      semantic.light.json
      typography.json
      motion.json
  ui/
    src/
      components/
      patterns/
      foundations/
      utils/
  docs/
    design-system/
      principles.md
      accessibility.md
      usage-guidelines.md
```

## Naming conventions
- Tokens: `category.role.state`
- Variants: `intent`, `size`, `appearance`

## Variant strategy
- Use CVA (or equivalent) and keep variant sets bounded.

## Theming strategy
- Light theme for MVP.
- Dark theme later through semantic token overrides.

## Documentation
- Storybook with states, a11y checks, and do/don’t examples.

---

## 13) MVP design kit recommendation

## Recommended stack
- Tailwind CSS + CSS variables + Radix primitives + CVA + Storybook.

## Speed vs polish balance
- Build token foundation first.
- Build high-impact components next (Button/Input/Card/Modal/Toast).
- Compose product patterns last (intake, generation, results, admin).

## Avoid in phase 1
- Overbuilt theme engines.
- Too many component variants.
- Decorative visuals that reduce clarity.

---

## A) Design System Summary (3-minute founder read)

- The product should feel like a **premium strategic advisor**.
- Visual language: trust-first blue, warm neutrals, restrained accents.
- Typography and hierarchy are the core of perceived value.
- Consistent component behavior builds trust and speeds engineering.
- Accessibility is part of quality, not an optional extra.
- Recommended implementation: Tailwind + CSS vars + Radix + CVA + Storybook.

---

## B) Sample token structure (JSON-like)

```json
{
  "color": {
    "primitive": {
      "primary": { "500": "#3F6EEB", "600": "#3159C8", "700": "#2747A3" },
      "neutral": { "0": "#FFFFFF", "50": "#F8FAFC", "900": "#0F172A" },
      "success": { "500": "#16A34A" },
      "warning": { "500": "#D97706" },
      "error": { "500": "#DC2626" },
      "info": { "500": "#2563EB" }
    },
    "semantic": {
      "bg": { "canvas": "{color.primitive.neutral.50}", "section": "{color.primitive.neutral.0}" },
      "text": { "primary": "{color.primitive.neutral.900}", "secondary": "{color.primitive.neutral.700}" },
      "action": {
        "primary": {
          "bg": "{color.primitive.primary.500}",
          "bgHover": "{color.primitive.primary.600}",
          "text": "{color.primitive.neutral.0}"
        }
      }
    }
  },
  "typography": {
    "fontFamily": { "sans": "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" },
    "size": { "h1": "32px", "h2": "28px", "body": "16px", "caption": "12px" },
    "lineHeight": { "h1": "40px", "body": "26px", "caption": "18px" },
    "weight": { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 }
  },
  "space": { "1": "4px", "2": "8px", "4": "16px", "6": "24px", "8": "32px", "12": "48px" },
  "radius": { "sm": "8px", "md": "10px", "lg": "12px", "pill": "999px" },
  "shadow": { "sm": "0 1px 2px rgba(15,23,42,0.06)", "md": "0 6px 16px rgba(15,23,42,0.08)" },
  "motion": { "duration": { "fast": "120ms", "base": "180ms", "slow": "240ms" } },
  "breakpoint": { "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px" }
}
```

---

## C) Recommended component inventory for MVP phase 1

### Foundations
- Color roles
- Typography styles
- Spacing/radius/elevation utilities

### Inputs and actions
- Button, Input, Textarea, Select, Checkbox, Radio, Toggle

### Feedback
- Alert, Badge/Tag, Toast, Progress, Spinner, Skeleton

### Layout/surfaces
- Card, Modal, Drawer, Tooltip, Empty State

### Navigation/data
- Sidebar, Top Bar, Tabs, Breadcrumbs, Pagination, Table

### Product patterns
- Pricing card
- Checkout summary
- Multi-step intake section
- Generation status panel
- Results block
- Upsell card/banner

---

## D) Design mistakes to avoid

1. Visual style drift between landing and dashboard.
2. Low-contrast text and weak focus indicators.
3. Too many CTA styles and no clear hierarchy.
4. Long forms without progress or autosave.
5. Generic loading states for long AI generation.
6. Over-animated UI that reduces credibility.
7. Admin visual density leaking into user-facing flows.
8. Hardcoded colors instead of semantic tokens.
