export { dispatchHxRequestFromAnchor, dispatchHxRequestOnSubmit };

interface RequestParamsInterface {
	request: Request;
	timeoutMs: number;
	projectionStyle: string;
	throttleTarget: Node | null;
	projectionTarget: Node | null;
}

class HxRequestEvent extends Event {
	#rp: RequestParamsInterface;

	constructor(
		type: string,
		requestParams: RequestParamsInterface,
		eventInit?: EventInit,
	) {
		super(type, eventInit);
		this.#rp = requestParams;
	}

	get request() {
		return this.#rp.request;
	}

	get projectionStyle() {
		return this.#rp.projectionStyle;
	}

	get throttleTarget() {
		return this.#rp.throttleTarget;
	}

	get projectionTarget() {
		return this.#rp.projectionTarget;
	}
}

function getProjectionTarget(e: Event): Node | undefined {
	if (!(e.target instanceof Element)) return null;

	const selector = e.target.getAttribute("target") || "_currentTarget";
	if ("_document" === selector) return document;
	if ("_target" === selector) return e.target;

	if (!(e.currentTarget instanceof Element)) return null;
	if ("_currentTarget" === selector) return e.currentTarget;

	e.currentTarget.querySelectorAll(selector);
}

function getThrottleTarget(e: Event, projectionTarget: Node) {
	if (!(e.target instanceof Element)) return null;

	const selector = e.target.getAttribute(":throttle") || "none";
	if ("_projectionTarget" === selector) return projectionTarget;
	if ("_document" === selector) return document;
	if ("_target" === selector) return e.target;

	if (!(e.currentTarget instanceof Element)) return null;
	if ("_currentTarget" === selector) return e.currentTarget;
}

function getTimeoutMs(el: Element) {
	let timeoutMsAttr = el.getAttribute(":timeout-ms");
	if (!timeoutMsAttr) {
		return 5000;
	}

	let timeoutMs = parseFloat(timeoutMsAttr);
	if (Number.isNaN(timeoutMs)) {
		timeoutMs = 5000;
	}

	return timeoutMs;
}

// ANCHORS
function getReqParams(
	e: Event,
	eventTarget: EventTarget,
): RequestParamsInterface {
	if (!(eventTarget instanceof HTMLAnchorElement)) return;

	// not an hx request
	let projectionStyle = eventTarget.getAttribute(":projection");
	if (!projectionStyle) return;

	let projectionTarget = getProjectionTarget(e);

	return {
		request: new Request(eventTarget.href),
		throttleTarget: getThrottleTarget(e, projectionTarget),
		timeoutMs: getTimeoutMs(eventTarget),
		projectionStyle,
		projectionTarget,
	};
}

function getHxRequestEvent(e: Event, eventTarget: EventTarget): Event {
	let reqParams = getReqParams(e, eventTarget);
	if (reqParams) {
		return new HxRequestEvent(":request", reqParams, {
			bubbles: true,
			composed: true,
		});
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

// FORMS
function getReqFormParams(
	e: Event,
	eventTarget: EventTarget,
): RequestParamsInterface {
	if (!(eventTarget instanceof HTMLFormElement)) return;

	// not an hx request
	let projectionStyle = eventTarget.getAttribute(":projection");
	if (!projectionStyle) return;

	let request = new Request(eventTarget.action, {
		method: eventTarget.getAttribute("method") || "get",
		body: new FormData(eventTarget),
	});

	let projectionTarget = getProjectionTarget(e);

	return {
		throttleTarget: getThrottleTarget(e, projectionTarget),
		timeoutMs: getTimeoutMs(eventTarget),
		request,
		projectionStyle,
		projectionTarget,
	};
}

function getHxRequestEventFromForm(e: Event, eventTarget: EventTarget): Event {
	let reqParams = getReqFormParams(e, eventTarget);
	if (reqParams) {
		return new HxRequestEvent(":request", reqParams, {
			bubbles: true,
			composed: true,
		});
	}
}

function dispatchHxRequestOnSubmit(e: Event): void {
	let { target } = e;
	let event = getHxRequestEventFromForm(e, target);
	if (event) {
		e.preventDefault();
		target.dispatchEvent(event);
		return;
	}
}
