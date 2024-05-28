import { HxResponseEvent } from "../../hx-response/dist/mod.js"

interface HxProjectEventImpl {
    sourceEvent: Event;
    node: Node | undefined;
    fragment: Node | undefined;
    error: unknown;
}

class HxProjectEvent extends Event implements HxProjectEventImpl{
    sourceEvent: Event;
    node: Node | undefined;
    fragment: Node | undefined;
    error: unknown;

    constructor(
        sourceEvent: Event,
    ) {
        super("hx-project", {
            bubbles: true,
            composed: sourceEvent.composed,
        });

        this.sourceEvent = sourceEvent;
    }
}

function projectPlacement(e: Event, targetNode: Node, fragment: Node): Node | undefined {
    if (!(e.target instanceof Element)) return;

    const placement = e.target.getAttribute("hx-placement");
    switch(placement) {
        case "none": return targetNode;
        case "start": return fragment.insertBefore(targetNode, targetNode.firstChild);
        case "end": return targetNode.appendChild(fragment);
    }

    const parent = targetNode.parentElement;
    if (parent) {
        switch(placement) {
            case "replace": return parent.replaceChild(fragment, targetNode);
            case "remove": return parent.removeChild(targetNode);
            case "before": return fragment.insertBefore(parent, targetNode);
            case "after": return fragment.insertBefore(parent, targetNode.nextSibling);
        }
    };

    throw new Error("hx projection failed");
}

function getTarget(e: Event): Node | undefined {
    if (!(e.target instanceof Element && e.currentTarget instanceof Element)) return;

    const selector = e.target.getAttribute("target") || "_currentTarget";
    
    switch(selector) {
        case "_target": return e.target;
        case "_currentTarget": return e.currentTarget;
        case "_document": return document;
    }

    return e.currentTarget.querySelector(selector);
}

function dangerouslyBuildTemplate(response: Response, text: string): Node {
    let status = response.status;
    if (status < 200 || status > 299) {
        throw new Error(`status-code: ${status}`);
    };
    let contentType = response.headers.get("content-type")
    if (contentType !== "text/html; charset=utf-8") {
        throw new Error(`content-type: ${contentType}`);
    };

    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;

    return templateEl.content.cloneNode(true);
}

async function projectHxResponse(e: Event) {
    if (!(e instanceof HxResponseEvent) || e.error || !e.response) return;
    if (!(e.target instanceof HTMLAnchorElement || e.target instanceof HTMLFormElement)) return;

    const text = await e.response.text();

    queueMicrotask(function() {
        const event = new HxProjectEvent(e);

        try {
            event.node = getTarget(e);
            if (event.node) event.fragment = dangerouslyBuildTemplate(e.response, text);
            if (event.fragment) projectPlacement(e, event.node, event.fragment);
        } catch (err: unknown) {
            event.error = err;
        }

        e.target.dispatchEvent(event);
    });
}

export type { HxProjectEventImpl }
export { projectHxResponse, HxProjectEvent }
