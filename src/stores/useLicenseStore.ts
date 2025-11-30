import { create } from 'zustand';

interface LicenseStore {
  isLicensed: boolean;
  daysSinceFirstLaunch: number;
  dialogShownCount: number;
  loading: boolean;
  loadLicenseStatus: () => Promise<void>;
  activateLicense: (key: string) => Promise<boolean>;
  dismissDialog: (days?: number) => Promise<void>;
  dismissDialogPermanently: () => Promise<void>;
  shouldShowDialog: () => Promise<boolean>;
}

export const useLicenseStore = create<LicenseStore>((set, get) => ({
  isLicensed: false,
  daysSinceFirstLaunch: 0,
  dialogShownCount: 0,
  loading: false,

  loadLicenseStatus: async () => {
    set({ loading: true });
    try {
      const isLicensed = await window.mrp.license.isLicensed();
      const daysSinceFirstLaunch = await window.mrp.license.getDaysSinceFirstLaunch();
      const dialogShownCount = await window.mrp.license.getDialogShownCount();
      
      set({
        isLicensed,
        daysSinceFirstLaunch,
        dialogShownCount,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load license status:', error);
      set({ loading: false });
    }
  },

  activateLicense: async (key: string) => {
    try {
      const success = await window.mrp.license.activateLicense(key);
      if (success) {
        await get().loadLicenseStatus();
      }
      return success;
    } catch (error) {
      console.error('Failed to activate license:', error);
      return false;
    }
  },

  dismissDialog: async (days: number = 7) => {
    try {
      await window.mrp.license.dismissDialog(days);
      await get().loadLicenseStatus();
    } catch (error) {
      console.error('Failed to dismiss dialog:', error);
    }
  },

  dismissDialogPermanently: async () => {
    try {
      await window.mrp.license.dismissDialogPermanently();
      await get().loadLicenseStatus();
    } catch (error) {
      console.error('Failed to dismiss dialog permanently:', error);
    }
  },

  shouldShowDialog: async () => {
    try {
      return await window.mrp.license.shouldShowSupportDialog();
    } catch (error) {
      console.error('Failed to check if dialog should show:', error);
      return false;
    }
  },
}));

