interface HxEventImpl extends Event {
    sourceEvent: Event
}

class HxEvent extends Event implements HxEventImpl {
    sourceEvent: Event;
    constructor(e: Event) {
        super("hx-request", { bubbles: true });
        this.sourceEvent = e;
    }
}

function onHx(e: Event) {
    if (!(e.target instanceof HTMLElement)) return;

    const hx = e.target.getAttribute("hx-placement");
    if (!hx || hx !== "") return;

    e.preventDefault();
    e.target.dispatchEvent(new HxEvent(e));
}

export type { HxEventImpl };
export { onHx, HxEvent }
