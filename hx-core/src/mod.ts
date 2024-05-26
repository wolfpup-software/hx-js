interface HxEventImpl extends Event {
    sourceEvent: Event
}

class HxEvent extends Event implements HxEventImpl {
    sourceEvent: Event;
    constructor(kind: string, e: Event) {
        super(kind, { bubbles: true });
        this.sourceEvent = e;
    }
}

function onAnchor(e: Event) {
    if (!(e.target instanceof HTMLElement)) return;

    let node: HTMLElement | null = e.target;
    while (node && node !== e.currentTarget) {
        if (node instanceof HTMLAnchorElement) break;
        node = node.parentElement;
    }

    if (!(node instanceof HTMLAnchorElement)) return;

    const hx = node.getAttribute("hx-placement");
    if (!hx || hx !== "") return;

    e.preventDefault();
    node.dispatchEvent(new HxEvent("hx-anchor", e));
}

function onSubmit(e: Event) {
    if (!(e instanceof SubmitEvent && e.target instanceof HTMLFormElement)) return;

    const hx = e.target.getAttribute("hx-placement");
    if (!hx || hx !== "") return;

    e.preventDefault();
    e.target.dispatchEvent(new HxEvent("hx-form", e));
}

export type { HxEventImpl };
export { onAnchor, onSubmit, HxEvent }
