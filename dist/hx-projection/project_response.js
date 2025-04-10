import { HxResponseEvent } from "../hx-response/mod.js";
class HxProjectEvent extends Event {
    #params;
    constructor(params) {
        super("#projection", {
            bubbles: true,
            composed: true,
        });
        this.#params = params;
    }
    get projectionTarget() {
        return this.#params.projectionTarget;
    }
    get projectedFragment() {
        return this.#params.projectedFragment;
    }
    get disconnectedFragment() {
        return this.#params.projectedFragment;
    }
    get projectionStyle() {
        return this.#params.projectionStyle;
    }
}
function projectPlacement(projectionTarget, template, projectionStyle) {
    let fragment = template.content.cloneNode(true);
    let removedFragment;
    if (projectionTarget instanceof Element ||
        projectionTarget instanceof Document ||
        projectionTarget instanceof DocumentFragment) {
        if ("start" === projectionStyle) {
            projectionTarget.insertBefore(fragment, projectionTarget.firstChild);
        }
        if ("end" === projectionStyle) {
            projectionTarget.appendChild(fragment);
        }
        if ("replace_children" === projectionStyle) {
            // get list of childNodes
            // add nodes to fragmentQ
            projectionTarget.replaceChildren(fragment);
        }
        if ("remove_children" === projectionStyle) {
            // get list of childNodes
            // add nodes to fragmentQ
            projectionTarget.replaceChildren();
        }
        const { parentElement } = projectionTarget;
        if (parentElement) {
            if ("replace" === projectionStyle) {
                removedFragment = parentElement.replaceChild(fragment, projectionTarget);
            }
            if ("remove" === projectionStyle) {
                removedFragment = parentElement.removeChild(projectionTarget);
            }
            if ("before" === projectionStyle)
                parentElement.insertBefore(fragment, projectionTarget);
            if ("after" === projectionStyle)
                parentElement.insertBefore(fragment, projectionTarget.nextSibling);
        }
    }
    return [fragment, removedFragment];
}
function dispatchHxProjection(e) {
    if (!(e instanceof HxResponseEvent))
        return;
    let { projectionStyle, projectionTarget, template } = e;
    let [projectedFragment, disconnectedFragment] = projectPlacement(projectionTarget, template, projectionStyle);
    e.target.dispatchEvent(new HxProjectEvent({
        projectionTarget,
        projectedFragment,
        disconnectedFragment,
        projectionStyle,
    }));
}
export { dispatchHxProjection, HxProjectEvent };
