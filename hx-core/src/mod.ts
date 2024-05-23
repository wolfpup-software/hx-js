function connect(root: Node, callback: EventListenerOrEventListenerObject) {
    root.addEventListener("pointerup", onAnchor);
    root.addEventListener("keydown", onAnchor);
    root.addEventListener("submit", onSubmit);
}

function disconnect(root: Node, callback: EventListenerOrEventListenerObject) {
    root.removeEventListener("pointerup", onAnchor);
    root.removeEventListener("keydown", onAnchor);
    root.removeEventListener("submit", onSubmit);
}

function onSubmit(e: Event) {
    if (!(e instanceof SubmitEvent && e.currentTarget instanceof Node && e.target instanceof HTMLFormElement)) return;

    const hx = e.target.getAttribute("hx-placement");
    if (!hx || hx !== "") return;

    e.preventDefault();
    e.currentTarget.dispatchEvent(new Event("hypermedia-request"));
}

function onAnchor(e: Event) {
    if (!(e.currentTarget instanceof Node && e.target instanceof HTMLElement)) return;

    let node: HTMLElement | null = e.target;
    while (node && node !== e.currentTarget) {
        if (node instanceof HTMLAnchorElement) break;
        node = node.parentElement;
    }

    if (!(node instanceof HTMLAnchorElement)) return;

    const hx = node.getAttribute("hx-placement");
    if (!hx || hx !== "") return;

    e.preventDefault();
    e.currentTarget.dispatchEvent(new Event("hypermedia-request"));
}

export { connect, disconnect }
