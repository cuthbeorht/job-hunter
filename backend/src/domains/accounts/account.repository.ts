import PostgresqlClient from "../../db/postgresql.client";


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

    async findByEmailAndPasswordHash(email: string, passwordHash: string): Promise<AccountEntity> {
        const query = 'SELECT * FROM accounts WHERE email = $1 AND password_hash = $2';
        try {
            const result = await this.postgresqlClient.client.query(query, [email, passwordHash]);
            if (result.rows.length === 0) {
                throw new Error('Account not found');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error finding account:', error);
            throw new Error('Failed to find account');
        }
    }
}