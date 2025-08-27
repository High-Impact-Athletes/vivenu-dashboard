export class EventTracker {
  constructor(kv: KVNamespace | null) {}

  async trackEvent(event: any, region: string, source: 'webhook' | 'polling'): Promise<any[]> {
    return [];
  }

  async createSalesDateAlert(change: any): Promise<void> {
    return;
  }

  async getRecentChanges(limit: number = 50): Promise<any[]> {
    return [];
  }

  async getEventHistory(eventId: string): Promise<any | null> {
    return null;
  }
}
import { EventHistory, SalesDateChange, SalesAlert } from '../types/tracking';
import { VivenuEvent } from '../types/vivenu';
import { log } from './validation';

export class EventTracker {
  private kv: KVNamespace | null;

  constructor(kv: KVNamespace | null) {
    this.kv = kv;
  }

  async trackEvent(event: VivenuEvent, region: string, source: 'webhook' | 'polling'): Promise<SalesDateChange[]> {
    if (!this.kv) {
      // If KV is not available, return empty changes
      return [];
    }
    
    const historyKey = `event_history:${event._id}`;
    const existingHistoryJson = await this.kv.get(historyKey);
    const existingHistory: EventHistory | null = existingHistoryJson 
      ? JSON.parse(existingHistoryJson) 
      : null;

    const changes: SalesDateChange[] = [];
    const now = new Date().toISOString();

    // Check for sales date changes
    if (existingHistory) {
      // Check sellStart changes
      if (existingHistory.sellStart !== event.sellStart) {
        changes.push({
          eventId: event._id,
          eventName: event.name,
          region,
          changeType: 'sellStart',
          field: 'sellStart',
          previousValue: existingHistory.sellStart || null,
          newValue: event.sellStart || null,
          changedAt: now,
          source
        });
      }

      // Check sellEnd changes
      if (existingHistory.sellEnd !== event.sellEnd) {
        changes.push({
          eventId: event._id,
          eventName: event.name,
          region,
          changeType: 'sellEnd',
          field: 'sellEnd',
          previousValue: existingHistory.sellEnd || null,
          newValue: event.sellEnd || null,
          changedAt: now,
          source
        });
      }
    }

    // Update event history
    const updatedHistory: EventHistory = {
      eventId: event._id,
      eventName: event.name,
      region,
      sellStart: event.sellStart,
      sellEnd: event.sellEnd,
      status: event.status,
      lastSeen: now,
      changes: existingHistory ? [...existingHistory.changes, ...changes] : changes
    };

    // Store updated history
    if (this.kv) {
      await this.kv.put(historyKey, JSON.stringify(updatedHistory), {
        expirationTtl: 365 * 24 * 60 * 60 // Keep for 1 year
      });
    }

    // Log changes
    if (changes.length > 0) {
      log('info', `Detected ${changes.length} sales date changes for event ${event.name}`, {
        eventId: event._id,
        eventName: event.name,
        region,
        changes: changes.map(c => ({
          type: c.changeType,
          from: c.previousValue,
          to: c.newValue
        }))
      });

      // Create alerts for critical changes
      for (const change of changes) {
        await this.createSalesDateAlert(change);
      }
    }

    return changes;
  }

  async createSalesDateAlert(change: SalesDateChange): Promise<void> {
    if (!this.kv) {
      // If KV is not available, just log and return
      log('warn', `Sales date change detected (KV unavailable): ${change.changeType} for ${change.eventName}`, {
        eventId: change.eventId,
        region: change.region,
        changeType: change.changeType,
        previousValue: change.previousValue,
        newValue: change.newValue
      });
      return;
    }
    const alert: SalesAlert = {
      id: `alert_${change.eventId}_${change.changeType}_${Date.now()}`,
      eventId: change.eventId,
      eventName: change.eventName,
      region: change.region,
      alertType: 'salesDateChanged',
      severity: this.getSeverityForDateChange(change),
      message: this.getAlertMessage(change),
      details: {
        changeType: change.changeType,
        field: change.field,
        previousValue: change.previousValue,
        newValue: change.newValue,
        source: change.source
      },
      createdAt: change.changedAt,
      acknowledged: false
    };

    // Store alert
    const alertKey = `alert:${alert.id}`;
    await this.kv.put(alertKey, JSON.stringify(alert), {
      expirationTtl: 30 * 24 * 60 * 60 // Keep alerts for 30 days
    });

    // Add to alerts list for easy retrieval
    const alertsListKey = 'recent_alerts';
    const existingAlertsJson = await this.kv.get(alertsListKey);
    const existingAlerts: string[] = existingAlertsJson ? JSON.parse(existingAlertsJson) : [];
    
    // Add new alert to beginning of list and keep only recent 100
    const updatedAlerts = [alert.id, ...existingAlerts].slice(0, 100);
    
    await this.kv.put(alertsListKey, JSON.stringify(updatedAlerts), {
      expirationTtl: 30 * 24 * 60 * 60
    });

    log('warn', `Sales date alert created: ${alert.message}`, {
      alertId: alert.id,
      severity: alert.severity,
      eventId: change.eventId,
      eventName: change.eventName
    });
  }

  private getSeverityForDateChange(change: SalesDateChange): 'low' | 'medium' | 'high' | 'critical' {
    // Sales start date changes are generally more critical
    if (change.changeType === 'sellStart') {
      // Moving sales start date forward (later) is critical as it delays sales
      if (change.previousValue && change.newValue && 
          new Date(change.newValue) > new Date(change.previousValue)) {
        return 'critical';
      }
      // Moving sales start date backward (earlier) is high priority
      if (change.previousValue && change.newValue && 
          new Date(change.newValue) < new Date(change.previousValue)) {
        return 'high';
      }
      return 'medium';
    }

    // Sales end date changes
    if (change.changeType === 'sellEnd') {
      return 'medium';
    }

    return 'low';
  }

  private getAlertMessage(change: SalesDateChange): string {
    const formatDate = (dateStr: string | null) => {
      return dateStr ? new Date(dateStr).toLocaleString() : 'Not set';
    };

    switch (change.changeType) {
      case 'sellStart':
        return `Ticket sales start date changed for ${change.eventName} from ${formatDate(change.previousValue)} to ${formatDate(change.newValue)}`;
      case 'sellEnd':
        return `Ticket sales end date changed for ${change.eventName} from ${formatDate(change.previousValue)} to ${formatDate(change.newValue)}`;
      default:
        return `Sales date changed for ${change.eventName}: ${change.field} from ${formatDate(change.previousValue)} to ${formatDate(change.newValue)}`;
    }
  }

  async getRecentChanges(limit: number = 50): Promise<SalesDateChange[]> {
    if (!this.kv) {
      return [];
    }
    
    const alertsListKey = 'recent_alerts';
    const alertsListJson = await this.kv.get(alertsListKey);
    const alertIds: string[] = alertsListJson ? JSON.parse(alertsListJson) : [];
    
    const changes: SalesDateChange[] = [];
    
    for (const alertId of alertIds.slice(0, limit)) {
      const alertKey = `alert:${alertId}`;
      const alertJson = await this.kv.get(alertKey);
      if (alertJson) {
        const alert: SalesAlert = JSON.parse(alertJson);
        if (alert.alertType === 'salesDateChanged' && alert.details) {
          changes.push({
            eventId: alert.eventId,
            eventName: alert.eventName,
            region: alert.region,
            changeType: alert.details.changeType,
            field: alert.details.field,
            previousValue: alert.details.previousValue,
            newValue: alert.details.newValue,
            changedAt: alert.createdAt,
            source: alert.details.source
          });
        }
      }
    }
    
    return changes;
  }

  async getEventHistory(eventId: string): Promise<EventHistory | null> {
    if (!this.kv) {
      return null;
    }
    
    const historyKey = `event_history:${eventId}`;
    const historyJson = await this.kv.get(historyKey);
    return historyJson ? JSON.parse(historyJson) : null;
  }
}