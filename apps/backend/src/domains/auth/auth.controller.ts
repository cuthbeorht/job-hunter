import { Request, Response } from "express";
import AuthService from "../../domains/auth/auth.service";

export default class AuthController {
    service: AuthService;
    
    constructor(service: AuthService) {
        this.service = service;
    }

    async login(req: Request, res: Response) {
        res.status(200).json({ message: "Login successful" });
    }

    async whoami(req: Request, res: Response) {
        res.status(200).json({ message: "Authenticated user info" });
    }
}