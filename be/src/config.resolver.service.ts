import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "./api.interface";

@Injectable()
export class ConfigResolverService {
    constructor(private configService: ConfigService) {
    }

    transform(applicationId: string): string {
        /**
         * we'll replace "-" with "_" because docker-compose cannot load hyphens & we expect applicationId with underscore separator.
         * Also, we'll prefix <APP_> as the uuid may begin with integer & variables can't begin with numbers.
         */
        return 'APP_' + applicationId.replace(/\./g, '_').split("-").join("_");
    }

    getConfigByApplicationId(applicationId: string): AppConfig {
        applicationId = this.transform(applicationId);
        return this.configService.get<AppConfig>(applicationId);
    }

    getAppName(applicationId: string): string {
        applicationId = this.transform(applicationId);
        const config = this.configService.get<string>(applicationId);
        return config ? JSON.parse(config).name || null : null;
    }

    getApiKey(applicationId: string): string {
        applicationId = this.transform(applicationId);
        const config = this.configService.get<string>(applicationId);
        console.log('111', applicationId, config)
        return config ? JSON.parse(config).apiKey || null : null;
    }

    getAdminSecret(applicationId: string): string {
        applicationId = this.transform(applicationId);
        const config = this.configService.get<string>(applicationId);
        return config ? JSON.parse(config).adminSecret || null : null;
    }

    /*getEncryptionStatus(applicationId: string): boolean {
        applicationId = this.transform(applicationId);
        const config = this.configService.get<string>(applicationId);
        return JSON.parse(config).encryption.enabled || false;
    }

    getEncryptionKey(applicationId: string): string{
        if (this.getEncryptionStatus(applicationId)) {
            applicationId = this.transform(applicationId);
            const config = this.configService.get<string>(applicationId);
            return JSON.parse(config).encryption.key || undefined;
        }
        return undefined;
    }

    getHasura(applicationId: string): {
        graphql_url: string,
        admin_secret: string,
        enabled: boolean,
        mutations: object
    } | undefined {
        applicationId = this.transform(applicationId);
        const config = this.configService.get<string>(applicationId);
        return config ? (JSON.parse(config)?.hasura || undefined) : undefined;
    }

    getSalt(applicationId: string): string {
        applicationId = this.transform(applicationId);
        const config = this.configService.get<string>(applicationId);
        return JSON.parse(config).salt || null;
    }*/
}