// interceptors.ts
import { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { isJwtExpired } from '@/lib/jwt';
import { notifySessionExpired } from './session-expired';

const addJwtToken = (
	config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
	const userString = localStorage.getItem('user');
	if (userString) {
		try {
			const parsedUser = JSON.parse(userString);
			if (
				parsedUser &&
				typeof parsedUser === 'object' &&
				parsedUser.token
			) {
				// Already expired: skip the header and close the session now
				// instead of waiting for the 401 the backend would answer.
				if (isJwtExpired(parsedUser.token)) {
					notifySessionExpired();
					return config;
				}
				config.headers.set(
					'Authorization',
					`Bearer ${parsedUser.token}`
				);
			}
		} catch (error) {
			console.error('Error parsing user from localStorage:', error);
		}
	}
	return config;
};

/**
 * A 401 raised by the api-key strategy is a deployment problem, not an expired
 * session, so it must not log the user out.
 */
const isApiKeyError = (err: AxiosError): boolean => {
	const data = err.response?.data as { message?: unknown } | undefined;
	return (
		typeof data?.message === 'string' &&
		data.message.toLowerCase().includes('api key')
	);
};

// const addLanguageParam = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//   const currentLang = i18n.language

//   if (currentLang) {
//     const langParts = currentLang.split('-')
//     const baseLang = langParts[0]

//     if (!config.params) {
//       config.params = {}
//     }
//     config.params['lang'] = baseLang
//   }
//   return config
// }

export const AppInterceptors = {
	requestWithAuthAndLang: (config: InternalAxiosRequestConfig) => {
		config = addJwtToken(config);
		// config = addLanguageParam(config);
		return config;
	},
	requestWithLangOnly: (config: InternalAxiosRequestConfig) => {
		// config = addLanguageParam(config);
		return config;
	},
	requestError: (err: AxiosError) => {
		console.error('Request error:', err);
		return Promise.reject(err);
	},
	responseSuccess: (res: AxiosResponse) => {
		return res;
	},
	responseError: (err: AxiosError) => {
		if (err.response?.status === 401) {
			console.log(
				'Response error (401 Unauthorized): ',
				err.message,
				err.response?.data
			);
		} else {
			console.log('Response error: ', err.message, err.response?.data);
		}
		return Promise.reject(err);
	},
	/**
	 * Response handler for the authenticated gateway: a 401 there means the JWT
	 * was rejected (expired or invalid), so the session is closed and the user
	 * is sent to the login modal. The caller still receives the rejection.
	 */
	responseAuthError: (err: AxiosError) => {
		if (err.response?.status === 401 && !isApiKeyError(err)) {
			console.log(
				'Response error (401 Unauthorized): ',
				err.message,
				err.response?.data
			);
			notifySessionExpired();
			return Promise.reject(err);
		}
		return AppInterceptors.responseError(err);
	},
};
