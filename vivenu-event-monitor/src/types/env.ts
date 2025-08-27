export interface Env {
  KV?: KVNamespace;
  ENVIRONMENT?: 'development' | 'staging' | 'production';
}