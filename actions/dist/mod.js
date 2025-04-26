export { dispatchHxAction, HxEvent };
class HxEvent extends Event {
    #action;
    #sourceEvent;
    constructor(e, action) {
        super("#action", { bubbles: true, composed: true });
        this.#action = action;
        this.#sourceEvent = e;
    }
    get action() {
        return this.#action;
    }
    get sourceEvent() {
        return this.#sourceEvent;
    }
}
function getEventAttr(eventType) {
    return `_${eventType}_`;
}
function getHxEvent(e, type, el) {
    let action = el.getAttribute(type);
    if (action)
        return new HxEvent(e, action);
}
function dispatchHxAction(e) {
    let kind = getEventAttr(e.type);
    for (let node of e.composedPath()) {
        if (node instanceof Element) {
            let event = getHxEvent(e, kind, node);
            if (event)
                node.dispatchEvent(event);
            if (node.hasAttribute(`${kind}prevent-default_`))
                e.preventDefault();
            if (node.hasAttribute(`${kind}stop-propagation_`))
                return;
        }
    }
}
