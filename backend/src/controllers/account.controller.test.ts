import {expect, test, vi} from 'vitest';
import AccountController from './account.controller';

test('register should create a new user', async () => {
    const now = Date.now();
    const AccountReposoitoryMock = vi.fn(
        class {
            create = vi.fn(() => Promise.resolve({id: "fake-id", email: "fake-email@server.com", createdAt: now  }));
        }
    ) as any;
    const accountController = new AccountController(new AccountReposoitoryMock());
    const req: any = {
        body: {
            email: "