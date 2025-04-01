import { HxRequestEvent } from "../hx-request/mod.js";
// import { HxAbortSignal } from "./throttler.js";

interface HxResponseEventImpl {
	sourceEvent: Event;
	response: Response | undefined;
	error: unknown;
}

class HxResponseEvent extends Event {
	sourceEvent: Event;
	response: Response | undefined;
	error: unknown;

	constructor(sourceEvent: Event) {
		super(":response", {
			bubbles: true,
			composed: sourceEvent.composed,
		});

		this.sourceEvent = sourceEvent;
	}
}

async function composeResponse(e: Event, abortSignal: AbortSignal) {
	if (!(e.target instanceof Element)) return;
	if (!e.target.getAttribute(":projection")) return;

	let request = buildHxRequest(e);
	if (!request) return;


	e.target.setAttribute("hx-status", "requested");
	let hxResponse = new HxResponseEvent(e);
	try {
		hxResponse.response = await fetch(request, {
			signal: abortSignal,
		});
		// e.target.setAttribute("hx-status", "responded");
	} catch (error: unknown) {
		hxResponse.error = error;
		// e.target.setAttribute("hx-status", "response-error");
	}

	if (hxResponse.response)
		e.target.setAttribute(
			"hx-status-code",
			hxResponse.response.status.toString(),
		);

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
