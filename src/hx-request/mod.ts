export type { HxRequestEventInterface };
export {
	dispatchHxRequestFromAnchor,
	dispatchHxRequestOnSubmit,
	HxRequestEvent,
};

interface HxRequestEventInterface extends Event {
	sourceEvent: Event;
}

class HxRequestEvent extends Event implements HxRequestEventInterface {
	sourceEvent: Event;
	constructor(e: Event, composed: boolean) {
		super(":request", { bubbles: true, composed });
		this.sourceEvent = e;
	}
}

function getHxRequestEvent(e: Event, node: EventTarget): Event {
	if (node instanceof HTMLAnchorElement && node.hasAttribute(":projection")) {
		return new HxRequestEvent(e, true);
	}
}

function dispatchHxRequestFromAnchor(e: Event): void {
	for (let node of e.composedPath()) {
		let event = getHxRequestEvent(e, node);
		if (event) {
			// assuming only happends on click to prevent browser fetch
			e.preventDefault();
			node.dispatchEvent(event);
			return;
		}
	}
}

function getHxRequestEventFromForm(e: Event, node: EventTarget): Event {
	if (node instanceof HTMLFormElement && node.hasAttribute(":projection")) {
		return new HxRequestEvent(e, true);
	}
}

// on submit
function dispatchHxRequestOnSubmit(e: Event): void {
	let { target } = e;
	let event = getHxRequestEventFromForm(e, target);
	if (event) {
		e.preventDefault();
		target.dispatchEvent(event);
		return;
	}
}
