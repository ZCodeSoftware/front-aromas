import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type {
	IAuthResponse,
	ILoginPayload,
	IRegisterPayload,
} from '../models/auth.interface';

const login = async (payload: ILoginPayload): Promise<IAuthResponse> => {
	const response = await AppApiGateWayNoJWT.post('/auth/login', payload);
	return response.data;
};

const register = async (payload: IRegisterPayload): Promise<void> => {
	await AppApiGateWayNoJWT.post('/user/register', payload);
};

export const authPostService = {
	login,
	register,
};
