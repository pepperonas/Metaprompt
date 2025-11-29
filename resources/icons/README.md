# App Icon Assets

Dieser Ordner enthält alle Icon-Dateien für die MRP-App.

## Erwartete Dateien

Basierend auf der `electron-builder.yml` Konfiguration werden folgende Dateien benötigt:

### Windows
- `icon.ico` - ICO-Datei mit mehreren Größen (16x16, 32x32, 48x48, 256x256)

### macOS
- `icon.icns` - ICNS-Datei mit mehreren Größen (16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024)

### Linux
- `icon.png` - PNG-Datei (mindestens 512x512px empfohlen)

## Datei-Platzierung

Die Icon-Dateien müssen im **`resources/`** Hauptverzeichnis liegen (nicht in diesem Unterordner), damit `electron-builder` sie findet:

```
resources/
├── icons/          # Hier können alle Icon-Assets gespeichert werden
│   ├── icon.svg    # Vektor-Basis
│   ├── icon-16.png # 16x16px
│   ├── icon-32.png # 32x32px
│   ├── icon-48.png # 48x48px
│   ├── icon-128.png # 128x128px
│   ├── icon-256.png # 256x256px
│   ├── icon-512.png # 512x512px
│   ├── icon-1024.png # 1024x1024px
│   └── README.md   # Diese Datei
├── icon.ico        # ← Windows Icon (hier platzieren)
├── icon.icns       # ← macOS Icon (hier platzieren)
└── icon.png        # ← Linux Icon (hier platzieren)
```

## Icon-Spezifikationen

Siehe `APP_ICON.md` im Projekt-Root für detaillierte Design-Anforderungen.

## Icon-Generierung

### Von SVG zu ICO (Windows)
```bash
# Mit ImageMagick
convert icon.svg -define icon:auto-resize=16,32,48,256 icon.ico

# Oder mit online Tools wie:
# - https://convertio.co/svg-ico/
# - https://cloudconvert.com/svg-to-ico
```

### Von SVG zu ICNS (macOS)
```bash
# Mit iconutil (macOS)
mkdir icon.iconset
# Kopiere PNG-Dateien in verschiedene Größen nach icon.iconset/
iconutil -c icns icon.iconset

# Oder mit online Tools wie:
# - https://cloudconvert.com/svg-to-icns
# - https://iconverticons.com/
```

### Von SVG zu PNG (Linux)
```bash
# Mit ImageMagick
convert icon.svg -resize 512x512 icon.png

# Oder mit Inkscape
inkscape icon.svg --export-filename=icon.png --export-width=512 --export-height=512
```

