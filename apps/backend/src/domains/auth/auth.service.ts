import AccountRepository from "../../domains/accounts/account.repository";
import AuthRepository from "../../domains/auth/auth.repository";
import jwt from 'jsonwebtoken';

export default class AuthService {
    accountRepository: AccountRepository;
    authRepository: AuthRepository;
    
    constructor (accountRepository: AccountRepository, authRepository: AuthRepository) {
        this.accountRepository = accountRepository;
        this.authRepository = authRepository;
    }

    async login(email: string, password: string): Promise<AuthToken> {
        const account = await this.accountRepository.findByEmailAndPasswordHash(email, password);
        if (!account) {
            throw new Error('Invalid email or password');
        }

        // Generate token logic here (e.g., JWT)        
        const expiresAt = Date.now() + 3600 * 1000; // Token expires in 1 hour
        const token = jwt.sign({userId: account.id}, "your-secret-key", { expiresIn: '1h' });

        // Optionally, save the token in the database using authRepository

        return { token, expiresAt };
    }
}