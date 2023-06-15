export interface AppConfig {
    host: string;
    apiKey?: string;
    encryption?: {
        enabled: boolean;
        key?: string;
    }
}