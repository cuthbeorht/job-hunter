import AccountController from "./controllers/account.controller";
import PostgresqlClient from "./db/postgresql.client";
import AccountRepository from "./repositories/account.repository";
import AccountService from "./services/account.service";
import { Settings } from "./settings";

const settings = new Settings();

const postgresqlClient = new PostgresqlClient(settings.postgresqlConfig);

const accountRepository = new AccountRepository(postgresqlClient);

const accountService = new AccountService(accountRepository);
const accountController = new AccountController(accountService);

export {accountController};