export type { HxActionEventInterface };
export { dispatchHxAction, HxActionEvent, HxActions };

interface HxActionEventInterface extends Event {
	action: string;
	sourceEvent: Event;
}

class HxActionEvent extends Event implements HxActionEvent {
	#action: string;
	#sourceEvent: Event;

	constructor(e: Event, action: string) {
		super("#action", { bubbles: true, composed: true });

		this.#action = action;
		this.#sourceEvent = e;
	}

	get action(): string {
		return this.#action;
	}

	get sourceEvent(): Event {
		return this.#sourceEvent;
	}
}

class HxActions {
	#eventNames: string[];

	constructor(eventNames: string[]) {
		this.#eventNames = eventNames;
	}

	connect(el: EventTarget) {
		for (let name of this.#eventNames) {
			el.addEventListener(name, dispatchHxAction);
		}
	}

	disconnect(el: EventTarget) {
		for (let name of this.#eventNames) {
			el.removeEventListener(name, dispatchHxAction);
		}
	}
}

function getEventAttr(eventType: string) {
	return `_${eventType}`;
}

function getHxActionEvent(
	e: Event,
	type: string,
	el: Element,
): Event | undefined {
	let action = el.getAttribute(type);
	if (action) return new HxActionEvent(e, action);
}

function dispatchHxAction(e: Event): void {
	let kind = getEventAttr(e.type);
	for (let node of e.composedPath()) {
		if (node instanceof Element) {
			let event = getHxActionEvent(e, kind, node);
			if (event) node.dispatchEvent(event);
			if (node.hasAttribute(`${kind}_prevent-default`)) e.preventDefault();
			if (node.hasAttribute(`${kind}_stop-propagation`)) return;
		}
	}
}
