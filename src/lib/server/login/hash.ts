export const hashPassword = (password: string) =>
	Bun.password.hash(password, { algorithm: 'argon2id', timeCost: 4, memoryCost: 32768 });

export const verifyPassword = (password: string, hash: string) =>
	Bun.password.verify(password, hash, 'argon2id');
