export type { HxEventInterface };
export { dispatchHxEvent, dispatchHxOnSubmit, HxEvent };

interface HxEventInterface extends Event {
	action: string;
	typeAction: string;
	sourceEvent: Event;
}

class HxEvent extends Event implements HxEvent {
	#action: string;
	#typeAction: string;
	#sourceEvent: Event;

	constructor(e: Event, action: string) {
		super(`:${e.type}`, { bubbles: true, composed: true });

		this.#action = action;
		this.#typeAction = `:${e.type}:${action}`;
		this.#sourceEvent = e;
	}

	get sourceEvent(): Event {
		return this.#sourceEvent;
	}

	get action(): string {
		return this.#action;
	}

	get typeAction(): string {
		return this.#typeAction;
	}
}

function getHxEvent(e: Event, node: EventTarget): Event | undefined {
	// start with any elements
	// maybe only inputs buttons forms?
	if (node instanceof Element) {
		let action = node.getAttribute(":");
		if (action) return new HxEvent(e, action);
	}
}

function dispatchHxEvent(e: Event): void {
	for (let node of e.composedPath()) {
		let event = getHxEvent(e, node);
		if (event) node.dispatchEvent(event);
	}
}

function getHxEventFromForm(e: Event): Event | undefined {
	if (e.target instanceof HTMLFormElement) {
		let action = e.target.getAttribute(":");
		if (action) return new HxEvent(e, action);
	}
}

function dispatchHxOnSubmit(e: Event): void {
	let event = getHxEventFromForm(e);
	if (event) {
		e.preventDefault();
		e.target.dispatchEvent(event);
	}
}
