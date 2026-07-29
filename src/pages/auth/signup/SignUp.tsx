import { useState } from 'react';
import { Mail, Lock, X } from 'lucide-react';
import { toast } from 'sonner';

import AppModal from '@/components/ui/app-modal';
import AuthInput from '@/components/ui/auth-input';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useModalStore } from '@/stores/modal.store';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { authPostService } from '@/services/auth/POST/auth.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import {
	EMAIL_REGEX,
	PASSWORD_HELPER_TEXT,
	PASSWORD_REGEX,
} from '@/services/auth/utils/auth-validation';

interface SignUpForm {
	email: string;
	password: string;
	confirmPassword: string;
}

const SignUp = () => {
	const { open, close } = useModalStore();
	const setUser = useAuthStore((state) => state.setUser);
	const mergeGuestCartIntoBackend = useCartStore(
		(state) => state.mergeGuestCartIntoBackend
	);

	const [form, setForm] = useState<SignUpForm>({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const validate = (): string | null => {
		if (!form.email || !form.password || !form.confirmPassword) {
			return 'Completa todos los campos.';
		}
		if (!EMAIL_REGEX.test(form.email)) {
			return 'Ingresa un email válido.';
		}
		if (!PASSWORD_REGEX.test(form.password)) {
			return PASSWORD_HELPER_TEXT;
		}
		if (form.password !== form.confirmPassword) {
			return 'Las contraseñas no coinciden.';
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationError = validate();
		if (validationError) {
			toast.error(validationError);
			return;
		}

		setLoading(true);
		try {
			await authPostService.register({
				email: form.email,
				password: form.password,
			});

			const authResponse = await authPostService.login({
				email: form.email,
				password: form.password,
			});
			setUser(authResponse);
			await mergeGuestCartIntoBackend();

			toast.success('¡Cuenta creada con éxito!');
			setForm({ email: '', password: '', confirmPassword: '' });
			close();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo crear la cuenta.'),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AppModal
			modal='signup'
			showCloseButton={false}
			animation='fade'
			size='sm'>
			<div className='flex flex-col gap-6 p-8'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-bold text-aromas_gray_text'>
						Crear Cuenta
					</h2>
					<DialogClose className='text-gray-400 hover:text-aromas_gray_text'>
						<X className='size-5' />
						<span className='sr-only'>Cerrar</span>
					</DialogClose>
				</div>

				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<AuthInput
						icon={<Mail className='size-4' />}
						type='email'
						name='email'
						placeholder='Email'
						autoComplete='email'
						value={form.email}
						onChange={handleChange}
						required
					/>
					<div className='flex flex-col gap-1'>
						<AuthInput
							icon={<Lock className='size-4' />}
							type='password'
							name='password'
							placeholder='Contraseña'
							autoComplete='new-password'
							value={form.password}
							onChange={handleChange}
							required
						/>
						<p className='px-2 text-xs text-gray-400'>
							{PASSWORD_HELPER_TEXT}
						</p>
					</div>
					<AuthInput
						icon={<Lock className='size-4' />}
						type='password'
						name='confirmPassword'
						placeholder='Confirmar contraseña'
						autoComplete='new-password'
						value={form.confirmPassword}
						onChange={handleChange}
						required
					/>

					<Button
						type='submit'
						disabled={loading}
						className='h-12 rounded-full bg-aromas_pink font-semibold text-aromas_gray_text hover:bg-aromas_pink/80'>
						{loading ? 'Creando cuenta...' : 'Registrarse'}
					</Button>
				</form>

				<p className='text-center text-sm text-aromas_gray_text'>
					¿Ya tienes cuenta?{' '}
					<button
						type='button'
						onClick={() => open('login')}
						className='font-semibold text-aromas_fucsia underline underline-offset-2'>
						Inicia sesión
					</button>
				</p>
			</div>
		</AppModal>
	);
};

export default SignUp;
