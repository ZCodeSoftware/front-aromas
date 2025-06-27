// interceptors.ts
import { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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
};
