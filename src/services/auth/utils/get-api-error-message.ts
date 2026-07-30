import { AxiosError } from 'axios';

interface IValidationConstraint {
	property?: string;
	constraints?: Record<string, string>;
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
	if (!(error instanceof AxiosError)) return fallback;

	const message = error.response?.data?.message;

	if (typeof message === 'string') return message;

	if (Array.isArray(message)) {
		const details = (message as IValidationConstraint[])
			.flatMap((item) =>
				item?.constraints ? Object.values(item.constraints) : []
			)
			.filter(Boolean);

		if (details.length) return details.join(' ');
	}

	return fallback;
};
