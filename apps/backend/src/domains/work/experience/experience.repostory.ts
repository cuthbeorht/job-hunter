import PostgresqlClient from "../../../db/postgresql.client";
import { ExperienceEntity } from "./experience.types";

export default class ExperienceRepository {
    postgresqlClient: PostgresqlClient;
    
    constructor(postgresqlClient: PostgresqlClient) {
        this.postgresqlClient = postgresqlClient;
    }

    async create(entity: ExperienceEntity): Promise<ExperienceEntity> {
        const query = 'INSERT INTO experiences(company, position, start_date, end_date, description) VALUES($1, $2, $3, $4, $5) RETURNING id';
        try {
            const result = await this.postgresqlClient.client.query(query, [entity.company, entity.position, entity.startDate, entity.endDate, entity.description]);
            entity.id = result.rows[0].id;
            return entity;
        } catch (error) {
            console.error('Error creating experience:', error);
            throw new Error('Failed to create experience');
        }
    }

    async findAll(): Promise<ExperienceEntity[]> {
        const query = 'SELECT * FROM experiences';
        try {
            const result = await this.postgresqlClient.client.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching experiences:', error);
            throw new Error('Failed to fetch experiences');
        }
    }
}