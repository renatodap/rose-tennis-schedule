<objective>
Create the foundational design system for a world-class tennis team management app.
This establishes the atomic building blocks that every other component will use.
A $100M design investment means obsessive attention to every pixel, every color, every interaction.
</objective>

<context>
Rose-Hulman tennis team app needing a stunning redesign.
Direction: Bold Athletic with modern maroon reinterpretation.
Animations: Subtle micro-interactions (hover states, smooth transitions).
Tech: Next.js 14, Tailwind CSS, Radix UI, Framer Motion.

Current brand color: #800000 (maroon) - needs modern evolution.
Target: Mobile-first, gorgeous, intuitive, minimalist but impactful.

@tailwind.config.ts - Current Tailwind configuration
@app/globals.css - Current global styles
@lib/constants.ts - Current brand colors
</context>

<design_philosophy>
This is what a $100M design investment looks like:
1. OBSESSIVE CONSISTENCY - Every spacing value, every shadow, every radius is intentional
2. PURPOSEFUL MINIMALISM - Remove everything that doesn't serve the user
3. ATHLETIC ENERGY - Dynamic, powerful, confident without being aggressive
4. TOUCHABLE - Every interactive element begs to be tapped/clicked
5. BREATHABLE - Generous whitespace, content has room to shine
</design_philosophy>

<requirements>
Create a comprehensive design token system:

1. COLOR PALETTE (Modern Maroon Evolution):
   - Primary: Evolve #800000 into a sophisticated palette (deeper, richer, more dynamic)
   - Add a primary gradient (subtle, athletic feel)
   - Secondary: Cool neutrals that complement
   - Accent: Energetic highlight color (tennis ball yellow-green or electric blue)
   - Semantic: Success (going), Warning (maybe), Error (not going), Info
   - Surfaces: Multiple levels of depth (background, card, elevated, overlay)
   - Text: Primary, secondary, muted, inverse levels

2. TYPOGRAPHY SCALE:
   - Define a harmonious type scale using fluid typography
   - Display (hero), Heading (h1-h6), Body (large, default, small), Caption, Overline
   - Font weights: Book, Medium, Semibold, Bold
   - Line heights optimized for each level
   - Letter-spacing for headers vs body

3. SPACING SYSTEM:
   - 4px base unit system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96)
   - Component-specific spacing tokens
   - Section spacing for layouts

4. BORDER RADIUS SYSTEM:
   - Consistent radius scale (none, sm, md, lg, xl, 2xl, full)
   - Different contexts: buttons, cards, modals, avatars, inputs

5. SHADOW SYSTEM:
   - Subtle, layered shadows for depth without heaviness
   - Interactive shadows (hover lift, press states)
   - Elevation levels: flat, raised, floating, overlay

6. TRANSITION TOKENS:
   - Duration: fast (150ms), normal (200ms), slow (300ms), emphasis (500ms)
   - Easing: ease-out for exits, ease-in-out for morphs, spring for delights
</requirements>

<implementation>
1. Update `tailwind.config.ts`:
   - Add comprehensive color palette with semantic naming
   - Add custom spacing values
   - Add typography scale
   - Add animation keyframes for micro-interactions
   - Add custom shadows

2. Update `app/globals.css`:
   - Define CSS custom properties for all tokens
   - Add dark mode variables
   - Add utility classes for common patterns
   - Add base styles for focus states (accessibility with style)
   - Remove any generic/default styles

3. Create `lib/design-tokens.ts`:
   - Export typed design token constants for use in JS
   - Animation configurations for Framer Motion
   - Semantic color mappings
</implementation>

<output>
Files to modify/create:
- `./tailwind.config.ts` - Complete design token configuration
- `./app/globals.css` - CSS custom properties and base styles
- `./lib/design-tokens.ts` - TypeScript design token exports
</output>

<quality_bar>
When complete, opening globals.css should feel like looking at a work of art.
Every value should be intentional. No magic numbers.
The palette should make designers weep with joy.
</quality_bar>

<verification>
Before declaring complete:
- All colors pass WCAG AA contrast requirements
- Typography scale creates clear visual hierarchy
- Spacing system covers all common use cases
- Shadows look premium on both light and dark backgrounds
- Dark mode variables are properly defined
</verification>
