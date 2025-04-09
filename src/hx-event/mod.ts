export type { HxEventInterface };
export { dispatchHxEvent, dispatchHxFromForm, HxEvent };

interface HxEventInterface extends Event {
	action: string;
	sourceEvent: Event;
}

class HxEvent extends Event implements HxEvent {
	#action: string;
	#actionType: string;
	#sourceEvent: Event;

	constructor(e: Event, type: string, action: string) {
		super("@event", { bubbles: true, composed: true });

		this.#action = action;
		this.#actionType = type;
		this.#sourceEvent = e;
	}

	get action(): string {
		return this.#action;
	}

	get actionType(): string {
		return this.#actionType;
	}

	get sourceEvent(): Event {
		return this.#sourceEvent;
	}
}

function getAtmark(eventType: string) {
	return `.${eventType}`;
}

function getHxEvent(
	e: Event,
	type: string,
	node: EventTarget,
): Event | undefined {
	if (node instanceof Element) {
		let action = node.getAttribute(type);
		if (action) return new HxEvent(e, type, action);
	}
}

function dispatchHxEvent(e: Event): void {
	let type = getAtmark(e.type);

	for (let node of e.composedPath()) {
		let event = getHxEvent(e, type, node);
		if (event) node.dispatchEvent(event);
	}
}

function getHxEventFromForm(e: Event): Event | undefined {
	if (e.target instanceof HTMLFormElement) {
		let type = getAtmark(e.type);
		let action = e.target.getAttribute(type);
		if (action) return new HxEvent(e, type, action);
	}
}

function dispatchHxFromForm(e: Event): void {
	let event = getHxEventFromForm(e);
	if (event) {
		e.preventDefault();
		e.target.dispatchEvent(event);
	}
}
