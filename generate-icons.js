const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_FILE = 'resources/icons/icon.svg';
const OUTPUT_DIR = 'resources/icons';
const ROOT_OUT = 'resources';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

async function generate() {
    console.log('🚀 Starte Icon-Generierung...');
    const pngFiles = [];
    
    for (const size of sizes) {
        const fileName = `icon-${size}.png`;
        const outputPath = path.join(OUTPUT_DIR, fileName);
        await sharp(SOURCE_FILE).resize(size, size).png().toFile(outputPath);
        console.log(`✅ ${fileName} erstellt`);
        if ([16, 32, 48, 256].includes(size)) pngFiles.push(outputPath);
    }

    console.log('🔄 Erstelle icon.ico (Windows)...');
    try {
        // png-to-ico ist ein ES-Modul, verwende dynamischen Import
        const pngToIco = (await import('png-to-ico')).default;
        const buf = await pngToIco(pngFiles);
        fs.writeFileSync(path.join(ROOT_OUT, 'icon.ico'), buf);
        console.log('✅ resources/icon.ico erstellt');
    } catch (e) { 
        console.error('Fehler ICO:', e.message);
        console.log('⚠️  Verwende alternativen Ansatz für ICO...');
        // Fallback: Verwende nur die größte PNG-Datei
        try {
            const largestPng = pngFiles[pngFiles.length - 1];
            fs.copyFileSync(largestPng, path.join(ROOT_OUT, 'icon.ico'));
            console.log('⚠️  icon.ico als PNG-Kopie erstellt (nicht optimal)');
        } catch (e2) {
            console.error('Fehler Fallback ICO:', e2.message);
        }
    }

    console.log('🔄 Erstelle icon.png (Linux)...');
    await sharp(SOURCE_FILE).resize(512, 512).png().toFile(path.join(ROOT_OUT, 'icon.png'));
    console.log('✅ resources/icon.png erstellt');

    // macOS ICNS erstellen
    if (process.platform === 'darwin') {
        console.log('🔄 Erstelle icon.icns (macOS)...');
        try {
            const iconsetDir = path.join(OUTPUT_DIR, 'icon.iconset');
            if (!fs.existsSync(iconsetDir)) fs.mkdirSync(iconsetDir, { recursive: true });

            // Erstelle alle benötigten Größen für ICNS
            const icnsSizes = [
                { size: 16, name: 'icon_16x16.png' },
                { size: 32, name: 'icon_16x16@2x.png' },
                { size: 32, name: 'icon_32x32.png' },
                { size: 64, name: 'icon_32x32@2x.png' },
                { size: 128, name: 'icon_128x128.png' },
                { size: 256, name: 'icon_128x128@2x.png' },
                { size: 256, name: 'icon_256x256.png' },
                { size: 512, name: 'icon_256x256@2x.png' },
                { size: 512, name: 'icon_512x512.png' },
                { size: 1024, name: 'icon_512x512@2x.png' }
            ];

            for (const { size, name } of icnsSizes) {
                const sourcePath = path.join(OUTPUT_DIR, `icon-${size}.png`);
                const destPath = path.join(iconsetDir, name);
                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, destPath);
                } else {
                    // Falls Größe nicht existiert, generiere sie
                    await sharp(SOURCE_FILE).resize(size, size).png().toFile(destPath);
                }
            }

            // Verwende iconutil um ICNS zu erstellen
            const icnsPath = path.join(ROOT_OUT, 'icon.icns');
            execSync(`iconutil -c icns "${iconsetDir}" -o "${icnsPath}"`, { stdio: 'inherit' });
            
            // Aufräumen
            fs.rmSync(iconsetDir, { recursive: true, force: true });
            console.log('✅ resources/icon.icns erstellt');
        } catch (e) {
            console.error('Fehler ICNS:', e.message);
            console.log('⚠️  ICNS konnte nicht erstellt werden. Stelle sicher, dass iconutil verfügbar ist.');
        }
    } else {
        console.log('⚠️  ICNS wird nur auf macOS erstellt. Überspringe...');
    }

    console.log('\n✅ Alle Icons erfolgreich generiert!');
}

generate().catch(console.error);
