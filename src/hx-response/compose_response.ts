interface HxResponseEventImpl {
	response?: Response;
	error: unknown;
}

class HxResponseEvent extends Event {
	projectionTarget: Node;
	response?: Response;
	error: unknown;

	constructor(eventInit?: EventInit) {
		super(":response", eventInit);
	}
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
