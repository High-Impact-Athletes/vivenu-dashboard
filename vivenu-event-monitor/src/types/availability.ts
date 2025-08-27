// Types for ticket availability tracking

export interface TicketTypeAvailability {
  id: string;
  name: string;
  capacity: number;
  sold: number;
  available: number;
  percentSold: number;
  status: 'available' | 'limited' | 'soldout';
  price?: number;
}

export interface ShopAvailability {
  shopId: string;
  shopName: string;
  sold: number;
  percentOfTotal: number;
}

export interface EventAvailability {
  eventId: string;
  eventName: string;
  eventDate: string;
  region: string;
  ticketTypes: TicketTypeAvailability[];
  totals: {
    capacity: number;
    sold: number;
    available: number;
    percentSold: number;
    status: 'available' | 'limited' | 'soldout';
  };
  charityStats?: {
    capacity: number;
    sold: number;
    available: number;
    percentSold: number;
  };
  shops?: ShopAvailability[];
  lastUpdated: string;
  cacheExpiry?: string;
}

export interface DashboardData {
  events: EventAvailability[];
  summary: {
    totalEvents: number;
    totalCapacity: number;
    totalSold: number;
    totalAvailable: number;
    avgPercentSold: number;
    eventsNearSoldOut: number;
    eventsSoldOut: number;
  };
  lastRefresh: string;
}

export interface AvailabilityCache {
  data: EventAvailability;
  cachedAt: string;
  expiresAt: string;
}

export interface AvailabilityAlert {
  eventId: string;
  eventName: string;
  ticketTypeId?: string;
  ticketTypeName?: string;
  alertType: 'near_soldout' | 'soldout' | 'sales_started' | 'sales_ended';
  threshold?: number;
  currentAvailability: number;
  timestamp: string;
}