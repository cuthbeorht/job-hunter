import bcrypt from 'bcrypt';
import {expect, test, vi, describe, beforeEach, it} from 'vitest';

describe('AuthService', () => {
    it('should hash the password and compare correctly', async () => {
        const password = 'mysecretpassword';
        const passwordHash = await bcrypt.hash(password, 10);
        
        const isMatch = await bcrypt.compare(password, passwordHash);
        expect(isMatch).toBe(true);
    });

    it('should fail to compare with an incorrect password', async () => {
        const password = 'mysecretpassword';
        const wrongPassword = 'wrongpassword';
        const passwordHash = await bcrypt.hash(password, 10);
        
        const isMatch = await bcrypt.compare(wrongPassword, passwordHash);
        expect(isMatch).toBe(false);
    });
});