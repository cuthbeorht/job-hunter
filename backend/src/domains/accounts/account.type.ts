interface Account {
    id: string;
    email: string;
    createdAt: number;
}

interface AccountEntity {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: number;
}