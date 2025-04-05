export { dispatchHxEvent, dispatchHxOnSubmit, HxEvent };
class HxEvent extends Event {
    #action;
    #typeAction;
    #sourceEvent;
    constructor(e, action) {
        super(`:${e.type}`, { bubbles: true, composed: true });
        this.#action = action;
        this.#typeAction = `:${e.type}:${action}`;
        this.#sourceEvent = e;
    }
    get sourceEvent() {
        return this.#sourceEvent;
    }
    get action() {
        return this.#action;
    }
    get typeAction() {
        return this.#typeAction;
    }
}
function getHxEvent(e, node) {
    // start with any elements
    // maybe only inputs buttons forms?
    if (node instanceof Element) {
        let action = node.getAttribute(":");
        if (action)
            return new HxEvent(e, action);
    }
}
function dispatchHxEvent(e) {
    for (let node of e.composedPath()) {
        let event = getHxEvent(e, node);
        if (event)
            node.dispatchEvent(event);
    }
}
function getHxEventFromForm(e) {
    if (e.target instanceof HTMLFormElement) {
        let action = e.target.getAttribute(":");
        if (action)
            return new HxEvent(e, action);
    }
}
function dispatchHxOnSubmit(e) {
    let event = getHxEventFromForm(e);
    if (event) {
        e.preventDefault();
        e.target.dispatchEvent(event);
    }
}
