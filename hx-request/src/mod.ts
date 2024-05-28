interface HxRequestEventImpl extends Event {
    sourceEvent: Event;
}

class HxRequestEvent extends Event implements HxRequestEventImpl {
    sourceEvent: Event;
    constructor(e: Event, composed: boolean) {
        super("hx-request", { bubbles: true, composed });
        this.sourceEvent = e;
    }
}

function getHxElement(e: Event): Element | undefined {
    if (!(e.target instanceof Element)) return;
    if (!e.target.getAttribute("hx-placement")) return;

    if (e.target instanceof HTMLFormElement) return e.target;

    let node: Element | null = e.target;
    while (node && node !== e.currentTarget) {
        if (node instanceof HTMLAnchorElement) return node;
        node = node.parentElement;
    }
}

function onHx(e: Event): void {
    let el = getHxElement(e);
    if (el) {
        e.preventDefault();
        let composed = el.getAttribute("composed") !== null;
        el.dispatchEvent(new HxRequestEvent(e, composed));
    }
}

export type { HxRequestEventImpl };
export { onHx, HxRequestEvent }
