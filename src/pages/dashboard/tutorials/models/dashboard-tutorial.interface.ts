/** Visual weight of a control, so the guide can flag what is risky at a glance. */
export type ITutorialControlKind =
	| 'primary'
	| 'secondary'
	| 'navigation'
	| 'toggle'
	| 'destructive';

export interface ITutorialControl {
	/** Visible label, or a description of the glyph when the control has no text. */
	label: string;
	kind: ITutorialControlKind;
	/** Where on the screen the control lives. */
	location: string;
	/** What the control does once pressed. */
	what: string;
	/** Ordered steps to use it end to end. */
	steps: string[];
	tip?: string;
	warning?: string;
}

export interface ITutorialGroup {
	title: string;
	controls: ITutorialControl[];
}

export interface ITutorialSection {
	/**
	 * Matches the id of the dashboard page it documents, so the guide can open
	 * straight on the chapter for whatever the admin is looking at. Sections that
	 * document chrome instead of a page (the sidebar) use their own id.
	 */
	id: string;
	title: string;
	summary: string;
	groups: ITutorialGroup[];
}
