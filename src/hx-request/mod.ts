export type { HxRequestEventInterface };
export { dispastchHxRequestFromAnchor, dispatchHxRequestOnSubmit, HxRequestEvent };

interface HxRequestEventInterface extends Event {
	sourceEvent: Event;
}

class HxRequestEvent extends Event implements HxRequestEventInterface {
	sourceEvent: Event;
	constructor(e: Event, composed: boolean) {
		super("hx-request", { bubbles: true, composed });
		this.sourceEvent = e;
	}
}

function getHxRequestEvent(e: Event, node: EventTarget): Event {
	if (node instanceof HTMLAnchorElement) {
		let projection = node.getAttribute("hx-projection");
		if (projection) {
			return new HxRequestEvent(e, true);
		}
	}
}

function dispastchHxRequestFromAnchor(e: Event): void {
	for (let node of e.composedPath()) {
		let event = getHxRequestEvent(e, node);
		if (event) {
			// Clicks will trigger an html response from browser
			// all other events will not,
			// Fine to hard-code.
			//
			if (e.type === "click") {
				e.preventDefault();
			}

			node.dispatchEvent(event);
			return;
		}
	}
}

function getHxRequestEventFromForm(e: Event, node: EventTarget): Event {
	if (node instanceof HTMLFormElement) {
		let projection = node.getAttribute("hx-projection");
		if (projection) {
			return new HxRequestEvent(e, true);
		}
	}
}

// on submit
function dispatchHxRequestOnSubmit(e: Event): void {
	let event = getHxRequestEventFromForm(e, e.target);
	if (event) {
		e.preventDefault();
		e.target.dispatchEvent(event);
		return;
	};
}
