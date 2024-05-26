import { HxRequestEvent } from "../../hx-request/dist/mod.js";

class HxResponseEvent extends Event {
    sourceEvent: Event;
    request: Request;
    response: Response;
    text: string;
    node: Node | undefined;
    error: unknown;

    constructor(
        type: string,
        sourceEvent: Event,
        request: Request,
        response: Response,
        text: string,
        node: Node | undefined,
        error: unknown,
    ) {
        super(type, { bubbles: true });
        this.sourceEvent = sourceEvent;
        this.request = request;
        this.response = response;
        this.text = text;
        this.node = node;
        this.error = error;
    }
}

async function composeResponse(e: Event) {
    // quietly fail if requirements not met
    let request = buildHxRequest(e);
    if (!request) return;
    if (!(e.target instanceof Element)) return;

    const target = e.target.getAttribute("target");
    const placement = e.target.getAttribute("hx-placement");
    if (!(target && placement)) return;

    // valid hx request
    let response: Response;
    let text: string;
    try {
        // FETCH THROWS ERROR
        response = await fetch(request);
        text = await response.text();
    } catch (error: unknown) {
        // hx-response-error
        e.target.dispatchEvent(new HxResponseEvent("hx-request-error", e, request, response, text, undefined, error))
        return;
    }

    placeHxResponse(e, request, response, text, target, placement);
}

function buildHxRequest(e: Event): Request | undefined {
    if (!(e instanceof HxRequestEvent)) return;

    if (e.target instanceof HTMLAnchorElement) {
        return new Request(e.target.href);
    };

    if (e.target instanceof HTMLFormElement) {
        const method = e.target.getAttribute("method") ?? "get";

        let submitter;
        if (e.sourceEvent instanceof SubmitEvent) submitter = e.sourceEvent.submitter;
        const body = new FormData(e.target, submitter);
        
        return new Request(e.target.action, { method, body });
    }
}

// throws Error, querySelector and insertions
function placeHxResponse(
    e: Event,
    request: Request,
    response: Response,
    text: string,
    selector: string,
    placement: string,
) {
    queueMicrotask(function () {
        if (!(e.target instanceof HTMLElement && e.currentTarget instanceof HTMLElement)) return;

        // need a way of inserting stuff
        // but when stuff doesn't happen we send an error
        let error: unknown;
        let template: Node | undefined;
        let confirmed: Node | undefined;
        try {
            let target: Element | null | undefined;
            if (selector === "_target") target = e.target;
            if (selector === "_currentTarget") target = e.currentTarget;
            if (!target) target = e.currentTarget.querySelector(selector);
            if (!(target instanceof Node)) return;

            template = dangerouslyBuildTemplate(text)

            // placement strategy
            if (placement === "none") confirmed = target;
            if (placement === "start") confirmed = template.insertBefore(target, target.firstChild);
            if (placement === "end") confirmed = target.appendChild(template);

            const parent = target.parentElement;
            if (parent) {
                if (placement === "replace") confirmed = parent.replaceChild(template, target);
                if (placement === "remove") confirmed = parent.removeChild(target);
                if (placement === "before") confirmed = template.insertBefore(parent, target);
                if (placement === "after") confirmed = template.insertBefore(parent, target.nextSibling);
            };

            if (!confirmed) error = new Error("hx-response error - placement failed");
        } catch (err: unknown) {
            error = err;
        }

        let type = error ? "hx-response-error" : "hx-response-success";
        e.target.dispatchEvent(new HxResponseEvent(type, e, request, response, text, template, error))
    });
}

function dangerouslyBuildTemplate(text: string) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl.content.cloneNode(true);
}

export { composeResponse }
