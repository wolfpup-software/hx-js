export { dispatchHxRequestFromAnchor, dispatchHxRequestOnSubmit };

// ANCHORS
function getHxRequestEvent(eventTarget: EventTarget): Event {
	if (
		eventTarget instanceof HTMLAnchorElement &&
		eventTarget.hasAttribute(":projection")
	) {
		return new Event("@request", {
			bubbles: true,
			composed: true,
		});
	}
}

function dispatchHxRequestFromAnchor(e: Event): void {
	for (let eventTarget of e.composedPath()) {
		let event = getHxRequestEvent(eventTarget);
		if (event) {
			// assuming only happends on click to prevent browser fetch
			e.preventDefault();
			eventTarget.dispatchEvent(event);
			return;
		}
	}
}

// FORMS
function getHxRequestEventFromForm(eventTarget: EventTarget): Event {
	if (
		eventTarget instanceof HTMLFormElement &&
		eventTarget.hasAttribute(":projection")
	) {
		return new Event("@request", {
			bubbles: true,
			composed: true,
		});
	}
}

function dispatchHxRequestOnSubmit(e: Event): void {
	let { target } = e;
	let event = getHxRequestEventFromForm(target);
	if (event) {
		e.preventDefault();
		target.dispatchEvent(event);
		return;
	}
}
