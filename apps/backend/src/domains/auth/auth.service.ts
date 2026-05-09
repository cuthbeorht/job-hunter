import AccountRepository from "../../domains/accounts/account.repository";
import AuthRepository from "../../domains/auth/auth.repository";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class AuthService {
    accountRepository: AccountRepository;
    authRepository: AuthRepository;
    
    constructor (accountRepository: AccountRepository, authRepository: AuthRepository) {
        this.accountRepository = accountRepository;
        this.authRepository = authRepository;
    }

    async login(email: string, password: string): Promise<AuthToken> {
        const account = await this.accountRepository.findByEmail(email);
        if (!account) {
            throw new Error('Invalid email or password');
        }

        const passwordHash = await bcrypt.hash(password, 10); // Hash the password
        
        try {
            
            const isPasswordMatch = await bcrypt.compare(password, account.passwordHash); // Compare with stored hash            
            if (!isPasswordMatch) {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            console.error('Error comparing password hashes:', error);
            throw new Error('Authentication failed');
        }

        // Generate token logic here (e.g., JWT)        
        const expiresAt = Date.now() + 3600 * 1000; // Token expires in 1 hour
        const token = jwt.sign({userId: account.id, email: account.email}, "your-secret-key", { expiresIn: '1h' });

        // Optionally, save the token in the database using authRepository

        return { token, expiresAt };
    }
}