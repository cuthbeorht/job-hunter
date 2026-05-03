import PostgresqlClient from "@/db/postgresql.client";


export default class AccountRepository {

    postgresqlClient: PostgresqlClient;

    constructor(postgresqlClient: PostgresqlClient) {
        this.postgresqlClient = postgresqlClient;
    }

    async create(entity: AccountEntity): Promise<AccountEntity> { 
        const query = 'INSERT INTO accounts(email, password_hash) VALUES($1, $2) RETURNING id';
        try {
            const result = await this.postgresqlClient.client.query(query, [entity.email, entity.passwordHash]);

            entity.id = result.rows[0];
            return entity;
        } catch (error) {
            console.error('Error creating account:', error);
            throw new Error('Failed to create account');
        }
        
    }
}