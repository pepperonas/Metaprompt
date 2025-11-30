#!/usr/bin/env node

/**
 * Lizenzschlüssel-Generator für Metaprompt
 * 
 * Generiert Lizenzschlüssel im Format: MP-XXXX-XXXX (8 Hex-Zeichen)
 * 
 * Usage:
 *   node scripts/generate-license-keys.js [anzahl]
 * 
 * Beispiel:
 *   node scripts/generate-license-keys.js 10
 */

const crypto = require('crypto');

function generateLicenseKey() {
  // Generiere 8 zufällige Hex-Zeichen
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  return `MP-${part1}-${part2}`;
}

function validateLicenseKey(key) {
  const pattern = /^MP-[0-9A-F]{4}-[0-9A-F]{4}$/i;
  return pattern.test(key);
}

// Anzahl der zu generierenden Schlüssel (Standard: 1)
const count = parseInt(process.argv[2]) || 1;

console.log(`\nGeneriere ${count} Lizenzschlüssel...\n`);
console.log('─'.repeat(50));

const keys = [];
for (let i = 0; i < count; i++) {
  const key = generateLicenseKey();
  keys.push(key);
  
  // Validiere den generierten Schlüssel
  if (!validateLicenseKey(key)) {
    console.error(`❌ Fehler: Generierter Schlüssel ist ungültig: ${key}`);
    process.exit(1);
  }
  
  console.log(`${i + 1}. ${key}`);
}

console.log('─'.repeat(50));
console.log(`\n✅ ${count} gültige Lizenzschlüssel generiert!\n`);

// Optional: Als JSON ausgeben
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(keys, null, 2));
}

// Optional: In Datei speichern
if (process.argv.includes('--save')) {
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(process.cwd(), 'license-keys.txt');
  
  const content = keys.map((key, i) => `${i + 1}. ${key}`).join('\n') + '\n';
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`💾 Schlüssel gespeichert in: ${outputPath}\n`);
}

