// All request properties
// All selector properties
// All placement properties
//
// should be included as an attribute
// on the element making the hypermedia request.

interface ElementWithEvents {
    addEventListener: HTMLElement["addEventListener"];
    removeEventListener: HTMLElement["removeEventListener"];
}

interface Callbacks {
    requestHypermedia(root: HTMLElement, el: HTMLElement);
}

class HxCore {
    #callbacks: Callbacks;

    constructor(callbacks: Callbacks) {
        this.#callbacks = callbacks;
        this.onAnchor = this.onAnchor.bind(this)
        this.onSubmit = this.onSubmit.bind(this);
    }

    connect(root: ElementWithEvents) {
        root.addEventListener("pointerup", this.onAnchor);
        root.addEventListener("keydown", this.onAnchor);
        root.addEventListener("submit", this.onSubmit);
    }

    disconnect(root: ElementWithEvents) {
        root.removeEventListener("pointerup", this.onAnchor);
        root.removeEventListener("keydown", this.onAnchor);
        root.removeEventListener("submit", this.onSubmit);
    }

    onAnchor(e: Event) {
        if (!(e.currentTarget instanceof HTMLElement)) return;
        if (!(e.target instanceof HTMLElement)) return;

        let node: HTMLElement | null = e.target;
        while (node && node !== e.currentTarget) {
            if (node instanceof HTMLAnchorElement) break;
            node = node.parentElement;
        }

        if (!(node instanceof HTMLAnchorElement)) return;

        const hx = node.getAttribute("hx");
        if (!hx || hx !== "") return

        e.preventDefault();
        this.#callbacks.requestHypermedia(e.currentTarget, e.target);
    }

    onSubmit(e: Event) {
        if (!(e instanceof SubmitEvent)) return;
        if (!(e.currentTarget instanceof HTMLElement)) return;
        if (!(e.target instanceof HTMLFormElement)) return;

        const hx = e.target.getAttribute("hx");
        if (!hx || hx !== "") return;

        e.preventDefault();
        this.#callbacks.requestHypermedia(e.currentTarget, e.target);
    }
}

export type { Callbacks, ElementWithEvents }

export { HxCore }