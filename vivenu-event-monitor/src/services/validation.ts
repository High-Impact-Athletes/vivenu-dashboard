type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

export function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? JSON.stringify(context) : '';
  
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(context && { context })
  };
  
  // Use appropriate console method
  switch (level) {
    case 'debug':
      console.debug(`[${timestamp}] DEBUG: ${message}`, contextStr);
      break;
    case 'info':
      console.log(`[${timestamp}] INFO: ${message}`, contextStr);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN: ${message}`, contextStr);
      break;
    case 'error':
      console.error(`[${timestamp}] ERROR: ${message}`, contextStr);
      break;
    default:
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, contextStr);
  }
}

export function validateEventData(event: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!event) {
    errors.push('Event is null or undefined');
    return { valid: false, errors };
  }
  
  if (!event._id) {
    errors.push('Event is missing _id');
  }
  
  if (!event.name) {
    errors.push('Event is missing name');
  }
  
  if (!event.start) {
    errors.push('Event is missing start date');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateTicketData(ticket: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!ticket) {
    errors.push('Ticket is null or undefined');
    return { valid: false, errors };
  }
  
  if (!ticket._id) {
    errors.push('Ticket is missing _id');
  }
  
  if (!ticket.eventId) {
    errors.push('Ticket is missing eventId');
  }
  
  if (!ticket.ticketTypeId) {
    errors.push('Ticket is missing ticketTypeId');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}