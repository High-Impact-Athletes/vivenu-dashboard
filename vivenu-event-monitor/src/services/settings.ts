interface SettingsInterface {
  getSoldSuffix(): string;
  getAvailableSuffix(): string;
  getMaxTicketTypes(): number;
  getMasterFullRange(): string;
  getFullSheetRange(sheetName: string, startCell: string): string;
  getTicketTypesSheetName(): string;
  getEventsSheetName(): string;
}

class Settings implements SettingsInterface {
  getSoldSuffix(): string {
    return ' - Sold';
  }

  getAvailableSuffix(): string {
    return ' - Available';
  }

  getMaxTicketTypes(): number {
    return 50;
  }

  getEventsSheetName(): string {
    return 'Events';
  }

  getTicketTypesSheetName(): string {
    return 'Ticket Types';
  }

  getMasterFullRange(): string {
    return `${this.getEventsSheetName()}!A1`;
  }

  getFullSheetRange(sheetName: string, startCell: string): string {
    return `${sheetName}!${startCell}`;
  }
}

export const settings = new Settings();