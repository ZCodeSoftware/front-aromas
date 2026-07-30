import type { IAddress } from '@/services/address/models/address.interface';

export interface ICatRole {
	_id: string;
	name: string;
}

export interface IUserProfile {
	_id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	phone: string | null;
	isActive: boolean;
	newsletter: boolean;
	roles: ICatRole[];
	address: IAddress[];
	createdAt: string;
	updatedAt: string;
}
