import { HxRequestEvent } from "../../hx-core/dist/mod.js";

class HxResponseEvent extends Event {
    error: unknown;
    sourceEvent: Event;
    request: Request;
    response: Response;
    text: string;
    node: Node | undefined;

    constructor(
        type: string,
        e: unknown,
        sourceEvent: Event,
        request: Request,
        response: Response,
        text: string,
        node: Node | undefined,
    ) {         
        super(type, {bubbles: true});
        this.error = e;
        this.sourceEvent = sourceEvent;
        this.request = request;
        this.response = response;
        this.text = text;
        this.node = node;
    }
}

async function composeResponse(e: Event) {
    let request = buildHxRequest(e);
    if (!request) return;
    if (!(e.target instanceof Element)) return;

    const target = e.target.getAttribute("target");
    const placement = e.target.getAttribute("hx-placement");
    if (!(target && placement)) return;

    let response: Response;
    let text: string;
    try {
        // FETCH THROWS ERROR
        response = await fetch(request);
        text = await response.text();
    } catch (e) {
        // hx-response-error
        // e.target.dispatchEvent(new HxRequestEvent());
        return;
    }

    placeHxResponse(e, request, response, text, target, placement);
}

function buildHxRequest(e: Event): Request | undefined {
    if (!(e instanceof HxRequestEvent)) return;    
    
    if (e.target instanceof HTMLAnchorElement) {
        return new Request(e.target.href);
    };

    let submitter;
    if (e.sourceEvent instanceof SubmitEvent) {
        submitter = e.sourceEvent.submitter;
    }

    if (e.target instanceof HTMLFormElement) {
        const method = e.target.getAttribute("method") ?? "get";
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

        let error: unknown;
        let template: Node | undefined = undefined;
        try {
            let target: Element | null | undefined;
            if (selector === "_target") target = e.target;
            if (selector === "_currentTarget") target = e.currentTarget;
            if (!target) target = e.currentTarget.querySelector(selector);
            if (target instanceof Node) {
                // DANGEROUSLY build template
                template = buildTemplate(text)

                // placement strategy
                if (placement === "none") return;
                if (placement === "start") return template.insertBefore(target, target.firstChild);
                if (placement === "end") return target.appendChild(template);

                const parent = target.parentElement;
                if (parent) {
                    if (placement === "replace") return parent.replaceChild(template, target);
                    if (placement === "remove") return parent.removeChild(target);
                    if (placement === "before") return template.insertBefore(parent, target);
                    if (placement === "after") return template.insertBefore(parent, target.nextSibling);
                };
            };

            error = new Error("hx-response error - placement failed");
        } catch (err: unknown) {
            error = err;
        }

        let type = error ? "hx-response-error" : "hx-response-success";
        e.target.dispatchEvent(new HxResponseEvent(type, error, e, request, response, text, template))
    });
}

function buildTemplate(text: string) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl.content.cloneNode(true);
}

export { composeResponse }
