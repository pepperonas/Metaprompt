import Store from 'electron-store';

interface LicenseData {
  firstLaunchDate: string | null;
  licenseKey: string | null;
  dialogDismissedUntil: string | null; // ISO date string
  dialogShownCount: number;
  dialogPermanentlyDismissed: boolean;
}

const licenseStore = new Store<LicenseData>({
  name: 'mrp-license',
  defaults: {
    firstLaunchDate: null,
    licenseKey: null,
    dialogDismissedUntil: null,
    dialogShownCount: 0,
    dialogPermanentlyDismissed: false,
  },
});

/**
 * Initialisiert das erste Startdatum, falls noch nicht gesetzt
 */
export const initializeFirstLaunch = (): void => {
  const current = licenseStore.get('firstLaunchDate');
  if (!current) {
    licenseStore.set('firstLaunchDate', new Date().toISOString());
  }
};

/**
 * Gibt zurück, ob der Support-Dialog angezeigt werden soll
 * @param forceShow - Wenn true, wird der Dialog angezeigt, auch wenn 30 Tage noch nicht vergangen sind
 */
export const shouldShowSupportDialog = (forceShow: boolean = false): boolean => {
  // Wenn bereits lizenziert, nie anzeigen
  if (isLicensed()) {
    return false;
  }

  // Wenn permanent ausgeblendet, nie anzeigen (außer bei forceShow)
  if (!forceShow && licenseStore.get('dialogPermanentlyDismissed')) {
    return false;
  }

  // Prüfe, ob Dialog temporär ausgeblendet ist (nur wenn nicht forceShow)
  if (!forceShow) {
    const dismissedUntil = licenseStore.get('dialogDismissedUntil');
    if (dismissedUntil) {
      const dismissedDate = new Date(dismissedUntil);
      const now = new Date();
      if (now < dismissedDate) {
        return false; // Noch innerhalb der 7-Tage-Pause
      }
    }
  }

  // Wenn forceShow, immer anzeigen (außer wenn lizenziert)
  if (forceShow) {
    return true;
  }

  // Prüfe, ob 30 Tage vergangen sind
  const firstLaunch = licenseStore.get('firstLaunchDate');
  if (!firstLaunch) {
    initializeFirstLaunch();
    return false; // Erster Start, noch keine 30 Tage
  }

  const daysSinceFirstLaunch = getDaysSinceFirstLaunch();
  return daysSinceFirstLaunch >= 30;
};

/**
 * Gibt die Anzahl der Tage seit dem ersten Start zurück
 */
export const getDaysSinceFirstLaunch = (): number => {
  const firstLaunch = licenseStore.get('firstLaunchDate');
  if (!firstLaunch) {
    initializeFirstLaunch();
    return 0;
  }

  const firstLaunchDate = new Date(firstLaunch);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - firstLaunchDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Blendet den Dialog für 7 Tage aus
 */
export const dismissDialog = (days: number = 7): void => {
  const now = new Date();
  const dismissedUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  licenseStore.set('dialogDismissedUntil', dismissedUntil.toISOString());
  
  // Erhöhe Zähler
  const currentCount = licenseStore.get('dialogShownCount');
  licenseStore.set('dialogShownCount', currentCount + 1);
};

/**
 * Blendet den Dialog permanent aus
 */
export const dismissDialogPermanently = (): void => {
  licenseStore.set('dialogPermanentlyDismissed', true);
};

/**
 * Validiert einen Lizenzschlüssel (Format: MP-XXXX-XXXX)
 */
export const validateLicenseKey = (key: string): boolean => {
  // Format: MP-XXXX-XXXX (8 Hex-Zeichen)
  const pattern = /^MP-[0-9A-F]{4}-[0-9A-F]{4}$/i;
  return pattern.test(key);
};

/**
 * Aktiviert eine Lizenz
 */
export const activateLicense = (key: string): boolean => {
  if (!validateLicenseKey(key)) {
    return false;
  }

  // Optional: Hier könnte ein Server-Check erfolgen
  // Für jetzt: Einfache Format-Validierung reicht

  licenseStore.set('licenseKey', key.toUpperCase());
  return true;
};

/**
 * Prüft, ob eine gültige Lizenz aktiv ist
 */
export const isLicensed = (): boolean => {
  const licenseKey = licenseStore.get('licenseKey');
  if (!licenseKey) {
    return false;
  }
  return validateLicenseKey(licenseKey);
};

/**
 * Gibt die aktuelle Lizenz zurück
 */
export const getLicenseKey = (): string | null => {
  return licenseStore.get('licenseKey');
};

/**
 * Gibt die Anzahl der Dialog-Anzeigen zurück
 */
export const getDialogShownCount = (): number => {
  return licenseStore.get('dialogShownCount');
};

/**
 * Setzt die Lizenz zurück (für Testing)
 */
export const resetLicense = (): void => {
  licenseStore.set('licenseKey', null);
  licenseStore.set('dialogPermanentlyDismissed', false);
  licenseStore.set('dialogDismissedUntil', null);
  licenseStore.set('dialogShownCount', 0);
};

