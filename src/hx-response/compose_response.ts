interface HxResponseEventImpl {
	response?: Response;
	error: unknown;
}

interface ResponseParamsInterface {
	response: Response;
	error?: unknown;
	projectionStyle: string;
	throttleTarget: Node | null;
	projectionTarget: Node | null;
}

// class HxRequestEvent extends Event {
// 	#rp: RequestParamsInterface;

// 	constructor(
// 		type: string,
// 		requestParams: RequestParamsInterface,
// 		eventInit?: EventInit,
// 	) {
// 		super(type, eventInit);
// 		this.#rp = requestParams;
// 	}

// 	get request() {
// 		return this.#rp.request;
// 	}

// 	get projectionStyle() {
// 		return this.#rp.projectionStyle;
// 	}

// 	get throttleTarget() {
// 		return this.#rp.throttleTarget;
// 	}

// 	get projectionTarget() {
// 		return this.#rp.projectionTarget;
// 	}
// }

class HxResponseEvent extends Event {
	projectionTarget: Node;
	response?: Response;
	error: unknown;

	constructor(eventInit?: EventInit) {
		super(":response", eventInit);
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
	let timeoutMs = parseFloat(timeoutMsAttr);
	if (Number.isNaN(timeoutMs)) {
		timeoutMs = 5000;
	}

	return timeoutMs;
}

async function composeResponse(e: Event, abortSignal: AbortSignal) {
	if (!(e.target instanceof Element)) return;
	if (!e.target.getAttribute(":projection")) return;

	let request = buildHxRequest(e);
	if (!request) return;

	let hxResponse = new HxResponseEvent(e);
	try {
		hxResponse.response = await fetch(request, {
			signal: abortSignal,
		});
	} catch (error: unknown) {
		hxResponse.error = error;
	}

	e.target.dispatchEvent(hxResponse);
}

function buildHxRequest(e: Event): Request | undefined {
	if (e.target instanceof HTMLAnchorElement) {
		return new Request(e.target.href);
	}

	if (e.target instanceof HTMLFormElement) {
		return new Request(e.target.action, {
			method: e.target.getAttribute("method") || "get",
			body: new FormData(e.target),
		});
	}
}

export type { HxResponseEventImpl };
export { composeResponse, HxResponseEvent };
