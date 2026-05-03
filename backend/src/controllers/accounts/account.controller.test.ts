import {expect, test, vi, describe, beforeEach, it} from 'vitest';
import AccountController from '../accounts/account.controller';
import { Request, Response } from 'express';


describe('AccountController', () => {

    let accountController: AccountController;
    let mockAccountService: any;
    let req: Partial<Request>;
    let res: Partial<Response>;


    beforeEach(() => {
        // Mock the service dependency
        mockAccountService = { register: vi.fn() };
        accountController = new AccountController(mockAccountService);

        // Mock Express Request and Response
        req = { params: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };


        
    });

    it('register should create a new user', async () => {
        const now = Date.now();
        const mockAccount = {
            id: "fake-id",
            email: "fake-email@server.com",
            createdAt: now
        };
        req = {
            body: {
                email: "fake-email@server.com",
                password: "fake-password"
            }
        };
        
        mockAccountService.register.mockResolvedValue(mockAccount);

        await accountController.register(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({id: "fake-id", email: "fake-email@server.com", createdAt: now });
    });

    it('register should return an error with empty email', async () => {
        req = {
            body: {
                email: "",
                password: "fake-password"
            }
        };

        await accountController.register(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid email address" });
    });
});