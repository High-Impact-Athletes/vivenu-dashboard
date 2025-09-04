/**
 * Environment interface for the Vivenu Event Monitoring Worker.
 * 
 * PRIMARY REQUIREMENT: DATABASE_URL must be configured for PostgreSQL storage.
 * Regional API keys are required for comprehensive event data collection.
 * Google Sheets integration is optional for legacy support only.
 */
export interface Env {
  KV?: KVNamespace;
  EVENT_IDS?: KVNamespace;
  ENVIRONMENT?: 'development' | 'staging' | 'production';
  // Regional API keys (secrets via wrangler)
  USA_API?: string;
  DACH_API?: string;
  FRANCE_API?: string;
  ITALY_API?: string;
  BENELUX_API?: string;
  SWITZERLAND_API?: string;
  CANADA_API?: string;
  AUSTRALIA_API?: string;
  NORWAY_API?: string;

  // Event IDs per region (non-sensitive vars)
  FRANKFURT_EVENT?: string;
  HAMBURG_EVENT?: string;
  STUTTGART_EVENT?: string;
  VIENNA_EVENT?: string;
  KOLN_EVENT?: string;
  PARIS_EVENT?: string;
  BORDEAUX_EVENT?: string;
  TOULOUSE_EVENT?: string;
  NICE_EVENT?: string;
  LYON_EVENT?: string;
  PARISGRANDPALAIS_EVENT?: string;
  ROME_EVENT?: string;
  VERONA_EVENT?: string;
  TURIN_EVENT?: string;
  BOLOGNA_EVENT?: string;
  MAASTRICHT_EVENT?: string;
  UTRECHT_EVENT?: string;
  AMSTERDAM_EVENT?: string;
  BELGIUM_EVENT?: string;
  ROTTERDAM_EVENT?: string;
  GENEVA_EVENT?: string;
  STGALLEN_EVENT?: string;
  CHICAGO_EVENT?: string;
  DALLAS_EVENT?: string;
  ANAHEIM_EVENT?: string;
  PHOENIX_EVENT?: string;
  LASVEGAS_EVENT?: string;
  MIAMIBEACH_EVENT?: string;
  WASHINGTONDC_EVENT?: string;
  ATLANTA25_EVENT?: string;
  TORONTO_EVENT?: string;
  PERTH_EVENT?: string;
  MELBOURNE_EVENT?: string;
  BRISBANE_EVENT?: string;
  AUCKLAND_EVENT?: string;
  OSLO_EVENT?: string;
  STOCKHOLM_EVENT?: string;
  COPENHAGEN_EVENT?: string;

  // PRIMARY DATABASE (REQUIRED)
  DATABASE_URL?: string;  // Neon PostgreSQL connection string - MUST be configured

  // Legacy Google Sheets support (OPTIONAL)  
  GOOGLE_SHEET_ID?: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_PRIVATE_KEY?: string;
}