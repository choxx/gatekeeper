export interface AppConfig {
  name: string;
  apiKey?: string;
  adminSecret: string;
  prometheusUrl: string;
  systemThresholds: object[];
}
