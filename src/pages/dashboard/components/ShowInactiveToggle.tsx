import { Switch } from '@/components/ui/switch';

interface IShowInactiveToggleProps {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

/** Filter shared by every dashboard list, to bring the deactivated rows back into view. */
const ShowInactiveToggle = ({
	checked,
	onCheckedChange,
}: IShowInactiveToggleProps) => (
	<label
		data-tutorial='show-inactive'
		className='flex cursor-pointer items-center gap-2 text-sm text-aromas_gray_text'>
		<Switch checked={checked} onCheckedChange={onCheckedChange} />
		Mostrar inactivos
	</label>
);

export default ShowInactiveToggle;
