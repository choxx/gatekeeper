export interface AppConfig {
  name: string;
  cronTime: string;
  apiKey?: string;
  adminSecret: string;
  prometheusUrl: string;
  systemThresholds: object[];
}
