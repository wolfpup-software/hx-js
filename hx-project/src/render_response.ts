import { HxResponseEvent } from "../../hx-response/dist/mod.js"

const placements = new Set(["none"])

class HxProjectEvent extends Event {
    sourceEvent: Event;
    node: Node | undefined;
    fragment: Node | undefined;
    error: unknown;

    constructor(
        sourceEvent: Event,
    ) {
        super("hx-project", { bubbles: true, composed: sourceEvent.composed });
        this.sourceEvent = sourceEvent;
    }
}

async function projectHxResponse(
    e: Event,
) {
    if (!(e instanceof HxResponseEvent)) return;
    if (!(e.target instanceof HTMLElement)) return;

    // TODO: handle errors
    if (!e.response) return;
    const text = await e.response.text()

    queueMicrotask(function () {
        if (!(e.target instanceof HTMLElement && e.currentTarget instanceof HTMLElement)) return;

        const placement = e.target.getAttribute("hx-placement");
        if (placements.has(placement)) return;
        
        const selector = e.target.getAttribute("target") || "_currentTarget";

        let targetNode: Node | null | undefined;
        if (selector === "_target") targetNode = e.target;
        if (selector === "_currentTarget") targetNode = e.currentTarget;
        if (selector === "_document") targetNode = document;

        const event = new HxProjectEvent(e);
        try {
            if (!targetNode) targetNode = e.currentTarget.querySelector(selector);
            if (targetNode instanceof Node) {
                event.fragment = dangerouslyBuildTemplate(e.response, text)
            }

            if (event.fragment) {
                if (placement === "none") targetNode;
                if (placement === "start") event.fragment.insertBefore(targetNode, targetNode.firstChild);
                if (placement === "end") targetNode.appendChild(event.fragment);
    
                const parent = targetNode.parentElement;
                if (parent) {
                    if (placement === "replace") parent.replaceChild(event.fragment, targetNode);
                    if (placement === "remove") parent.removeChild(targetNode);
                    if (placement === "before") event.fragment.insertBefore(parent, targetNode);
                    if (placement === "after") event.fragment.insertBefore(parent, targetNode.nextSibling);
                };
            };
        } catch (err: unknown) {
            event.error = err;
        }

        e.target.dispatchEvent(event);
    });
}

function dangerouslyBuildTemplate(response: Response, text: string) {
    if (response.status < 200 && response.status > 300) return;

    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl.content.cloneNode(true);
}

export { projectHxResponse }
