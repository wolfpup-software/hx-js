import { HxRequestEvent } from "../../hx-request/dist/mod.js";
import { HxAbortSignal, Throttler } from "./throttler.js";

class ResponseDetails {
    request: Request;
    response: Response | undefined;
    text: string | undefined;
    error: unknown;
}

class HxResponseEvent extends Event {
    sourceEvent: Event;
    details: ResponseDetails;

    constructor(
        type: string,
        sourceEvent: Event,
        details: ResponseDetails,
    ) {
        super(type, { bubbles: true });
        this.sourceEvent = sourceEvent;
        this.details = details;
    }
}

async function composeResponse(e: Event, abortSignal: HxAbortSignal) {
    if (!(e.target instanceof Element)) return;

    const target = e.target.getAttribute("target");
    const placement = e.target.getAttribute("hx-placement");
    if (!(target && placement)) return;

    let request = buildHxRequest(e);
    if (!request) return;
    
    // valid hx request
    let details = new ResponseDetails();
    details.request = request;
    try {
        details.response = await fetch(details.request, {
            signal: abortSignal.getSignals()
        });
    } catch (error: unknown) {
        details.error = error;
    }

    details.text = await details.response.text();
    e.target.dispatchEvent(new HxResponseEvent("hx-response", e, details));
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

export { composeResponse, ResponseDetails, HxResponseEvent }
