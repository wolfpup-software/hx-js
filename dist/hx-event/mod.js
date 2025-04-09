export { dispatchHxEvent, dispatchHxFromForm, HxEvent };
class HxEvent extends Event {
    #action;
    #actionType;
    #sourceEvent;
    constructor(e, type, action) {
        super("@event", { bubbles: true, composed: true });
        this.#action = action;
        this.#actionType = type;
        this.#sourceEvent = e;
    }
    get action() {
        return this.#action;
    }
    get actionType() {
        return this.#actionType;
    }
    get sourceEvent() {
        return this.#sourceEvent;
    }
}
function getAtmark(eventType) {
    return `.${eventType}`;
}
function getHxEvent(e, type, node) {
    if (node instanceof Element) {
        let action = node.getAttribute(type);
        if (action)
            return new HxEvent(e, type, action);
    }
}
function dispatchHxEvent(e) {
    let type = getAtmark(e.type);
    for (let node of e.composedPath()) {
        let event = getHxEvent(e, type, node);
        if (event)
            node.dispatchEvent(event);
    }
}
function getHxEventFromForm(e) {
    if (e.target instanceof HTMLFormElement) {
        let type = getAtmark(e.type);
        let action = e.target.getAttribute(type);
        if (action)
            return new HxEvent(e, type, action);
    }
}
function dispatchHxFromForm(e) {
    let event = getHxEventFromForm(e);
    if (event) {
        e.preventDefault();
        e.target.dispatchEvent(event);
    }
}
