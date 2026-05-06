import { PostgreSQLConfig } from "./types/postgresql.type";

class Settings {
    postgresqlConfig: PostgreSQLConfig;

    constructor() {
        this.postgresqlConfig = null as unknown as PostgreSQLConfig;
        this.postgresSettings();
    }

    private postgresSettings() {
        this.postgresqlConfig = {
            host: process.env.POSTGRESQL_HOST || "localhost",
            port: parseInt(process.env.POSTGRESQL_PORT || "5432"),
            user: process.env.POSTGRESQL_USER || "jobhunter",
            password: process.env.POSTGRESQL_PASSWORD || "jobhunter",
            database: process.env.POSTGRESQL_DATABASE || "jobhunter"
        };
    }
}

export { Settings };