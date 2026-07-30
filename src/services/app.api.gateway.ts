import { AppInterceptors } from './interceptors';
import axios from 'axios';

export const AppApiGateWay = axios.create({
	baseURL: import.meta.env.VITE_APP_API_GATEWAY,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'x-api-key': import.meta.env.VITE_API_KEY,
	},
	timeout: 60000,
});

AppApiGateWay.interceptors.request.use(
	AppInterceptors.requestWithAuthAndLang,
	AppInterceptors.requestError
);

AppApiGateWay.interceptors.response.use(
	AppInterceptors.responseSuccess,
	AppInterceptors.responseError
);
