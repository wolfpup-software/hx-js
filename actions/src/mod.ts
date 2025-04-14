export type { ActionEventInterface };
export { dispatchActionEvent, dispatchActionFromForm, ActionEvent };

// basic postulations and behaviors that extrapolate into broader logic

interface ActionEventInterface extends Event {
	action: string;
	sourceEvent: Event;
}

class ActionEvent extends Event implements ActionEvent {
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

function getActionEvent(
	e: Event,
	type: string,
	el: Element,
): Event | undefined {
	let action = el.getAttribute(type);
	if (action) return new ActionEvent(e, action);
}

function dispatchActionEvent(e: Event): void {
	let type = getEventAttr(e.type);
	for (let node of e.composedPath()) {
		if (node instanceof Element) {
			let event = getActionEvent(e, type, node);
			if (event) node.dispatchEvent(event);
			if (node.hasAttribute("_stop-propagation_")) return;
		}
	}
}

function getActionEventFromForm(e: Event): Event | undefined {
	if (e.target instanceof HTMLFormElement) {
		let type = getEventAttr(e.type);
		let action = e.target.getAttribute(type);
		if (action) return new ActionEvent(e, action);
	}
}

function dispatchActionFromForm(e: Event): void {
	let event = getActionEventFromForm(e);
	if (event) {
		e.preventDefault();
		e.target.dispatchEvent(event);
	}
}
