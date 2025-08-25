// Vivenu API Types based on documentation

export interface VivenuEvent {
  _id: string;
  sellerId: string;
  name: string;
  slogan?: string;
  description?: string;
  locationName?: string;
  locationStreet?: string;
  locationCity?: string;
  locationPostal?: string;
  locationCountry?: string;
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  sellStart?: string; // ISO timestamp - when ticket sales start
  sellEnd?: string; // ISO timestamp
  maxAmount?: number;
  maxAmountPerOrder?: number;
  status?: 'PUBLISHED' | 'DRAFT' | 'CANCELLED' | 'POSTPONED' | 'SOLDOUT';
  tickets?: VivenuTicketType[];
  createdAt: string;
  updatedAt: string;
  meta?: Record<string, any>;
}

export interface VivenuTicketType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  amount: number; // Total capacity
  active: boolean;
  sold?: number; // Tickets sold (might not always be available)
  available?: number; // Tickets available
  categoryRef?: string;
  sortingKey?: number;
  taxRate?: number;
  meta?: Record<string, any>;
}

export interface VivenuTicket {
  _id: string;
  sellerId: string;
  eventId: string;
  ticketTypeId: string;
  ticketName: string;
  createdAt: string;
  updatedAt: string;
  status: 'VALID' | 'INVALID' | 'RESERVED' | 'DETAILSREQUIRED' | 'BLANK';
  token: string;
  barcode: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  currency?: string;
  originalPrice?: number;
  price?: number;
  transactionId?: string;
  meta?: Record<string, any>;
}

export interface VivenuListResponse<T> {
  rows: T[];
  total: number;
  skip?: number;
  top?: number;
}

export interface VivenuWebhookPayload {
  id: string;
  sellerId: string;
  webhookId?: string;
  type: 'event.updated' | 'ticket.created' | 'ticket.updated';
  mode: 'prod' | 'dev' | 'test';
  data: {
    event?: VivenuEvent;
    ticket?: VivenuTicket;
  };
}

export interface EventMetrics {
  eventId: string;
  eventName: string;
  eventDate: string;
  salesStartDate?: string;
  region: string;
  status?: string;
  totalCapacity: number;
  totalSold: number;
  totalAvailable: number;
  percentSold: number;
  ticketTypes: TicketTypeMetrics[];
  lastUpdated: string;
}

export interface TicketTypeMetrics {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  available: number;
}