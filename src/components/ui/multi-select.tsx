import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

export type Option = {
	_id: string;
	name: string;
};

interface MultiSelectPopoverProps {
	options: Option[];
	selected: string[];
	onChange: (selected: string[]) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
}

export function MultiSelect({
	options,
	selected,
	onChange,
	className,
	placeholder = 'Seleccioná items...',
	disabled,
}: MultiSelectPopoverProps) {
	const [open, setOpen] = React.useState(false);

	const handleUnselect = (id: string) => {
		onChange(selected.filter((s) => s !== id));
	};

	const handleSelect = (id: string) => {
		onChange([...selected, id]);
	};

	const getButtonText = () => {
		if (selected.length === 0) {
			return placeholder;
		}
		if (selected.length === 1) {
			const selectedOption = options.find(
				(opt) => opt._id === selected[0]
			);
			return selectedOption ? selectedOption.name : placeholder;
		}
		return `${selected.length} seleccionados`;
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					disabled={disabled}
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className={cn(
						'w-full justify-between font-normal',
						className
					)}
					onClick={() => setOpen(!open)}>
					{getButtonText()}
					<ChevronDown
						className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-all ${
							open && 'rotate-180'
						}`}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='w-[--radix-popover-trigger-width] bg-white p-0'
				align='center'>
				<Command>
					<CommandInput
						placeholder='Buscar...'
						className='outline-none'
					/>
					<CommandList>
						<CommandEmpty>
							No se encontraron resultados.
						</CommandEmpty>
						<CommandGroup>
							{selected.length > 0 && (
								<CommandItem
									onSelect={() => onChange([])}
									className='justify-center text-center cursor-pointer text-red-500 font-medium hover:!text-red-500'>
									Limpiar selección
								</CommandItem>
							)}
							{options.map((option) => {
								const isSelected = selected.includes(
									option._id
								);
								return (
									<CommandItem
										key={option._id}
										className='cursor-pointer mb-2'
										onSelect={() => {
											if (isSelected) {
												handleUnselect(option._id);
											} else {
												handleSelect(option._id);
											}
										}}>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												isSelected
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{option.name}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
