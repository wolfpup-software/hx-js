import { HxRequestEvent } from "../../hx-request/dist/mod.js";
import { HxAbortSignal } from "./throttler.js";

class HxResponseEvent extends Event {
    sourceEvent: Event;
    response: Response | undefined;
    error: unknown;

    constructor(
        sourceEvent: Event,
    ) {
        super("hx-response", { bubbles: true });
        this.sourceEvent = sourceEvent;
    }
}

async function composeResponse(e: Event, abortSignal: HxAbortSignal) {
    if (!(e.target instanceof Element)) return;

    const placement = e.target.getAttribute("hx-placement");
    if (placement === null) return;

    let request = buildHxRequest(e);
    if (!request) return;
    
    let hxResponse = new HxResponseEvent(e);
    try {
        hxResponse.response = await fetch(request, {
            signal: abortSignal.getSignals()
        });
    } catch (error: unknown) {
        hxResponse.error = error;
    }

    e.target.dispatchEvent(hxResponse);
}

function buildHxRequest(e: Event): Request | undefined {
    if (!(e instanceof HxRequestEvent)) return;

    if (e.target instanceof HTMLAnchorElement) {
        return new Request(e.target.href);
    };

    if (e.target instanceof HTMLFormElement) {
        let submitter = (e.sourceEvent instanceof SubmitEvent)
            ? e.sourceEvent.submitter
            : undefined;

        return new Request(e.target.action, {
            method: e.target.getAttribute("method") || "get",
            body: new FormData(e.target, submitter)
        });
    }
}

export { composeResponse, HxResponseEvent }
