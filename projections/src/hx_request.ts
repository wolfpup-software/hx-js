export { dispatchHxRequestFromAnchor, dispatchHxRequestOnSubmit };

// ANCHORS
function getHxRequestEvent(eventTarget: HTMLAnchorElement): Event {
	if (
		eventTarget instanceof HTMLAnchorElement &&
		eventTarget.hasAttribute("_projection")
	) {
		return new Event("#request", {
			bubbles: true,
			composed: true,
		});
	}
}

function dispatchHxRequestFromAnchor(e: Event): void {
	for (let eventTarget of e.composedPath()) {
		if (eventTarget instanceof HTMLAnchorElement) {
			let event = getHxRequestEvent(eventTarget);
			if (event) {
				// assuming only happends on click to prevent browser fetch
				e.preventDefault();
				// gather all nested?
				eventTarget.dispatchEvent(event);
			}

			if (eventTarget.hasAttribute("_stop-propagation")) return;
		}
	}
}

// FORMS
function getHxRequestEventFromForm(eventTarget: EventTarget): Event {
	if (
		eventTarget instanceof HTMLFormElement &&
		eventTarget.hasAttribute("_submit")
	) {
		return new Event("#request", {
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
