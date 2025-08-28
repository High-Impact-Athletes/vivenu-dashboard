import settingsJson from '../../settings.json';

// TypeScript interfaces for settings
export interface GoogleSheetsSettings {
  masterSheet: string;
  range: string;
  options: {
    clearBeforeUpdate: boolean;
    maxTicketTypes: number;
    headerFormat: {
      soldSuffix: string;
      availableSuffix: string;
    };
  };
}

export interface VivenuApiSettings {
  api: {
    timeout: number;
    retryAttempts: number;
    batchSize: number;
  };
  filtering: {
    eventNameFilters: string[];
    maxEventsPerRegion: number;
    testMode: boolean;
  };
}

export interface DebuggingSettings {
  enableDetailedLogging: boolean;
  logApiResponses: boolean;
  maxLogRetention: string;
}

export interface AppSettings {
  googleSheets: GoogleSheetsSettings;
  vivenu: VivenuApiSettings;
  debugging: DebuggingSettings;
}

class SettingsService {
  private settings: AppSettings;

  constructor() {
    this.settings = this.loadSettings();
    this.validateSettings();
  }

  private loadSettings(): AppSettings {
    try {
      // In Cloudflare Workers, we'll load from the JSON file
      const settings = settingsJson as AppSettings;
      
      // Apply any environment-specific overrides here if needed
      // For example, if we had different settings for dev/prod
      
      return settings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      throw new Error('Failed to load application settings');
    }
  }

  private validateSettings(): void {
    const required = [
      'googleSheets.masterSheet',
      'googleSheets.range'
    ];

    for (const path of required) {
      if (!this.getNestedValue(this.settings, path)) {
        throw new Error(`Missing required setting: ${path}`);
      }
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Google Sheets settings
  get googleSheets(): GoogleSheetsSettings {
    return this.settings.googleSheets;
  }

  getMasterSheetName(): string {
    return this.settings.googleSheets.masterSheet;
  }

  getMasterRange(): string {
    return this.settings.googleSheets.range;
  }

  shouldClearBeforeUpdate(): boolean {
    return this.settings.googleSheets.options.clearBeforeUpdate;
  }

  getMaxTicketTypes(): number {
    return this.settings.googleSheets.options.maxTicketTypes;
  }

  getSoldSuffix(): string {
    return this.settings.googleSheets.options.headerFormat.soldSuffix;
  }

  getAvailableSuffix(): string {
    return this.settings.googleSheets.options.headerFormat.availableSuffix;
  }

  // Legacy method names for compatibility
  getEventsSheetName(): string {
    return this.getMasterSheetName();
  }

  getTicketTypesSheetName(): string {
    return 'Ticket Types';
  }

  // Vivenu API settings
  get vivenu(): VivenuApiSettings {
    return this.settings.vivenu;
  }

  getApiTimeout(): number {
    return this.settings.vivenu.api.timeout;
  }

  getMaxEventsPerRegion(): number {
    return this.settings.vivenu.filtering.maxEventsPerRegion;
  }

  isTestMode(): boolean {
    return this.settings.vivenu.filtering.testMode;
  }

  getEventNameFilters(): string[] {
    return this.settings.vivenu.filtering.eventNameFilters;
  }

  // Debugging settings
  get debugging(): DebuggingSettings {
    return this.settings.debugging;
  }

  isDetailedLoggingEnabled(): boolean {
    return this.settings.debugging.enableDetailedLogging;
  }

  shouldLogApiResponses(): boolean {
    return this.settings.debugging.logApiResponses;
  }

  // Utility methods
  getFullSheetRange(sheetName: string, range: string): string {
    return `${sheetName}!${range}`;
  }

  getMasterFullRange(): string {
    return this.getFullSheetRange(this.getMasterSheetName(), this.getMasterRange());
  }

  // Method to get settings for a specific component
  getSettingsFor(component: 'googleSheets' | 'vivenu' | 'debugging'): any {
    return this.settings[component];
  }
}

// Export a singleton instance
export const settings = new SettingsService();

// Export the settings service class for testing
export { SettingsService };