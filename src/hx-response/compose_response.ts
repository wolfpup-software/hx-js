interface HxResponseEventImpl {
	response?: Response;
	error: unknown;
}

class HxResponseEvent extends Event {
	projectionTarget: Node | null;
	projectionStyle: string;
	response: Response;

	constructor(
		response: Response,
		projectionTarget: Node | null,
		projectionStyle,
		eventInit?: EventInit,
	) {
		super(":response", eventInit);
		this.response = response;
		this.projectionStyle = projectionStyle;
		this.projectionTarget = projectionTarget;
	}
}

function getProjectionStyle(el: Element) {
	return el.getAttribute(":projection");
}

function getProjectionTarget(e: Event): Node | undefined {
	let { target, currentTarget } = e;
	if (!(target instanceof Element)) return null;

	const selector = target.getAttribute("target") || "_currentTarget";
	if ("_document" === selector) return document;
	if ("_target" === selector) return target;

	if (!(currentTarget instanceof Element)) return null;
	if ("_currentTarget" === selector) return currentTarget;

	currentTarget.querySelector(selector);
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

function buildHxRequest(e: Event): Request | undefined {
	let { target } = e;

	if (target instanceof HTMLAnchorElement) {
		return new Request(target.href);
	}

	if (target instanceof HTMLFormElement) {
		return new Request(target.action, {
			method: target.getAttribute("method") || "get",
			body: new FormData(target),
		});
	}
}

function throttleRequest(
	throttler: WeakMap<Node, AbortController>,
	throttleTarget: Node,
) {
	let el = throttler.get(throttleTarget);
	if (el) el.abort();
}

function getAbortController(target: Element): [AbortController, AbortSignal] {
	let timeoutMs = getTimeoutMs(target);
	let abortController = new AbortController();
	let timeoutAbortSignal = AbortSignal.timeout(timeoutMs);
	let signal = AbortSignal.any([abortController.signal, timeoutAbortSignal]);

	return [abortController, signal];
}

function setThrottler(
	throttler: WeakMap<Node, AbortController>,
	throttleTarget: Node,
	abortController: AbortController,
) {
	let el = throttler.get(throttleTarget);
	if (el) el.abort();

	throttler.set(throttleTarget, abortController);
}

function fetchAndDispatchResponseEvent(
	target: EventTarget,
	request: Request,
	signal: AbortSignal,
	projectionStyle: string,
	projectionTarget: Node,
) {
	fetch(request, {
		signal,
	})
		.then((response) => {
			let event = new HxResponseEvent(
				response,
				projectionTarget,
				projectionStyle,
				{ bubbles: true, composed: true },
			);
			target.dispatchEvent(event);
		})
		.catch((reason: any) => {
			let event = new Event(":response-error");
			target.dispatchEvent(event);
		});
}

async function composeResponse(
	throttler: WeakMap<Node, AbortController>,
	e: Event,
) {
	let { target } = e;
	if (!(target instanceof Element)) return;

	let projectionStyle = target.getAttribute(":projection");
	if (!projectionStyle) return;

	let request = buildHxRequest(e);
	if (!request) return;

	let projectionTarget = getProjectionTarget(e);
	let throttleTarget = getThrottleTarget(e, projectionTarget);

	// set request status on projection and throttle target

	let [abortController, signal] = getAbortController(target);

	setThrottler(throttler, throttleTarget, abortController);

	fetchAndDispatchResponseEvent(
		target,
		request,
		signal,
		projectionStyle,
		projectionTarget,
	);
}

export type { HxResponseEventImpl };
export { composeResponse, HxResponseEvent };
