export interface ILoginPayload {
	email: string;
	password: string;
}

export interface IRegisterPayload {
	email: string;
	password: string;
}

export interface IAuthResponse {
	token: string;
	name: string;
	roles: unknown[];
	[key: string]: unknown;
}
