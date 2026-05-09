import { Request, Response } from "express";
import AuthService from "../../domains/auth/auth.service";

export default class AuthController {
    service: AuthService;
    
    constructor(service: AuthService) {
        this.service = service;
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            
            const authToken = await this.service.login(email, password);
            res.status(200).json(authToken);
        } catch (error) {            
            res.status(400).json({ message: error.message });
        }
    }

    async whoami(req: Request, res: Response) {
        
        const idData = req.headers["authorization"].split(".")[1];
        const rawJson = Buffer.from(idData, "base64").toString("utf-8");
        const json = JSON.parse(rawJson);
        console.debug("whoami json:", json);
        
        res.status(200).json({ message: {
            id: json.userId,
            email: json.email,
        } });
    }
}