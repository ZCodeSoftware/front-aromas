import { useEffect, useId, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FOCUS_RING } from '@/lib/a11y';
import {
	MAX_RANGE_DAYS,
	RANGE_PRESETS,
	describeRange,
	resolvePreset,
	todayInStore,
	validateRange,
	type IAnalyticsRange,
	type RangePresetId,
} from '../utils/analytics-range';

interface RangeFilterProps {
	value: IAnalyticsRange;
	onChange: (next: IAnalyticsRange) => void;
}

/**
 * One filter row, above everything it scopes.
 *
 * Presets are native radios rather than a listbox of buttons: the browser then
 * supplies the roving focus, the arrow-key behaviour and the "2 of 6" position
 * announcement for free, and there is no ARIA to get subtly wrong. They are
 * styled through the hidden input's `peer` state, so the visible chip is only
 * ever a reflection of real form state.
 *
 * The custom range does not apply on every keystroke — a half-typed year is a
 * request for a 2000-day window — so it validates first and reports the problem
 * in a live region tied to the inputs.
 */
const RangeFilter = ({ value, onChange }: RangeFilterProps) => {
	const groupName = useId();
	const fromId = useId();
	const toId = useId();
	const errorId = useId();

	const [draftFrom, setDraftFrom] = useState(value.dateFrom);
	const [draftTo, setDraftTo] = useState(value.dateTo);
	const [error, setError] = useState<string | null>(null);
	const isCustom = value.presetId === 'custom';

	// A preset click replaces the draft, so reopening "Personalizado" starts
	// from the period actually on screen rather than a stale pair of dates.
	useEffect(() => {
		setDraftFrom(value.dateFrom);
		setDraftTo(value.dateTo);
		setError(null);
	}, [value.dateFrom, value.dateTo]);

	const selectPreset = (presetId: RangePresetId) => {
		if (presetId === 'custom') {
			onChange({ ...value, presetId: 'custom' });
			return;
		}
		onChange(resolvePreset(presetId));
	};

	const applyCustom = () => {
		const validation = validateRange(draftFrom, draftTo);

		if (!validation.isValid) {
			setError(validation.message ?? 'El período no es válido.');
			return;
		}

		setError(null);
		onChange({
			presetId: 'custom',
			dateFrom: draftFrom,
			dateTo: draftTo,
			timezone: value.timezone,
		});
	};

	return (
		<div className='flex flex-col gap-3 rounded-xl border border-aromas_gray_line bg-white p-4 shadow-sm'>
			<fieldset className='flex flex-col gap-2'>
				<legend className='mb-1 flex items-center gap-2 text-sm font-semibold text-aromas_ink'>
					<CalendarDays aria-hidden='true' className='size-4' />
					Período
				</legend>
				<div className='flex flex-wrap gap-2'>
					{RANGE_PRESETS.map((preset) => (
						<label
							key={preset.id}
							className='cursor-pointer'>
							<input
								type='radio'
								name={groupName}
								value={preset.id}
								checked={value.presetId === preset.id}
								onChange={() => selectPreset(preset.id)}
								className='peer sr-only'
							/>
							<span
								className={cn(
									'inline-flex min-h-[36px] items-center rounded-full border border-aromas_fucsia_ink px-3 py-1.5 text-sm font-medium text-aromas_fucsia_ink transition-colors',
									'peer-hover:bg-aromas_fucsia_ink/10',
									'peer-checked:bg-aromas_pink peer-checked:text-aromas_gray_text',
									'peer-focus-visible:ring-2 peer-focus-visible:ring-aromas_fucsia_ink peer-focus-visible:ring-offset-2'
								)}>
								{preset.label}
							</span>
						</label>
					))}
				</div>
			</fieldset>

			{isCustom && (
				<div className='flex flex-col gap-2 border-t border-aromas_gray_line pt-3'>
					<div className='flex flex-wrap items-end gap-3'>
						<div className='flex flex-col gap-1'>
							<label
								htmlFor={fromId}
								className='text-xs font-medium text-aromas_ink'>
								Desde
							</label>
							<input
								id={fromId}
								type='date'
								value={draftFrom}
								max={todayInStore()}
								aria-describedby={error ? errorId : undefined}
								aria-invalid={error ? true : undefined}
								onChange={(event) =>
									setDraftFrom(event.target.value)
								}
								className={cn(
									'min-h-[36px] rounded-md border border-aromas_gray_line bg-white px-2 py-1 text-sm text-aromas_ink',
									FOCUS_RING
								)}
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<label
								htmlFor={toId}
								className='text-xs font-medium text-aromas_ink'>
								Hasta
							</label>
							<input
								id={toId}
								type='date'
								value={draftTo}
								max={todayInStore()}
								aria-describedby={error ? errorId : undefined}
								aria-invalid={error ? true : undefined}
								onChange={(event) =>
									setDraftTo(event.target.value)
								}
								className={cn(
									'min-h-[36px] rounded-md border border-aromas_gray_line bg-white px-2 py-1 text-sm text-aromas_ink',
									FOCUS_RING
								)}
							/>
						</div>
						<button
							type='button'
							onClick={applyCustom}
							className={cn(
								'min-h-[36px] rounded-md bg-aromas_fucsia_ink px-3 py-1.5 text-sm font-semibold text-white hover:bg-aromas_fucsia_ink/90',
								FOCUS_RING
							)}>
							Aplicar
						</button>
					</div>
					<p
						id={errorId}
						role={error ? 'alert' : undefined}
						className={cn(
							'text-xs',
							error
								? 'font-medium text-aromas_critical_ink'
								: 'text-aromas_ink_muted'
						)}>
						{error ??
							`Máximo ${MAX_RANGE_DAYS} días. Las fechas se leen en la zona horaria de la tienda (${value.timezone}).`}
					</p>
				</div>
			)}

			{/*
			 * The active period, stated once and referenced by every view, so
			 * nobody has to infer which window a number belongs to. Announced
			 * politely because it changes as a consequence of the reader's own
			 * action, not out of the blue.
			 */}
			<p
				aria-live='polite'
				className='text-xs text-aromas_ink_muted'>
				Mostrando{' '}
				<span className='font-semibold text-aromas_ink'>
					{describeRange(value)}
				</span>{' '}
				· zona horaria {value.timezone}
			</p>
		</div>
	);
};

export default RangeFilter;
