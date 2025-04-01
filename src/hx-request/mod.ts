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
	constructor(e: Event, eventInit?: EventInit) {
		super(":request", eventInit);
		this.sourceEvent = e;
	}
}

function getHxRequestEvent(e: Event, eventTarget: EventTarget): Event {
	if (
		eventTarget instanceof HTMLAnchorElement &&
		eventTarget.hasAttribute(":projection")
	) {
		return new HxRequestEvent(e, { bubbles: true, composed: true });
	}
}

function dispatchHxRequestFromAnchor(e: Event): void {
	for (let eventTarget of e.composedPath()) {
		let event = getHxRequestEvent(e, eventTarget);
		if (event) {
			// assuming only happends on click to prevent browser fetch
			e.preventDefault();
			eventTarget.dispatchEvent(event);
			return;
		}
	}
}

function getHxRequestEventFromForm(e: Event, eventTarget: EventTarget): Event {
	if (
		eventTarget instanceof HTMLFormElement &&
		eventTarget.hasAttribute(":projection")
	) {
		return new HxRequestEvent(e, { bubbles: true, composed: true });
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
