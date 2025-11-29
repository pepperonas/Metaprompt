# MRP - Design Theme Dokumentation

## Übersicht

MRP (Prompt-Optimierer) verwendet ein modernes, dunkles Design-System mit einem klaren visuellen Fokus auf Funktionalität und Benutzerfreundlichkeit. Das Theme basiert auf einem dunklen Farbschema mit einem blauen Brand-Farbton und einem orangen Akzent-Farbton.

## Farbpalette

### Primärfarben

```css
--bg-primary: #1A1C27      /* Haupt-Hintergrundfarbe (sehr dunkel blau-grau) */
--bg-secondary: #2C2E3B    /* Sekundär-Hintergrundfarbe (für Cards, Inputs) */
--brand: #4A90E2           /* Haupt-Brand-Farbe (helles Blau) */
--accent: #FF6B35          /* Akzent-Farbe (Orange) */
```

### Textfarben

```css
--text-primary: #FFFFFF    /* Primärer Text (weiß) */
--text-secondary: #B0B3C1  /* Sekundärer Text (helles Grau) */
```

### Verwendung

- **bg-primary**: Haupt-Hintergrund der Anwendung
- **bg-secondary**: Cards, Input-Felder, Buttons (secondary), Header
- **brand**: Primäre Buttons, aktive Navigation, Fokus-Ringe, Glow-Effekte
- **accent**: Akzent-Elemente (optional, für Highlights)
- **text-primary**: Haupt-Text, Überschriften
- **text-secondary**: Labels, Platzhalter, inaktive Navigation

## Typografie

### Schriftart

- **Primär**: `Inter` (Google Fonts)
- **Fallback**: `system-ui, sans-serif`

Die Inter-Schriftart wird über Google Fonts geladen und bietet eine moderne, lesbare Typografie für die gesamte Anwendung.

### Schriftgrößen

- **Überschriften**: 
  - H1: `text-2xl font-bold` (z.B. "MRP" im Header)
  - H3: `text-xl font-semibold` (Card-Titel)
- **Body-Text**: 
  - Standard: `text-base`
  - Klein: `text-sm`
  - Groß: `text-lg`

### Font-Smoothing

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

## Komponenten-Stile

### Buttons

#### Varianten

- **Primary** (`variant="primary"`):
  - Hintergrund: `bg-brand`
  - Text: `text-white`
  - Hover: `hover:bg-opacity-90`
  - Glow-Effekt: `glow-brand`
  - Fokus-Ring: `focus:ring-brand`

- **Secondary** (`variant="secondary"`):
  - Hintergrund: `bg-bg-secondary`
  - Text: `text-text-primary`
  - Hover: `hover:bg-opacity-80`

- **Danger** (`variant="danger"`):
  - Hintergrund: `bg-red-600`
  - Text: `text-white`
  - Hover: `hover:bg-red-700`

#### Größen

- **Small** (`size="sm"`): `px-3 py-1.5 text-sm`
- **Medium** (`size="md"`): `px-4 py-2 text-base` (Standard)
- **Large** (`size="lg"`): `px-6 py-3 text-lg`

### Cards

- Hintergrund: `bg-bg-secondary`
- Border-Radius: `rounded-xl` (0.75rem)
- Padding: `p-6`
- Shadow: `shadow-lg`

### Input-Felder

- Hintergrund: `bg-bg-secondary`
- Border: `border border-bg-secondary`
- Border-Radius: `rounded-lg` (0.5rem)
- Padding: `px-4 py-2`
- Text: `text-text-primary`
- Placeholder: `placeholder-text-secondary`
- Fokus: `focus:ring-2 focus:ring-brand focus:border-transparent`
- Fehler: `border-red-500`

### Select-Dropdowns

- Gleiche Basis-Styles wie Input-Felder
- Custom Dropdown-Pfeil als SVG-Background-Image
- `appearance-none` für native Styling-Kontrolle

### Textarea

- Gleiche Basis-Styles wie Input-Felder
- `resize-none` für feste Größe

## Effekte

### Glow-Effekte

```css
--glow-brand: 0 0 20px rgba(74, 144, 226, 0.3);
--glow-accent: 0 0 20px rgba(255, 107, 53, 0.3);
```

- Verwendung: Primäre Buttons, aktive Navigation
- Klasse: `.glow-brand` oder `.glow-accent`

### Transitions

- Standard-Dauer: `300ms`
- Timing-Function: `ease`
- Verwendung: Buttons, Hover-Effekte, Fokus-Übergänge

## Spacing & Layout

### Border-Radius

```css
--radius-lg: 0.5rem   /* rounded-lg */
--radius-xl: 0.75rem  /* rounded-xl */
```

- **lg**: Buttons, Input-Felder
- **xl**: Cards

### Padding & Margins

- Header-Padding: `py-4` (vertikal), `px-20` (links), `px-80` (rechts)
- Card-Padding: `p-6`
- Button-Padding: Variiert je nach Größe
- Input-Padding: `px-4 py-2`
- Navigation-Spacing: `space-x-4` zwischen Items

## Scrollbar-Styling

### Webkit-Scrollbar

- **Breite**: `8px`
- **Track**: `bg-bg-secondary`
- **Thumb**: `bg-bg-secondary` mit `border-radius: 4px`
- **Hover**: `#3C3E4B`

## Plattform-spezifische Anpassungen

### macOS

- **Title Bar**: Custom Title Bar mit Overlay
- **Padding**: Anpassung für Window-Management-Buttons
- **Drag-Region**: Unterstützung für `-webkit-app-region: drag`

```css
padding-top: env(titlebar-area-height, 0);
padding-right: env(titlebar-area-x, 0);
```

## Interaktive Zustände

### Hover

- Navigation (inaktiv): `hover:text-text-primary hover:bg-bg-primary`
- Buttons: Variiert je nach Variante
- Scrollbar-Thumb: Hellere Hintergrundfarbe

### Focus

- Alle interaktiven Elemente: `focus:ring-2 focus:ring-brand`
- Input-Felder: `focus:border-transparent` (Border wird durch Ring ersetzt)

### Active

- Navigation: `bg-brand text-white shadow-lg glow-brand`
- Buttons: Opacity-Änderungen beim Klicken

## Design-Prinzipien

### 1. Dunkles Theme

Die gesamte Anwendung verwendet ein dunkles Farbschema, das die Augen schont und sich für längere Nutzungszeiten eignet.

### 2. Klare Hierarchie

- Brand-Farbe für primäre Aktionen
- Text-Primary für wichtige Inhalte
- Text-Secondary für unterstützende Informationen

### 3. Konsistente Abstände

Einheitliche Padding- und Margin-Werte schaffen ein harmonisches Layout.

### 4. Subtile Effekte

Glow-Effekte und sanfte Transitions sorgen für eine moderne, professionelle Optik ohne Ablenkung.

### 5. Zugänglichkeit

- Klare Kontraste zwischen Text und Hintergrund
- Fokus-Indikatoren für Tastaturnavigation
- Lesbare Schriftgrößen

## Verwendung in Komponenten

### Header

- Hintergrund: `bg-bg-secondary`
- Border: `border-b border-bg-primary`
- Aktive Navigation: Brand-Farbe mit Glow-Effekt
- Inaktive Navigation: Text-Secondary mit Hover-Effekt

### Dashboard

- Cards mit `bg-bg-secondary`
- Aktive Metaprompt: Blauer Border (`border-2 border-blue-500`) mit Hintergrund (`bg-blue-500 bg-opacity-5`)
- Standard-Metaprompt (aktiv): Brand-Farbe (`border-brand bg-brand bg-opacity-5`)

### Metaprompts-Seite

- Gleiche Card-Struktur
- Highlight für aktive Metaprompts
- Standard-Metaprompt: Brand-Farbe wenn aktiv

## CSS-Variablen Übersicht

Alle Theme-Variablen sind in `src/styles/globals.css` definiert:

```css
:root {
  --bg-primary: #1A1C27;
  --bg-secondary: #2C2E3B;
  --brand: #4A90E2;
  --accent: #FF6B35;
  --text-primary: #FFFFFF;
  --text-secondary: #B0B3C1;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --transition: 300ms ease;
  --glow-brand: 0 0 20px rgba(74, 144, 226, 0.3);
  --glow-accent: 0 0 20px rgba(255, 107, 53, 0.3);
}
```

Diese Variablen werden sowohl in CSS als auch in Tailwind-Konfiguration (`tailwind.config.js`) verwendet.

## Tailwind-Integration

Das Theme ist vollständig in Tailwind CSS integriert:

- Farben: `bg-brand`, `text-primary`, etc.
- Border-Radius: `rounded-lg`, `rounded-xl`
- Box-Shadow: `glow-brand`, `glow-accent` (Custom Utilities)
- Font-Family: `font-sans` (Inter)

## Best Practices

1. **Konsistenz**: Verwende immer die definierten Farben und Spacing-Werte
2. **Kontrast**: Stelle sicher, dass Text immer ausreichend Kontrast zum Hintergrund hat
3. **Interaktivität**: Alle interaktiven Elemente sollten klare Hover- und Focus-Zustände haben
4. **Glow-Effekte**: Sparsam verwenden, nur für wichtige primäre Aktionen
5. **Responsive**: Das Design ist für Desktop-Anwendungen optimiert (Electron)

