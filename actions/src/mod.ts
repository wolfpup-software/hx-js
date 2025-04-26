export type { HxEventInterface };
export { dispatchHxAction, HxEvent };

interface HxEventInterface extends Event {
	action: string;
	sourceEvent: Event;
}

class HxEvent extends Event implements HxEvent {
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

function getEventAttr(eventType: string) {
	return `_${eventType}_`;
}

function getHxEvent(e: Event, type: string, el: Element): Event | undefined {
	let action = el.getAttribute(type);
	if (action) return new HxEvent(e, action);
}

function dispatchHxAction(e: Event): void {
	let kind = getEventAttr(e.type);
	for (let node of e.composedPath()) {
		if (node instanceof Element) {
			let event = getHxEvent(e, kind, node);
			if (event) node.dispatchEvent(event);
			if (node.hasAttribute(`${kind}prevent-default_`)) e.preventDefault();
			if (node.hasAttribute(`${kind}stop-propagation_`)) return;
		}
	}
}
