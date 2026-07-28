import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.ComponentProps<'input'> {
	icon: React.ReactNode;
}

const AuthInput = ({ icon, className, ...props }: AuthInputProps) => {
	return (
		<div className='relative flex items-center'>
			<span className='pointer-events-none absolute left-4 text-aromas_fucsia'>
				{icon}
			</span>
			<Input
				className={cn(
					'h-12 rounded-full border-2 border-aromas_pink pl-11 pr-4 placeholder:text-gray-400 focus-visible:border-aromas_fucsia focus-visible:ring-0',
					className,
				)}
				{...props}
			/>
		</div>
	);
};

export default AuthInput;
