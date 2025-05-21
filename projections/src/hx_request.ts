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

function getEventAttr(eventType: string) {
	return `_${eventType}`;
}

function getHxRequestEvent(
	e: Event,
	type: string,
	el: Element,
): Event | undefined {
	let action = el.getAttribute(type);
	
	if (action) return new HxRequestEvent(action, e);
}

function dispatchHxRequest(e: Event): void {
	let kind = getEventAttr(e.type);
	for (let node of e.composedPath()) {
		if (node instanceof Element) {
			let event = getHxRequestEvent(e, kind, node);
			if (event) node.dispatchEvent(event);
			if (node.hasAttribute(`${kind}_prevent-default`)) e.preventDefault();
			if (node.hasAttribute(`${kind}_stop-propagation`)) return;
		}
	}
}
