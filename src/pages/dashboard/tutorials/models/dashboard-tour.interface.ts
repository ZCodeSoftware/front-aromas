export interface ITourStep {
	/**
	 * Dashboard page this step happens on. The player switches to it before
	 * showing the step, so a tour can walk across several screens.
	 */
	page?: string;
	/**
	 * `data-tutorial` value of the control to spotlight. Steps without a target
	 * (or whose target is not on screen yet, like the contents of a modal) show
	 * their card at the bottom without dimming anything in particular.
	 */
	target?: string;
	title: string;
	/** What to do, in the imperative. */
	body: string;
	/** What the admin should see once they did it. */
	result?: string;
	tip?: string;
	warning?: string;
}

export interface ITourDefinition {
	id: string;
	title: string;
	description: string;
	/** Rough reading time in minutes, shown on the launcher card. */
	minutes: number;
	steps: ITourStep[];
}
