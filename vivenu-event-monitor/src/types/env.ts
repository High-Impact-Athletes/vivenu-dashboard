export interface Env {
  // KV Namespace binding
  KV: KVNamespace;

  // Environment variables
  GOOGLE_SHEET_ID?: string;
  ENVIRONMENT?: 'development' | 'staging' | 'production';

  // Secrets (added via wrangler secret)
  VIVENU_SECRET?: string;
  
  // Regional API Keys
  DACH_API?: string;
  FRANCE_API?: string;
  ITALY_API?: string;
  BENELUX_API?: string;
  SWITZERLAND_API?: string;
  USA_API?: string;
  CANADA_API?: string;
  AUSTRALIA_API?: string;
  NORWAY_API?: string;

  // Google Sheets Service Account
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_PRIVATE_KEY?: string;
}

export interface RegionConfig {
  name: string;
  apiKey: keyof Env;
  baseUrl: 'PROD' | 'DEV';
  enabled: boolean;
}