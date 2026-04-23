import { type } from 'arktype';

export const loginRequestBody = type({
	email: 'string',
	password: 'string'
});

export type LoginBody = typeof loginRequestBody.infer;
