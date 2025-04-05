import { HxResponseEvent } from "../hx-response/mod.js";
class HxProjectEvent extends Event {
    sourceEvent;
    node;
    fragment;
    error;
    constructor(sourceEvent) {
        super(":project", {
            bubbles: true,
            composed: sourceEvent.composed,
        });
        this.sourceEvent = sourceEvent;
    }
}
function projectPlacement(projectionTarget, template, projectionStyle) {
    let fragment = template.content.cloneNode(true);
    if ("none" === projectionStyle)
        return;
    if ("start" === projectionStyle)
        return projectionTarget.insertBefore(fragment, projectionTarget.firstChild);
    if ("end" === projectionStyle)
        return projectionTarget.appendChild(fragment);
    const { parentElement } = projectionTarget;
    if (parentElement) {
        if ("replace" === projectionStyle)
            return parentElement.replaceChild(fragment, projectionTarget);
        if ("remove" === projectionStyle)
            return parentElement.removeChild(projectionTarget);
        if ("before" === projectionStyle)
            return parentElement.insertBefore(fragment, projectionTarget);
        if ("after" === projectionStyle)
            return parentElement.insertBefore(fragment, projectionTarget.nextSibling);
    }
    if (projectionTarget instanceof Element ||
        projectionTarget instanceof Document ||
        projectionTarget instanceof DocumentFragment) {
        if ("replace_children" === projectionStyle) {
            projectionTarget.replaceChildren(fragment);
            return projectionTarget;
        }
        if ("remove_children" === projectionStyle) {
            projectionTarget.replaceChildren();
            return projectionTarget;
        }
    }
}
function dispatchHxProjection(e) {
    if (!(e instanceof HxResponseEvent))
        return;
    console.log(e);
    let { projectionStyle, projectionTarget, template } = e;
    projectPlacement(projectionTarget, template, projectionStyle);
}
export { dispatchHxProjection, HxProjectEvent };
