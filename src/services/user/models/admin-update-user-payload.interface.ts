export interface IAdminUpdateUserPayload {
	firstName?: string;
	lastName?: string;
	phone?: string;
	newsletter?: boolean;
	email?: string;
	isActive?: boolean;
	roles?: string[];
}
