# 🎨 DESIGN TOKENS & VARIABLES SYSTEM

**Documento:** Sistema maestro de variables (colores, tipografía, spacing, tamaños)  
**Versión:** 1.0.0  
**Status:** ✅ LIVE — Copy to Figma now  
**Propósito:** Estandarización global | Consistencia 100% | Reutilización

---

## 📋 ÍNDICE

1. **Color System (Psychology-Based)**
2. **Typography System**
3. **Spacing & Grid System**
4. **Size System**
5. **Elevation & Shadows**
6. **Component Tokens**
7. **Context-Specific Tokens**
8. **Responsive Breakpoints**
9. **Animation Tokens**
10. **Figma Implementation**

---

## 🎨 COLOR SYSTEM (Psychology-Based)

### **PSYCHOLOGY MAPPING → HEX VALUES**

```
EMOTION → COLOR → HEX → USAGE

URGENCY (Decision pressure):
├─ Red (Alert) → #EF4444 → Urgency signals, countdown timers
├─ Red-Orange (Strong alert) → #F97316 → Order bumps, limited offers
├─ Amber (Attention) → #F59E0B → Stock counters, highlights
└─ Usage: Tripwires, flash sales, scarcity signals

TRUST (Confidence):
├─ Blue (Professional) → #3B82F6 → Main CTA, professional contexts
├─ Indigo (Deep trust) → #4F46E5 → Premium, authority
├─ Slate (Neutral) → #64748B → Secondary actions, support text
└─ Usage: Main offers, recurring/membership, authority displays

VALUE (Gain motivation):
├─ Green (Success/growth) → #10B981 → Savings display, ROI, benefits
├─ Emerald (Prosperity) → #059669 → Premium upsells, multiplication
├─ Lime (Energy) → #84CC16 → Excitement, urgency (softer than red)
└─ Usage: Price comparisons, value stacking, benefits callouts

PREMIUM (Luxury/exclusivity):
├─ Purple (Premium/magic) → #A855F7 → Exclusive offers, premium tiers
├─ Violet (Elegance) → #7C3AED → High-ticket offers, luxury positioning
├─ Rose (Romance/desire) → #F43F5E → Desire, exclusivity, luxury
└─ Usage: High-ticket products, VIP experiences, premium packaging

CALM (Trust building):
├─ Teal (Serenity) → #14B8A6 → Trustworthy contexts, downsells
├─ Cyan (Clear) → #06B6D4 → Clarity, SaaS, tech products
├─ Sky (Peaceful) → #0EA5E9 → Accessibility, helpful information
└─ Usage: Rescues, membership, recurring offers

NEUTRAL (Clarity):
├─ White → #FFFFFF → Primary backgrounds, clean spaces
├─ Gray 50 → #F9FAFB → Subtle backgrounds
├─ Gray 900 → #111827 → Text, primary copy
└─ Usage: Backgrounds, text layers, structure
```

### **MASTER COLOR PALETTE**

```
TIER 1: BRAND PRIMARIES (Use everywhere)
├─ Primary → #6366F1 (Indigo) | Use for: Main CTA, brand
├─ Primary Light → #E0E7FF | Use for: Backgrounds, hover
├─ Primary Dark → #312E81 | Use for: Text on light, bold accents
└─ Usage: 60% of all design

TIER 2: URGENCY SPECTRUM (Use for time/scarcity)
├─ Urgent → #EF4444 (Red) | Use for: Countdown, limited spots
├─ Very Urgent → #DC2626 (Darker red) | Use for: Critical alerts
├─ Moderate Urgent → #F59E0B (Amber) | Use for: Attention signals
└─ Usage: 20% of design (only when applies)

TIER 3: VALUE SPECTRUM (Use for ROI/benefits)
├─ Value → #10B981 (Green) | Use for: Savings, ROI, benefits
├─ High Value → #059669 (Darker green) | Use for: Premium value
├─ Value Light → #D1FAE5 | Use for: Value backgrounds
└─ Usage: 10% of design

TIER 4: NEUTRALS (Use for text/backgrounds)
├─ Text Primary → #111827 (Gray 900) | Use for: Body text
├─ Text Secondary → #6B7280 (Gray 500) | Use for: Support text, labels
├─ Background → #FFFFFF (White) | Use for: Primary backgrounds
├─ Background Alt → #F9FAFB (Gray 50) | Use for: Alternate sections
└─ Usage: 30% of design (structure)

TIER 5: SEMANTIC (Use for status)
├─ Success → #10B981 (Green) | Use for: Success states, confirmations
├─ Warning → #F59E0B (Amber) | Use for: Warnings, cautions
├─ Error → #EF4444 (Red) | Use for: Errors, unavailable
├─ Info → #3B82F6 (Blue) | Use for: Information, helps
└─ Usage: As needed for states

TIER 6: PREMIUM/LUXURY (Use for high-ticket)
├─ Luxury → #7C3AED (Violet) | Use for: Exclusive offers, premium
├─ Accent Gold → #FBBF24 (Amber-Gold) | Use for: Luxury accents
├─ Accent Copper → #EA580C (Copper) | Use for: Premium touches
└─ Usage: 10% when premium positioning needed
```

### **COLOR PSYCHOLOGY RULES**

```
NEVER mix:
├─ ✗ Red + Blue (conflicting urgency + trust)
├─ ✗ Green + Red (confusing value + urgency)
└─ ✗ All bright colors (visual chaos)

ALWAYS follow:
├─ ✓ Primary color: 60% of design
├─ ✓ Secondary color: 30% of design
├─ ✓ Accent color: 10% of design (urgency/value if needed)
└─ ✓ 60-30-10 rule: Creates balanced composition

CONTEXT RULES:
├─ No urgency? Use: Primary (blue) + Neutral
├─ Mild urgency? Use: Primary + Moderate Urgent (amber)
├─ High urgency? Use: Primary + Urgent (red) + Value (green)
├─ Premium positioning? Use: Primary + Luxury (violet)
└─ Value focus? Use: Primary + Value (green)
```

---

## 📝 TYPOGRAPHY SYSTEM

### **FONT FAMILIES**

```
PRIMARY FONT (Display/Headlines):
├─ Font: "Inter" or "Segoe UI"
├─ Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
├─ Use: Headlines, hero text, emphasis
├─ Psychology: Modern, clean, professional
└─ License: Google Fonts (free)

SECONDARY FONT (Body/Reading):
├─ Font: "Inter" (same as primary, different weight)
├─ Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
├─ Use: Body text, paragraphs, descriptions
├─ Psychology: Readable, professional, approachable
└─ License: Google Fonts (free)

ACCENT FONT (Luxury/Premium only):
├─ Font: "Playfair Display" (optional, for premium)
├─ Fallback: Georgia, serif
├─ Use: Premium/luxury headlines only (VIP, luxury products)
├─ Psychology: Elegant, sophisticated, premium
└─ License: Google Fonts (free)
```

### **FONT SIZE SCALE**

```
HIERARCHY (Pixel values):

Hero / Main Headline:
├─ Desktop: 48px (1.5x line-height = 72px)
├─ Tablet: 40px
├─ Mobile: 32px
├─ Weight: Bold (700)
├─ Letter spacing: -0.02em (tighter)
└─ Use: Page titles, main offers, hero headlines

Large Headline (H1):
├─ Desktop: 36px
├─ Tablet: 32px
├─ Mobile: 28px
├─ Weight: Semibold (600)
├─ Letter spacing: -0.01em
└─ Use: Section titles, product names

Medium Headline (H2):
├─ Desktop: 28px
├─ Tablet: 24px
├─ Mobile: 20px
├─ Weight: Semibold (600)
├─ Letter spacing: 0em
└─ Use: Subheadings, benefits

Small Headline (H3):
├─ Desktop: 20px
├─ Tablet: 18px
├─ Mobile: 16px
├─ Weight: Semibold (600)
├─ Letter spacing: 0em
└─ Use: Card titles, callouts

Body Large:
├─ Desktop: 18px
├─ Tablet: 16px
├─ Mobile: 16px
├─ Weight: Regular (400)
├─ Letter spacing: 0.02em
├─ Line height: 1.6 (28.8px)
└─ Use: Main body text, introductions

Body Regular (Base):
├─ Desktop: 16px
├─ Tablet: 15px
├─ Mobile: 14px
├─ Weight: Regular (400)
├─ Letter spacing: 0em
├─ Line height: 1.6 (25.6px)
└─ Use: Standard body text, descriptions

Body Small:
├─ Desktop: 14px
├─ Tablet: 13px
├─ Mobile: 12px
├─ Weight: Regular (400)
├─ Letter spacing: 0.02em
├─ Line height: 1.5 (21px)
└─ Use: Secondary text, labels, captions

Label / Tiny:
├─ Desktop: 12px
├─ Tablet: 11px
├─ Mobile: 10px
├─ Weight: Medium (500)
├─ Letter spacing: 0.1em (wider for emphasis)
├─ Line height: 1.4 (16.8px)
└─ Use: Labels, badges, small text

CTA / Button Text:
├─ Desktop: 16px
├─ Tablet: 15px
├─ Mobile: 14px
├─ Weight: Semibold (600)
├─ Letter spacing: 0.02em
└─ Use: Button text (larger than body for tap targets)
```

### **FONT WEIGHT SCALE**

```
USAGE RULES:

Regular (400):
├─ Use: Body text, standard paragraphs, descriptions
├─ Readability: Optimal for long-form reading
└─ Impact: Neutral, professional

Medium (500):
├─ Use: Labels, emphasis text, UI elements
├─ Readability: Slightly stronger than regular
└─ Impact: Professional, gentle emphasis

Semibold (600):
├─ Use: Headlines (H1-H3), subheadings, CTAs
├─ Readability: Clear hierarchy, confident
└─ Impact: Strong, authoritative

Bold (700):
├─ Use: Hero headlines only, main offer prices
├─ Readability: Maximum emphasis
└─ Impact: Powerful, demanding attention

NEVER use:
├─ ✗ Thin (< 300 weight) - too hard to read
├─ ✗ Italic (breaks professional tone in marketing)
├─ ✗ All caps (except badges/labels, feels shouting)
└─ ✗ Multiple weights in same section (creates chaos)
```

### **LINE HEIGHT & LETTER SPACING**

```
OPTIMAL VALUES (By text size):

Headline text (36px+):
├─ Line height: 1.2 (tight, impactful)
├─ Letter spacing: -0.02em to -0.01em (negative for confidence)
└─ Example: "GRAB THIS OFFER NOW" (feels strong)

Body text (16-18px):
├─ Line height: 1.6 (spacious, readable)
├─ Letter spacing: 0em to 0.02em (normal to slightly loose)
└─ Example: Paragraphs (easy to read)

Label/small text (12-14px):
├─ Line height: 1.4 (tight, efficient)
├─ Letter spacing: 0.02em to 0.1em (slightly loose)
└─ Example: "Limited to 47 remaining" (clear, scannable)

RULES:
├─ Tighter line height (1.2) = More impactful, less readable
├─ Looser line height (1.8) = More readable, less impactful
├─ Negative letter spacing = Confidence + luxury feel
├─ Positive letter spacing = Open + clarity feel
└─ Always test for readability on mobile (smallest viewport)
```

---

## 📏 SPACING & GRID SYSTEM

### **8PX GRID FOUNDATION**

```
BASE UNIT: 8px

All spacing multiples of 8:
├─ 4px (0.5x) - Only for tiny gaps or icon padding
├─ 8px (1x) - Minimum spacing unit
├─ 16px (2x) - Standard element spacing
├─ 24px (3x) - Section spacing
├─ 32px (4x) - Large section spacing
├─ 48px (6x) - Very large spacing, breathing room
├─ 64px (8x) - Huge spacing, premium feel
├─ 96px (12x) - Extra large, luxury spacing
└─ 128px (16x) - Massive, hero section spacing

RULES:
✓ All padding/margin = Multiple of 8px
✓ No spacing between 8-16px (use one or the other)
✓ Gaps between elements = 8, 16, 24, 32, 48px (ONLY these)
✓ Whitespace = Luxury signal (more space = premium)
```

### **RESPONSIVE SPACING ADJUSTMENTS**

```
DESKTOP (1200px+): Full spacing
├─ Padding: As defined (24-48px)
├─ Gaps: As defined (16-32px)
└─ Whitespace: Generous

TABLET (768-1199px): 80% spacing
├─ Padding: 80% of desktop (16-32px)
├─ Gaps: 80% of desktop (12-24px)
└─ Whitespace: Good, optimized

MOBILE (< 768px): 60% spacing
├─ Padding: 60% of desktop (12-24px)
├─ Gaps: 60% of desktop (8-16px)
└─ Whitespace: Efficient, content-focused

FORMULA:
├─ Mobile spacing = Desktop spacing × 0.6
├─ Example: 32px desktop gap = 19px mobile (round to 16px)
├─ Purpose: Fit more content on small screens
└─ Rule: Never go below 8px gap (minimum usability)
```

### **CONTAINER PADDING**

```
STANDARD PATTERNS:

Hero/Large sections:
├─ Desktop: 64px padding all sides
├─ Tablet: 48px padding all sides
├─ Mobile: 32px padding horizontal, 24px vertical
└─ Purpose: Maximum impact, breathing room

Content sections:
├─ Desktop: 48px padding all sides
├─ Tablet: 32px padding all sides
├─ Mobile: 24px padding all sides
└─ Purpose: Standard content framing

Card containers:
├─ Desktop: 32px padding all sides
├─ Tablet: 24px padding all sides
├─ Mobile: 16px padding all sides
└─ Purpose: Contained, framed elements

Compact sections:
├─ Desktop: 24px padding all sides
├─ Tablet: 16px padding all sides
├─ Mobile: 12px padding all sides
└─ Purpose: Information-dense sections

Button/Small containers:
├─ Padding: 12px horizontal, 8px vertical (minimum)
├─ Tap target: Minimum 44px height (accessibility)
└─ Purpose: Touch-friendly, scannable
```

---

## 📐 SIZE SYSTEM

### **COMPONENT SIZES (Width/Height)**

```
EXTRA SMALL (xs):
├─ 24px × 24px
├─ Use: Small icons, tiny badges
└─ Example: Social media icons

SMALL (sm):
├─ 32px × 32px  
├─ Use: Feature icons, small avatars
└─ Example: Benefit callout icons

MEDIUM (md):
├─ 48px × 48px
├─ Use: Feature highlights, profile pictures
└─ Example: Large feature icons

LARGE (lg):
├─ 96px × 96px
├─ Use: Hero icons, large illustrations
└─ Example: Product showcase image

XLARGE (xl):
├─ 192px × 192px
├─ Use: Hero product image, large illustrations
└─ Example: 3D mockup images

XXLARGE (2xl):
├─ 384px × 384px+
├─ Use: Full-width product sections
└─ Example: Large 3D product render
```

### **BUTTON SIZES**

```
SMALL BUTTON:
├─ Height: 32px
├─ Padding: 8px horizontal
├─ Font: 14px, medium weight
├─ Use: Secondary CTAs, inline actions
└─ Example: "Learn more" button

MEDIUM BUTTON (Default):
├─ Height: 44px (minimum tap target)
├─ Padding: 12px horizontal
├─ Font: 16px, semibold weight
├─ Use: Primary CTAs, most buttons
└─ Example: "Buy now" button

LARGE BUTTON:
├─ Height: 56px
├─ Padding: 16px horizontal
├─ Font: 18px, semibold weight
├─ Use: Hero CTAs, main conversion points
├─ Min width: 200px (psychological)
└─ Example: "Claim offer now" main CTA

XLARGE BUTTON:
├─ Height: 64px
├─ Padding: 20px horizontal
├─ Font: 20px, bold weight
├─ Use: Full-width mobile CTAs, urgent offers
├─ Min width: 100% on mobile
└─ Example: Tripwire "YES" button

BUTTON WIDTH:
├─ Min width: 120px (don't make buttons tiny)
├─ Max width: 400px (don't make them huge)
├─ Ideal: 160-280px (balanced, scannable)
└─ Full-width: Only on mobile or hero sections
```

---

## 🌑 ELEVATION & SHADOWS

### **SHADOW SYSTEM (Depth hierarchy)**

```
ELEVATION LEVEL 1 (Subtle):
├─ Box shadow: 0 1px 2px 0 rgba(0,0,0,0.05)
├─ Blur: 1px
├─ Spread: 0px
├─ Opacity: 5%
├─ Use: Hover states, subtle elevation
└─ Example: Hover effect on interactive elements

ELEVATION LEVEL 2 (Light):
├─ Box shadow: 0 4px 6px -1px rgba(0,0,0,0.1)
├─ Blur: 6px
├─ Spread: -1px
├─ Opacity: 10%
├─ Use: Cards at rest, default state
└─ Example: Standard cards, boxes

ELEVATION LEVEL 3 (Medium):
├─ Box shadow: 0 10px 15px -3px rgba(0,0,0,0.1)
├─ Blur: 15px
├─ Spread: -3px
├─ Opacity: 10%
├─ Use: Elevated cards, modals
└─ Example: Premium card, focused element

ELEVATION LEVEL 4 (High):
├─ Box shadow: 0 20px 25px -5px rgba(0,0,0,0.1)
├─ Blur: 25px
├─ Spread: -5px
├─ Opacity: 10%
├─ Use: Floating elements, overlays, dropdowns
└─ Example: Modal backdrop, dropdown menu

ELEVATION LEVEL 5 (Maximum):
├─ Box shadow: 0 25px 50px -12px rgba(0,0,0,0.25)
├─ Blur: 50px
├─ Spread: -12px
├─ Opacity: 25%
├─ Use: Maximum emphasis, hero elements
└─ Example: Featured offer, urgent modal

RULES:
├─ Use shadows to create hierarchy
├─ More important elements = Larger shadows
├─ Luxury designs = Subtle shadows (less is more)
├─ Urgent designs = Stronger shadows (emphasis)
└─ Mobile: Use slightly less shadow (smaller screens = less space)
```

### **BORDER RADIUS SCALE**

```
NONE:
├─ Value: 0px
├─ Use: Strict, corporate, minimal
└─ Example: Boxy layouts, traditional

SMALL (sm):
├─ Value: 4px
├─ Use: Subtle, modern, clean
├─ Use for: Small elements, buttons
└─ Example: Button border radius

MEDIUM (md):
├─ Value: 8px
├─ Use: Standard, balanced, modern
├─ Use for: Cards, containers, modals
└─ Example: Card corner radius

LARGE (lg):
├─ Value: 12px
├─ Use: Friendly, approachable, modern
├─ Use for: Large cards, hero sections
└─ Example: Large container radius

XLARGE (xl):
├─ Value: 16px
├─ Use: Very friendly, relaxed, modern
├─ Use for: Extra-large containers
└─ Example: Full-bleed sections

FULL (Rounded):
├─ Value: 9999px (or 50%)
├─ Use: Pill shapes, avatars, badges
├─ Use for: Circular/pill-shaped elements
└─ Example: Avatar images, badge shapes

RULES:
├─ Consistency: Use same radius across components
├─ Luxury: 4-8px radius (subtle, sophisticated)
├─ Modern: 8-12px radius (friendly, clean)
├─ Playful: 12px+ radius (fun, approachable)
└─ Never mix: Use 1-2 radius values maximum (consistency)
```

---

## 🔧 COMPONENT TOKENS

### **BUTTON TOKENS**

```
PRIMARY BUTTON:
├─ Background: #6366F1 (Primary color)
├─ Text: #FFFFFF (White)
├─ Hover: #4F46E5 (Darker primary)
├─ Active: #3730A3 (Even darker)
├─ Disabled: #CBD5E1 (Gray)
└─ Use: Main CTAs, primary actions

SECONDARY BUTTON:
├─ Background: #E0E7FF (Primary light)
├─ Text: #3730A3 (Primary dark)
├─ Hover: #C7D2FE (Slightly darker)
├─ Active: #A5B4FC (Even darker)
├─ Disabled: #E2E8F0 (Gray)
└─ Use: Secondary actions, alternatives

URGENT BUTTON (Tripwire/bump):
├─ Background: #EF4444 (Red urgency)
├─ Text: #FFFFFF (White)
├─ Hover: #DC2626 (Darker red)
├─ Active: #B91C1C (Even darker)
├─ Disabled: #FCA5A5 (Light red)
└─ Use: Time-limited, urgent offers

VALUE BUTTON (Upsell):
├─ Background: #10B981 (Green value)
├─ Text: #FFFFFF (White)
├─ Hover: #059669 (Darker green)
├─ Active: #047857 (Even darker)
├─ Disabled: #A7F3D0 (Light green)
└─ Use: Gains, benefits, value offers

BUTTON SIZES (See BUTTON SIZES section above)
```

### **CARD TOKENS**

```
STANDARD CARD:
├─ Background: #FFFFFF (White)
├─ Border: 1px solid #E5E7EB (Gray)
├─ Shadow: Level 2 (subtle)
├─ Padding: 32px (desktop), 24px (tablet), 16px (mobile)
├─ Border radius: 8px (md)
└─ Use: Content containers, product cards

HOVER CARD:
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px solid #D1D5DB (Gray)
├─ Shadow: Level 3 (lifted)
├─ Padding: Same as standard
├─ Transition: 0.2s ease-in-out
└─ Use: Interactive cards on hover

FEATURED/PREMIUM CARD:
├─ Background: #FFFFFF (White)
├─ Border: 2px solid #6366F1 (Primary)
├─ Shadow: Level 4 (elevated)
├─ Padding: 40px (desktop)
├─ Border radius: 12px (lg)
├─ Accent: #6366F1 badge at top
└─ Use: Premium offers, featured products

ALERT/URGENT CARD:
├─ Background: #FEF2F2 (Red tint)
├─ Border: 2px solid #EF4444 (Red)
├─ Shadow: Level 3
├─ Padding: 32px
├─ Border radius: 8px
├─ Icon: Warning icon in corner
└─ Use: Urgent offers, limited availability
```

### **INPUT TOKENS**

```
TEXT INPUT:
├─ Background: #FFFFFF (White)
├─ Border: 1px solid #D1D5DB (Gray)
├─ Text color: #111827 (Gray 900)
├─ Placeholder: #9CA3AF (Gray 400)
├─ Padding: 12px (vertical), 16px (horizontal)
├─ Height: 44px (minimum tap target)
├─ Border radius: 6px (sm)
├─ Font size: 16px
├─ Focus: Border color #6366F1 (Primary)
└─ Use: Form inputs, text fields

ERROR INPUT:
├─ Background: #FEF2F2 (Red tint)
├─ Border: 2px solid #EF4444 (Red)
├─ Text color: #111827 (Gray 900)
├─ Error text: #DC2626 (Red dark), 12px font
├─ Padding: 12px
├─ Height: 44px
└─ Use: Invalid/error states

SUCCESS INPUT:
├─ Background: #F0FDF4 (Green tint)
├─ Border: 2px solid #10B981 (Green)
├─ Text color: #111827 (Gray 900)
├─ Checkmark: #10B981 (Green), on right
├─ Padding: 12px
├─ Height: 44px
└─ Use: Valid/success states
```

---

## 🎯 CONTEXT-SPECIFIC TOKENS

### **URGENCY DESIGN TOKENS**

```
NO URGENCY (Evergreen product):
├─ Primary color: Blue (#3B82F6) or Primary (#6366F1)
├─ Secondary: Neutral (#D1D5DB gray)
├─ Accent: Green (#10B981) for benefits
├─ Font weight: Regular (400) for body
├─ Shadows: Level 1-2 (subtle)
├─ Animation: None or very subtle
└─ Feeling: Calm, professional, timeless

MILD URGENCY (Limited availability):
├─ Primary color: Primary (#6366F1)
├─ Secondary: Amber (#F59E0B) for attention
├─ Accent: Green (#10B981) for value
├─ Font weight: Medium (500) for highlights
├─ Shadows: Level 2-3 (noticeable)
├─ Animation: Slow (5s+ cycle)
└─ Feeling: Available but not desperate

MEDIUM URGENCY (Time-based offer):
├─ Primary color: Orange (#F97316)
├─ Secondary: Red (#EF4444) for countdown
├─ Accent: Green (#10B981) for savings
├─ Font weight: Semibold (600) for emphasis
├─ Shadows: Level 3-4 (significant)
├─ Animation: Medium speed (3s+ cycle)
└─ Feeling: Time is running out

HIGH URGENCY (Flash sale, limited spots):
├─ Primary color: Red (#EF4444)
├─ Secondary: Orange (#F97316) for hot
├─ Accent: Amber (#F59E0B) for countdown
├─ Font weight: Bold (700) for urgency
├─ Shadows: Level 4-5 (prominent)
├─ Animation: Fast (2s cycle)
├─ Animation: Pulse glow on CTA
└─ Feeling: Last chance, act now

CRITICAL URGENCY (Tripwire, fire sale):
├─ Primary color: Red (#DC2626) - darker, more serious
├─ Secondary: Yellow (#FCD34D) - maximum attention
├─ Accent: Orange (#F97316) - hot, urgent
├─ Font weight: Bold (700) all headlines
├─ Font size: 160%+ for urgency text
├─ Shadows: Level 5 (maximum)
├─ Animation: Aggressive pulsing, color shifts
├─ Full-screen: Modal or interstitial (can't ignore)
└─ Feeling: NOW or lose forever
```

### **BUYER PERSONA DESIGN TOKENS**

```
LUXURY/HIGH-TICKET BUYER:
├─ Colors: Purple (#7C3AED), Gold (#FBBF24), Dark navy
├─ Fonts: Serif headlines (Playfair Display), elegant
├─ Spacing: Generous, lots of whitespace (luxury signal)
├─ Shadows: Subtle (less is more in luxury)
├─ Imagery: Professional, lifestyle, aspirational
├─ Materials: Gold accents, premium feel
└─ Example: $1000+ coaching, luxury products

MODERN/TECH-SAVVY BUYER:
├─ Colors: Teals (#06B6D4), purples (#A855F7), blacks
├─ Fonts: Geometric sans-serif (Inter, Poppins)
├─ Spacing: Tight, efficient, modern
├─ Shadows: Strong, clear hierarchy
├─ Imagery: Tech illustrations, minimalist, bold
├─ Effects: Gradient backgrounds, modern animations
└─ Example: SaaS, apps, digital products

TRUSTWORTHY/CORPORATE BUYER:
├─ Colors: Blues (#3B82F6), grays, blacks
├─ Fonts: Clean sans-serif (Inter, Roboto), traditional
├─ Spacing: Structured, organized, clear
├─ Shadows: Subtle, professional
├─ Imagery: Professional photos, team pictures, data
├─ Effects: Minimal, businesslike
└─ Example: B2B software, courses, consulting

ENERGETIC/FUN BUYER:
├─ Colors: Bright, saturated (reds, yellows, oranges)
├─ Fonts: Bold sans-serif, playful (Poppins, Montserrat)
├─ Spacing: Dynamic, varied, playful
├─ Shadows: Strong, pop-out effects
├─ Imagery: Vibrant, lifestyle, authentic, real people
├─ Effects: Animations, gradients, bold patterns
└─ Example: Coaching, lifestyle, social courses

BUDGET-CONSCIOUS BUYER:
├─ Colors: Green (#10B981) emphasis, neutral grays
├─ Fonts: Clean, readable, no-nonsense
├─ Spacing: Efficient, content-focused
├─ Shadows: Subtle (save "weight" for value messaging)
├─ Imagery: Value-focused, ROI clear
├─ Effects: None (focus on savings/value message)
└─ Example: Downsells, budget courses, group programs
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
MOBILE FIRST APPROACH:

Mobile:
├─ Breakpoint: 0px - 768px
├─ Columns: 1 column (full-width)
├─ Padding: 16-24px
├─ Font size: 14-16px base
├─ Button height: 44px minimum
├─ Spacing: 8-16px gaps
└─ Priority: Content legibility > everything

Tablet:
├─ Breakpoint: 768px - 1200px
├─ Columns: 2 columns (or flexible)
├─ Padding: 24-32px
├─ Font size: 16px base
├─ Button height: 44-48px
├─ Spacing: 16-24px gaps
└─ Priority: Content + whitespace balance

Desktop:
├─ Breakpoint: 1200px+
├─ Columns: 3+ columns (or flexible)
├─ Padding: 32-48px
├─ Font size: 16px base
├─ Button height: 44-56px
├─ Spacing: 24-48px gaps
└─ Priority: Premium presentation + whitespace

RULES:
├─ Mobile-first: Design mobile first, add desktop features
├─ Touch targets: Minimum 44px (accessibility)
├─ Text readability: Maximum 75 characters per line
├─ Images: Responsive with max-width: 100%
├─ Grids: Flexible, not fixed-width on mobile
└─ Test: Always test on real devices (not just browsers)
```

---

## 🎬 ANIMATION TOKENS

### **TRANSITION SPEEDS**

```
INSTANT (No animation):
├─ Duration: 0ms
├─ Use: Hover states on text, no motion needed
└─ Example: Text color change on link hover

FAST:
├─ Duration: 0.15s - 0.2s
├─ Use: Quick feedback, button clicks, state changes
├─ Easing: ease-in-out (cubic-bezier(0.4, 0, 0.2, 1))
└─ Example: Button scale on click, input focus

NORMAL:
├─ Duration: 0.3s - 0.4s
├─ Use: Standard transitions, card hovers
├─ Easing: ease-in-out
└─ Example: Card elevation on hover

SLOW:
├─ Duration: 0.6s - 0.8s
├─ Use: Page transitions, major state changes
├─ Easing: ease-in-out
└─ Example: Modal fade-in

VERY SLOW:
├─ Duration: 1s - 1.5s
├─ Use: Looping animations, pulse effects
├─ Easing: ease-in-out
└─ Example: Pulsing CTA button

NEVER USE:
├─ ✗ Animations > 2 seconds (feels slow)
├─ ✗ Jerky easing (ease-in-out is safest)
├─ ✗ More than 1 animation per element (chaos)
└─ ✗ Movement on small screens (battery drain)
```

### **ANIMATION EXAMPLES**

```
PULSE (Attention):
├─ Duration: 2s infinite
├─ Effect: Opacity 1 → 0.7 → 1 (subtle breathing)
├─ Easing: ease-in-out
├─ Use: Important CTAs, emphasis
└─ CSS: @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

SCALE (Hover):
├─ Duration: 0.2s
├─ Effect: scale(1) → scale(1.05) on hover
├─ Easing: ease-out
├─ Use: Interactive elements, buttons
└─ CSS: transform: scale(1.05);

GLOW (Urgency):
├─ Duration: 1.5s infinite
├─ Effect: box-shadow glow effect
├─ Easing: ease-in-out
├─ Use: Urgent CTAs, time-limited offers
└─ CSS: box-shadow animation with color shifts

SLIDE (Entrance):
├─ Duration: 0.4s
├─ Effect: translateY(-20px) → translateY(0)
├─ Easing: ease-out
├─ Use: Modal entrance, element appearance
└─ CSS: transform: translateY(0); from translateY(-20px);

FADE (Soft):
├─ Duration: 0.3s
├─ Effect: opacity 0 → 1
├─ Easing: ease-in
├─ Use: Background transitions, content fade
└─ CSS: opacity: 1; from opacity: 0;
```

---

## 🎨 FIGMA IMPLEMENTATION

### **CREATE THESE IN FIGMA:**

```
STEP 1: Color Styles
├─ Create folder: "Colors"
├─ Create styles for EVERY hex value above
├─ Naming: "Color / [Category] / [Name]"
│  └─ Example: "Color / Urgency / Red Alert"
├─ Export: Add to color library
└─ Share: With entire team

STEP 2: Typography Styles
├─ Create folder: "Typography"
├─ Create styles for each size + weight combo
├─ Naming: "Typography / [Size] / [Weight]"
│  └─ Example: "Typography / Headline Large / Bold"
├─ Include: Font family, size, weight, line height, letter spacing
└─ Share: With entire team

STEP 3: Component Library
├─ Create folder: "Components"
├─ Create components for: Button, Card, Input, etc.
├─ Use color styles (not fixed colors)
├─ Use typography styles (not fixed text)
├─ Document: Variants, usage, examples
└─ Share: Read-only to other team members

STEP 4: Spacing Guide
├─ Create artboard: "Spacing Reference"
├─ Show all spacing values: 8px, 16px, 24px, etc.
├─ Annotate usage
└─ Keep as reference

STEP 5: Grid System
├─ Enable: 8px grid in all files
├─ Enable: Column grid (12 columns)
├─ Document: In guide file
└─ Train: All designers on grid usage

SYNC TOKENS:
├─ Use: Figma Design Tokens (beta)
├─ Or: Manual updates (simpler)
├─ Frequency: Update weekly
├─ Communicate: Notify team of changes
```

---

## ✅ IMPLEMENTATION CHECKLIST

```
BEFORE FIRST MOCKUP:
☐ Copy all hex colors to Figma Color Styles
☐ Create typography styles in Figma
☐ Setup 8px grid in all files
☐ Create master design system file
☐ Test all colors in light + dark mode
☐ Verify WCAG contrast (4.5:1 minimum)
☐ Bookmark token reference
☐ Save this file locally + in Google Drive
☐ Share with @aiox-master + CXO for validation
☐ Get approval before using in designs

DURING DESIGN:
✓ Always use Figma styles (never manually set colors/fonts)
✓ Follow spacing rules (8px multiples)
✓ Respect WCAG accessibility
✓ Test responsiveness at each breakpoint
✓ Use components from library
✓ Document custom choices (if you deviate)

AFTER DELIVERY:
✓ Export specs with all token values
✓ Include color hex, font name, spacing values
✓ Document any custom choices + why
✓ Provide to @dev with design handoff
```

---

**Status:** ✅ LIVE — Copy to Figma + project files NOW  
**Usage:** Reference for EVERY mockup you create  
**Update Frequency:** Review quarterly, update as needed  
**Owner:** Design System (maintained by @product-design-expert + CXO)

