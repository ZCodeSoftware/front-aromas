/**
 * Reads the `exp` claim of a JWT without verifying its signature: the token is
 * only trusted by the backend, here it just tells the UI when to stop using it.
 */
const decodeExp = (token: string): number | null => {
	const payload = token.split('.')[1];
	if (!payload) return null;

	try {
		const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
		const claims = JSON.parse(atob(normalized));
		return typeof claims?.exp === 'number' ? claims.exp : null;
	} catch {
		return null;
	}
};

/**
 * True only when the token carries a readable `exp` already in the past.
 * An opaque or malformed token is reported as "not expired" so the request
 * still goes out and the backend has the final word.
 */
export const isJwtExpired = (token: string): boolean => {
	const exp = decodeExp(token);
	if (exp === null) return false;

	return exp * 1000 <= Date.now();
};
