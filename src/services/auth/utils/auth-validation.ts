export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,\-_])[A-Za-z\d@$!%*?&.,\-_]{8,20}$/;

export const PASSWORD_HELPER_TEXT =
	'La contraseña debe tener entre 8 y 20 caracteres, con mayúscula, minúscula, número y carácter especial.';
