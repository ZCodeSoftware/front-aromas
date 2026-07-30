export interface IGeo {
	lat: string;
	lng: string;
}

export interface ICatTypeHousing {
	_id: string;
	name: string;
}

export interface IAddress {
	_id: string;
	name?: string;
	street: string;
	number?: number;
	zipCode: string;
	description?: string;
	floorAddress?: string;
	isActive: boolean;
	isAble: boolean;
	typeOfHousing: ICatTypeHousing | null;
	geo: IGeo | null;
}

export interface ICreateAddressPayload {
	name?: string;
	street: string;
	number?: number;
	zipCode: string;
	description?: string;
	floorAddress?: string;
	isActive: boolean;
	typeOfHousing?: string;
	geo?: IGeo;
}
