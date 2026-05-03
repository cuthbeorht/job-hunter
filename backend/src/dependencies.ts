import AccountController from "./domains/accounts/account.controller";
import AccountService from "./domains/accounts/account.service";
import AuthController from "./domains/auth/auth.controller";
import AuthRepository from "./domains/auth/auth.repository";
import AuthService from "./domains/auth/auth.service";
import AccountRepository from "./domains/accounts/account.repository";
import PostgresqlClient from "./db/postgresql.client";
import { Settings } from "./settings";

// ALlconfigs come from here
const settings = new Settings();

//Databas connection
const postgresqlClient = new PostgresqlClient(settings.postgresqlConfig);

// Accounts dependencies
const accountRepository = new AccountRepository(postgresqlClient);
const accountService = new AccountService(accountRepository);
const accountController = new AccountController(accountService);

// Auth dependencies
const authRepository = new AuthRepository(postgresqlClient)
const authService = new AuthService(accountRepository, authRepository);
const authController = new AuthController(authService);

export {accountController, authController};