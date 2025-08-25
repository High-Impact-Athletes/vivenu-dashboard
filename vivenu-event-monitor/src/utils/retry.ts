export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2
  } = retryOptions;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Success - return response
      if (response.ok) {
        return response;
      }

      // Rate limited - wait longer
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const delay = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : Math.min(initialDelay * Math.pow(backoffFactor, attempt) * 5, maxDelay);
        
        console.log(`Rate limited. Waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Server error - retry with backoff
      if (response.status >= 500) {
        const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt), maxDelay);
        console.log(`Server error ${response.status}. Waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Client error - don't retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      lastError = error as Error;
      
      // Network error - retry with backoff
      if (attempt < maxRetries - 1) {
        const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt), maxDelay);
        console.log(`Network error. Waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new Error('Failed after maximum retries');
}