export interface WebhookHeaders {
  'x-vivenu-signature'?: string;
  'x-custom-auth'?: string;
  'content-type'?: string;
}

export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}