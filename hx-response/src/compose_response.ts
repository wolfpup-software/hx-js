import { HxRequestEvent } from "../../hx-request/dist/mod.js";
import { HxAbortSignal } from "./throttler.js";

interface HxResponseEventImpl {
    sourceEvent: Event;
    response: Response | undefined;
    error: unknown;
}

class HxResponseEvent extends Event {
    sourceEvent: Event;
    response: Response | undefined;
    error: unknown;

    constructor(
        sourceEvent: Event,
    ) {
        super("hx-response", {
            bubbles: true,
            composed: sourceEvent.composed,
        });

        this.sourceEvent = sourceEvent;
    }
}

async function composeResponse(e: Event, abortSignal: HxAbortSignal) {
    if (!(e.target instanceof Element)) return;
    if (!e.target.getAttribute("hx-projection")) return;

    let request = buildHxRequest(e);
    if (!request) return;

    e.target.removeAttribute("hx-status-code");

    e.target.setAttribute("hx-status", "requested");
    let hxResponse = new HxResponseEvent(e);
    try {
        hxResponse.response = await fetch(request, {
            signal: abortSignal.getSignals(),
        });
        e.target.setAttribute("hx-status", "responded")
    } catch (error: unknown) {
        hxResponse.error = error;
        e.target.setAttribute("hx-status", "error")
    }

    if (hxResponse.response)
        e.target.setAttribute(
            "hx-status-code",
            hxResponse.response.status.toString(),
        );
    
    e.target.dispatchEvent(hxResponse);
}

function buildHxRequest(e: Event): Request | undefined {
    if (!(e instanceof HxRequestEvent)) return;

    if (e.target instanceof HTMLAnchorElement) {
        return new Request(e.target.href);
    };

    if (e.target instanceof HTMLFormElement) {
        let submitter: HTMLElement | undefined;
        if (e.sourceEvent instanceof SubmitEvent)
            submitter = e.sourceEvent.submitter;

        return new Request(e.target.action, {
            method: e.target.getAttribute("method") || "get",
            body: new FormData(e.target, submitter)
        });
    }
}

export type { HxResponseEventImpl }
export { composeResponse, HxResponseEvent }
