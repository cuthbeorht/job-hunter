import AccountController from "./domains/accounts/account.controller";
import AccountService from "./domains/accounts/account.service";
import AuthController from "./domains/auth/auth.controller";
import AuthRepository from "./domains/auth/auth.repository";
import AuthService from "./domains/auth/auth.service";
import AccountRepository from "./domains/accounts/account.repository";
import PostgresqlClient from "./db/postgresql.client";
import { Settings } from "./settings";
import ExperienceController from "./domains/work/experience/experience.controller";
import ExperienceRepository from "./domains/work/experience/experience.repostory";
import ExperienceService from "./domains/work/experience/experience.service";

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

// Experience dependencies
const experienceRepository = new ExperienceRepository(postgresqlClient);
const experienceService = new ExperienceService(experienceRepository);
const experienceController = new ExperienceController(experienceService);

export {accountController, authController, experienceController};