
import AccountRepository from '@/repositories/account.repository';
import bcrypt from 'bcrypt';

export default class AccountService {
    accountRepository: AccountRepository;
    
    constructor (accountRepository: AccountRepository) {
        this.accountRepository = accountRepository;
    }
    
    async register(email: string, password: string): Promise<Account> {  
        const newAccount = await this.accountRepository.create({
            id: crypto.randomUUID(),
            email,
            passwordHash: await bcrypt.hash(password, 10),
            createdAt: Date.now()
        });

        return newAccount;
    }
}