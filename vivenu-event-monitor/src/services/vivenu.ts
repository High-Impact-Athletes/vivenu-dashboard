import { Env } from '../types/env';

// Region configuration
export const REGIONS = [
  { name: 'USA', apiKey: 'USA_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'DACH', apiKey: 'DACH_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'FRANCE', apiKey: 'FRANCE_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'ITALY', apiKey: 'ITALY_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'BENELUX', apiKey: 'BENELUX_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'SWITZERLAND', apiKey: 'SWITZERLAND_API', baseUrl: 'PROD' as const, enabled: true },
];

export class VivenuClient {
  public readonly region: string;
  constructor(region: string) {
    this.region = region;
  }
}

export function createVivenuClients(env: Env): VivenuClient[] {
  return REGIONS.map(region => new VivenuClient(region.name));
}