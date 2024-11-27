interface HxRequestEventImpl extends Event {
	sourceEvent: Event;
}

class HxRequestEvent extends Event implements HxRequestEventImpl {
	sourceEvent: Event;
	constructor(e: Event, composed: boolean) {
		super("hx-request", { bubbles: true, composed });
		this.sourceEvent = e;
	}
}

function getHxElement(e: Event): Element | undefined {
	if (e.target instanceof HTMLFormElement) return e.target;
	if (!(e.target instanceof Element)) return;

	let node: Element | null = e.target;
	while (node && node !== e.currentTarget) {
		if (node instanceof HTMLAnchorElement) return node;
		node = node.parentElement;
	}
}

function onHx(e: Event): void {
	const el = getHxElement(e);
	if (!el) return;
	if (!el.getAttribute("hx-projection")) return;

	e.preventDefault();

	const composed = el.getAttribute("hx-composed") !== null;
	el.dispatchEvent(new HxRequestEvent(e, composed));
}

export type { HxRequestEventImpl };
export { onHx, HxRequestEvent };
