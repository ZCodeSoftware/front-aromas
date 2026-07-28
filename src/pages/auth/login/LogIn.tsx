import { useState } from 'react';
import { Mail, Lock, X } from 'lucide-react';
import { toast } from 'sonner';

import AppModal from '@/components/ui/app-modal';
import AuthInput from '@/components/ui/auth-input';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useModalStore } from '@/stores/modal.store';
import { useAuthStore } from '@/stores/auth.store';
import { authPostService } from '@/services/auth/POST/auth.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type { ILoginPayload } from '@/services/auth/models/auth.interface';

const LogIn = () => {
	const { open, close } = useModalStore();
	const setUser = useAuthStore((state) => state.setUser);

	const [form, setForm] = useState<ILoginPayload>({
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!form.email || !form.password) {
			toast.error('Completa tu email y contraseña.');
			return;
		}

		setLoading(true);
		try {
			const authResponse = await authPostService.login(form);
			setUser(authResponse);
			toast.success(
				`¡Bienvenido${authResponse.name ? `, ${authResponse.name}` : ''}!`,
			);
			setForm({ email: '', password: '' });
			close();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'Email o contraseña incorrectos.'),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AppModal
			modal='login'
			showCloseButton={false}
			animation='fade'
			size='sm'>
			<div className='flex flex-col gap-6 p-8'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-bold text-aromas_gray_text'>
						Iniciar Sesión
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
					<AuthInput
						icon={<Lock className='size-4' />}
						type='password'
						name='password'
						placeholder='Contraseña'
						autoComplete='current-password'
						value={form.password}
						onChange={handleChange}
						required
					/>

					<Button
						type='submit'
						disabled={loading}
						className='h-12 rounded-full bg-aromas_pink font-semibold text-aromas_gray_text hover:bg-aromas_pink/80'>
						{loading ? 'Ingresando...' : 'Iniciar Sesión'}
					</Button>
				</form>

				<p className='text-center text-sm text-aromas_gray_text'>
					¿No tienes cuenta?{' '}
					<button
						type='button'
						onClick={() => open('signup')}
						className='font-semibold text-aromas_fucsia underline underline-offset-2'>
						Regístrate
					</button>
				</p>
			</div>
		</AppModal>
	);
};

export default LogIn;
