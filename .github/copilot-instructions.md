# Copilot Instructions - DIAPSA

## Project Overview
Corporate website for **Grupo DIAPSA**, an industrial predictive maintenance company. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Architecture

### Component Hierarchy (Atomic Design)
- **atoms/** - Base UI elements (`Button`, `Logo`) - reusable, stateless
- **molecules/** - Composite components (`PageHeader`, `NavBar`, `TopBar`, `WipState`)
- **organisms/** - Page sections (`Hero`, `AboutUs`, `Footer`, `ContactForm`, `TabsSection`)
- **layouts/** - Reserved for layout wrappers (currently empty)

### Route Structure
```
app/
  layout.tsx      # Root layout with Header + Footer
  page.tsx        # Home - composes organisms (Hero, AboutUs, TabsSection, etc.)
  acerca-de/      # Uses PageHeader + WipState placeholder
  cursos/         # Uses PageHeader + WipState placeholder  
  metodologia/    # Uses PageHeader + WipState placeholder
  servicios/
    page.tsx      # Main services page
    monitoreo-condicion/
      page.tsx    # Monitoreo de condición listing page
      [slug]/     # Dynamic service detail pages
```

## Key Conventions

### Brand Colors (defined in globals.css)
```css
--primary: #002e46;   /* Dark blue - main brand */
--secondary: #fc9f01; /* Orange/yellow - accents */
--tertiary: #6b7280;  /* Gray */
```
Use Tailwind classes: `bg-primary`, `text-secondary`, `border-secondary`

### Button Component Usage
```tsx
// Solid variants (default)
<Button variant="primary">Botón primario</Button>
<Button variant="secondary">Botón secundario</Button>
<Button variant="tertiary">Botón terciario</Button>

// Ghost variants (light - for light backgrounds)
<Button variant="primary" ghost ghostVariant="light">Outlined</Button>

// Ghost variants (dark - for dark backgrounds, navbars, etc) - DEFAULT
<Button variant="primary" ghost>Contacto</Button>
<Button variant="primary" ghost ghostVariant="dark">Contacto</Button>

// Disabled state
<Button disabled>Deshabilitado</Button>
```

**Ghost Variants Explanation:**
- `ghostVariant="light"`: Use on light backgrounds (less common)
- `ghostVariant="dark"` or `ghostVariant="auto"` (default): Use on dark backgrounds - uses secondary color for contrast
- Default ghost uses secondary color for better visibility on dark backgrounds (navbar, hero)

### Client Components
Use `"use client"` directive for:
- Components with `useState`, `useEffect` hooks
- Interactive components (forms, scroll handlers)

### Static Data
Store JSON data in `data/` folder (e.g., `data/blog.json`)

### Images
- Place in `public/images/`
- Use `next/image` with `fill` + `object-cover` for backgrounds
- Hero backgrounds: `fondo-hero.webp`, `fondo-mantenimiento.webp`

### PageHeader Pattern
For subpages, use the `PageHeader` molecule:
```tsx
<PageHeader title="TÍTULO" subtitle="Descripción opcional" />
```

### NavBar Component
- **Sticky positioning**: Navbar stays at top while scrolling
- **Scroll effect**: Shadow and border appear when scrolling down
- **Dropdown menu**: "Servicios" has a dropdown with options
- **Ghost button**: "Contacto" button uses `ghost ghostVariant="auto"` for dark backgrounds
- **Passive scroll listener**: Optimized for performance

### WIP Placeholder
For pages under construction, use `WipState` component from `components/molecules/wip/`

## Development Commands
```bash
npm run dev    # Start dev server (localhost:3000)
npm run build  # Production build
npm run lint   # ESLint
```

## Path Aliases
Use `@/*` for absolute imports from project root:
```tsx
import Button from "@/components/atoms/Button";
import Hero from "@/components/organisms/Hero";
```

## Language
- UI content is in **Spanish** (target audience: Mexico/Latin America)
- Code/comments can be in Spanish or English
