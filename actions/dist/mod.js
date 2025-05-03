export { dispatchHxAction, HxActionEvent, HxActions };
class HxActionEvent extends Event {
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
class HxActions {
    #eventNames;
    constructor(eventNames) {
        this.#eventNames = eventNames;
    }
    connect(el) {
        // interactions
        for (let name of this.#eventNames) {
            el.addEventListener(name, dispatchHxAction);
        }
    }
    disconnect(el) {
        for (let name of this.#eventNames) {
            el.removeEventListener(name, dispatchHxAction);
        }
    }
}
function getEventAttr(eventType) {
    return `_${eventType}_`;
}
function getHxActionEvent(e, type, el) {
    let action = el.getAttribute(type);
    if (action)
        return new HxActionEvent(e, action);
}
function dispatchHxAction(e) {
    let kind = getEventAttr(e.type);
    for (let node of e.composedPath()) {
        if (node instanceof Element) {
            let event = getHxActionEvent(e, kind, node);
            if (event)
                node.dispatchEvent(event);
            if (node.hasAttribute(`${kind}prevent-default_`))
                e.preventDefault();
            if (node.hasAttribute(`${kind}stop-propagation_`))
                return;
        }
    }
}
