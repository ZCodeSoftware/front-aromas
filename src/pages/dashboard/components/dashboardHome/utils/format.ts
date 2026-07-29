export const formatCurrency = (value: number): string => {
	return `$${value.toLocaleString('es-AR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
};

export const formatCompactNumber = (value: number): string => {
	return new Intl.NumberFormat('es-AR', { notation: 'compact' }).format(
		value
	);
};

export const formatPercent = (value: number): string => {
	return `${value.toFixed(1)}%`;
};

export const formatDateLabel = (bucket: string): string => {
	if (/^\d{4}-\d{2}-\d{2}$/.test(bucket)) {
		const [, month, day] = bucket.split('-');
		return `${day}/${month}`;
	}
	return bucket;
};
