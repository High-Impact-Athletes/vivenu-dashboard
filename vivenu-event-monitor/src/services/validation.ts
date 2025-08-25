import { WebhookValidationResult } from '../types/webhook';

export async function validateWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<WebhookValidationResult> {
  if (!signature) {
    return { isValid: false, error: 'Missing signature header' };
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Remove any prefix from the signature (like "sha256=")
    const cleanSignature = signature.replace(/^(sha256=|hmac-sha256=)/, '');
    
    const isValid = computedSignature === cleanSignature;
    
    return { 
      isValid,
      error: isValid ? undefined : 'Invalid signature'
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: `Signature validation error: ${(error as Error).message}` 
    };
  }
}

export function log(level: 'info' | 'warn' | 'error', message: string, data: Record<string, any> = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  }));
}