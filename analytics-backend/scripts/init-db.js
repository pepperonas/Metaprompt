#!/usr/bin/env node

/**
 * Datenbank-Initialisierungs-Script
 * Usage: node scripts/init-db.js
 */

import { initDatabase } from '../database.js';

console.log('Initializing database...');
initDatabase();
console.log('✅ Database initialized successfully!');

process.exit(0);
