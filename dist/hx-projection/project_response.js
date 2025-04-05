import { HxResponseEvent } from "../hx-response/mod.js";
class HxProjectEvent extends Event {
    #params;
    constructor(params) {
        super(":projection", {
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
    let results = [fragment, undefined];
    if ("start" === projectionStyle) {
        projectionTarget.insertBefore(fragment, projectionTarget.firstChild);
    }
    if ("end" === projectionStyle) {
        projectionTarget.appendChild(fragment);
    }
    const { parentElement } = projectionTarget;
    if (parentElement) {
        if ("replace" === projectionStyle) {
            parentElement.replaceChild(fragment, projectionTarget);
        }
        if ("remove" === projectionStyle) {
            parentElement.removeChild(projectionTarget);
        }
        if ("before" === projectionStyle)
            parentElement.insertBefore(fragment, projectionTarget);
        if ("after" === projectionStyle)
            parentElement.insertBefore(fragment, projectionTarget.nextSibling);
    }
    if (projectionTarget instanceof Element ||
        projectionTarget instanceof Document ||
        projectionTarget instanceof DocumentFragment) {
        if ("replace_children" === projectionStyle) {
            projectionTarget.replaceChildren(fragment);
        }
        if ("remove_children" === projectionStyle) {
            projectionTarget.replaceChildren();
        }
    }
    return results;
}
function dispatchHxProjection(e) {
    if (!(e instanceof HxResponseEvent))
        return;
    let { projectionStyle, projectionTarget, template } = e;
    let [projectedFragment, disconnectedFragment] = projectPlacement(projectionTarget, template, projectionStyle);
    e.target.dispatchEvent(new HxProjectEvent({ projectionTarget, projectedFragment, disconnectedFragment, projectionStyle }));
}
export { dispatchHxProjection, HxProjectEvent };
