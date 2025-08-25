// Types for tracking changes and historical data

export interface SalesDateChange {
  eventId: string;
  eventName: string;
  region: string;
  changeType: 'sellStart' | 'sellEnd' | 'ticketSalesStart' | 'ticketSalesEnd';
  field: string;
  previousValue: string | null;
  newValue: string | null;
  changedAt: string;
  source: 'webhook' | 'polling';
  ticketTypeId?: string; // For ticket-level changes
  ticketTypeName?: string;
}

export interface EventHistory {
  eventId: string;
  eventName: string;
  region: string;
  sellStart?: string;
  sellEnd?: string;
  status?: string;
  lastSeen: string;
  changes: SalesDateChange[];
}

export interface TicketSalesVelocity {
  eventId: string;
  ticketTypeId: string;
  timestamp: string;
  soldCount: number;
  availableCount: number;
  salesRate?: number; // tickets per hour
}

export interface SalesAlert {
  id: string;
  eventId: string;
  eventName: string;
  region: string;
  alertType: 'salesDateChanged' | 'fastSelling' | 'slowSelling' | 'soonSoldOut';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  createdAt: string;
  acknowledged: boolean;
}