import { ResponseDetails, HxResponseEvent } from "../../hx-response/dist/mod.js"

// cache templates here
//
//

// throws Error, querySelector and insertions
function renderHxResponse(
    e: Event,
    details: ResponseDetails,
    selector: string,
    placement: string,
) {
    queueMicrotask(function () {
        if (!(e.target instanceof HTMLElement && e.currentTarget instanceof HTMLElement)) return;

        let confirmed: Node | undefined;
        try {
            let target: Node | null | undefined;
            if (selector === "_target") target = e.target;
            if (selector === "_currentTarget") target = e.currentTarget;
            if (selector === "_document") target = document;
            if (!target) target = e.currentTarget.querySelector(selector);
            if (target instanceof Node) {
                details.node = dangerouslyBuildTemplate(details.text)

                // placement strategy
                if (placement === "none") confirmed = target;
                if (placement === "start") confirmed = details.node.insertBefore(target, target.firstChild);
                if (placement === "end") confirmed = target.appendChild(details.node);
    
                const parent = target.parentElement;
                if (parent) {
                    if (placement === "replace") confirmed = parent.replaceChild(details.node, target);
                    if (placement === "remove") confirmed = parent.removeChild(target);
                    if (placement === "before") confirmed = details.node.insertBefore(parent, target);
                    if (placement === "after") confirmed = details.node.insertBefore(parent, target.nextSibling);
                };
            };
        } catch (error: unknown) {
            details.error = error;
        }

        let type = (details.error || !confirmed) ? "hx-response-error" : "hx-response";
        e.target.dispatchEvent(new HxResponseEvent(type, e, details));
    });
}

function dangerouslyBuildTemplate(text: string) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl.content.cloneNode(true);
}

export { renderHxResponse }
