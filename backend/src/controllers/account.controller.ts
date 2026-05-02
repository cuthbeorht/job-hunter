import { Request, Response } from 'express';
import AccountService, * as authService from '../services/account.service';
import { registerSchema, loginSchema } from '../validation/auth.validation';

export default class AccountController {
    service: AccountService;
    
    constructor(service: AccountService) {
        this.service = service;
    }
    
    async register(req: Request, res: Response) {
        try {
            const parsed = registerSchema.safeParse(req.body);
            
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.issues[0].message });
            }

            const user = await this.service.register(
                parsed.data.email,
                parsed.data.password
            );

            res.status(201).json(user);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}

