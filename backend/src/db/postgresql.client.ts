import { PostgreSQLConfig } from "@/types/postgresql.type";
import { Client } from "pg";


export default class PostgresqlClient {
    
    client: Client;
    postgresConfig: PostgreSQLConfig;
    
    constructor(postgresqlConfig: PostgreSQLConfig) {
        this.postgresConfig = postgresqlConfig;
        this.connect().then(() => {
            console.log("Connected to PostgreSQL successfully.");
        }).catch((error) => {
            console.error("Error connecting to PostgreSQL:", error);
            throw error;
        });
    }

    async connect() {
        const client = new Client({
            user: this.postgresConfig.user,
            host: this.postgresConfig.host,
            database: this.postgresConfig.database,
            password: this.postgresConfig.password,
            port: this.postgresConfig.port
        });
        try {
            await client.connect();
            this.client = client;
        } catch (error) {
            console.error("Failed to connect to PostgreSQL:", error);
            throw error;
        }
        
    }
}
