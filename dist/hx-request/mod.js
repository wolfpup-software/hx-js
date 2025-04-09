export { dispatchHxRequestFromAnchor, dispatchHxRequestOnSubmit };
// ANCHORS
function getHxRequestEvent(eventTarget) {
    if (eventTarget instanceof HTMLAnchorElement &&
        eventTarget.hasAttribute(":projection")) {
        return new Event("@request", {
            bubbles: true,
            composed: true,
        });
    }
}
function dispatchHxRequestFromAnchor(e) {
    for (let eventTarget of e.composedPath()) {
        let event = getHxRequestEvent(eventTarget);
        if (event) {
            // assuming only happends on click to prevent browser fetch
            e.preventDefault();
            eventTarget.dispatchEvent(event);
            return;
        }
    }
}
// FORMS
function getHxRequestEventFromForm(eventTarget) {
    if (eventTarget instanceof HTMLFormElement &&
        eventTarget.hasAttribute(":projection")) {
        return new Event("@request", {
            bubbles: true,
            composed: true,
        });
    }
}
function dispatchHxRequestOnSubmit(e) {
    let { target } = e;
    let event = getHxRequestEventFromForm(target);
    if (event) {
        e.preventDefault();
        target.dispatchEvent(event);
        return;
    }
}
