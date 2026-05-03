import PostgresqlClient from "../../db/postgresql.client";

export default class AuthRepository {
    posgresqlClient: PostgresqlClient;
    
    constructor(posgresqlClient: PostgresqlClient) {
        this.posgresqlClient = posgresqlClient;
    }
}