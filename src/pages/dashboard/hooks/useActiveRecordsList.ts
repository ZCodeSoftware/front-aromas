import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';

interface IActiveRecord {
	_id: string;
	isActive: boolean;
}

interface IUseActiveRecordsListOptions<T> {
	/** `includeInactive` mirrors the "Mostrar inactivos" filter of the table. */
	fetchItems: (includeInactive: boolean) => Promise<T[]>;
	/** Flips the soft-delete flag of a row. */
	setItemActive: (id: string, isActive: boolean) => Promise<void>;
	loadErrorMessage: string;
	toggleErrorMessage: string;
}

/**
 * Shared state of the dashboard lists. Deactivating is a soft delete, so the rows
 * have to stay reachable behind the "Mostrar inactivos" filter to be restored.
 */
export const useActiveRecordsList = <T extends IActiveRecord>({
	fetchItems,
	setItemActive,
	loadErrorMessage,
	toggleErrorMessage,
}: IUseActiveRecordsListOptions<T>) => {
	const [items, setItems] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [showInactive, setShowInactive] = useState(false);
	const [togglingId, setTogglingId] = useState<string | null>(null);

	// Held in refs so callers can pass inline callbacks without the fetch re-running
	// on every render.
	const fetchItemsRef = useRef(fetchItems);
	const setItemActiveRef = useRef(setItemActive);
	fetchItemsRef.current = fetchItems;
	setItemActiveRef.current = setItemActive;

	const refresh = useCallback(async () => {
		setLoading(true);
		try {
			setItems((await fetchItemsRef.current(showInactive)) ?? []);
		} catch (error) {
			console.error(loadErrorMessage, error);
			toast.error(getApiErrorMessage(error, loadErrorMessage));
		} finally {
			setLoading(false);
		}
	}, [loadErrorMessage, showInactive]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const toggleActive = async (item: T) => {
		setTogglingId(item._id);
		try {
			await setItemActiveRef.current(item._id, !item.isActive);
			// Refetched instead of patched in place: with the filter off the row has to
			// leave the table as soon as it is deactivated.
			await refresh();
			toast.success(
				item.isActive ? 'Registro desactivado.' : 'Registro activado.'
			);
		} catch (error) {
			toast.error(getApiErrorMessage(error, toggleErrorMessage));
		} finally {
			setTogglingId(null);
		}
	};

	return {
		items,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	};
};
