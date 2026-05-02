import {expect, test, vi} from 'vitest';
import AccountService from './account.service';




test('register should create a new user', async () => {
    const now = Date.now();
    const AccountReposoitoryMock = vi.fn(
        class {
            create = vi.fn(() => Promise.resolve({id: "fake-id", email: "fake-email@server.com", createdAt: now  }));
        }
    ) as any;
    const accountService = new AccountService(new AccountReposoitoryMock());
    const email = "fake-email@server.com";
    const password = "fake-password";

    const user = await accountService.register(email, password);

    expect(user).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.id).toBe("fake-id");
    expect(user.createdAt).toBe(now);
});