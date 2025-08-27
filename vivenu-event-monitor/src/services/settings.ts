interface SettingsInterface {
  getSoldSuffix(): string;
}

class Settings implements SettingsInterface {
  getSoldSuffix(): string {
    return ' - Sold';
  }
}

export const settings = new Settings();