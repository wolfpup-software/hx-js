interface HxFormEventImpl extends Event {
    submitter: HTMLElement | null
}

class HxAnchorEvent extends Event {
    constructor() {
        super("hx-anchor", { composed: true, bubbles: true });
    }
}

class HxFormEvent extends Event implements HxFormEventImpl {
    submitter;
    constructor(submitter: HTMLElement | null) {
        super("hx-form", { composed: true, bubbles: true });
        this.submitter = submitter;
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
    node.dispatchEvent(new HxAnchorEvent());
}

function onSubmit(e: Event) {
    if (!(e instanceof SubmitEvent && e.target instanceof HTMLFormElement)) return;

    const hx = e.target.getAttribute("hx-placement");
    if (!hx || hx !== "") return;

    e.preventDefault();
    e.target.dispatchEvent(new HxFormEvent(e.submitter));
}

export type { HxFormEventImpl };
export { onAnchor, onSubmit, HxAnchorEvent, HxFormEvent }
