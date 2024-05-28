class HxRequestEvent extends Event {
    sourceEvent;
    constructor(e) {
        super("hx-request", { bubbles: true });
        this.sourceEvent = e;
    }
}
function getHxElement(e) {
    if (!(e.target instanceof Element))
        return;
    if (e.target.getAttribute("hx-placement") === null)
        return;
    if (e.target instanceof HTMLFormElement)
        return e.target;
    let node = e.target;
    while (node && node !== e.currentTarget) {
        if (node instanceof HTMLAnchorElement)
            return node;
        node = node.parentElement;
    }
}
function onHx(e) {
    let el = getHxElement(e);
    if (el) {
        e.preventDefault();
        el.dispatchEvent(new HxRequestEvent(e));
    }
}

class TaskQueue {
    #enq = [];
    #deq = [];
    #task;
    enqueue(e) {
        if (!(e instanceof Object))
            return;
        this.#enq.push(e);
        if (this.#task)
            return;
        this.#processNextTask();
    }
    async #processNextTask() {
        if (!this.#deq.length) {
            let r;
            while (r = this.#enq.pop()) {
                this.#deq.push(r);
            }
        }
        // base case, there are no more tasks
        this.#task = this.#deq.pop();
        if (this.#task === undefined)
            return;
        // could be errors
        await this.#task;
        this.#processNextTask();
    }
}

class HxResponseEvent extends Event {
    sourceEvent;
    response;
    error;
    constructor(sourceEvent) {
        super("hx-response", { bubbles: true });
        this.sourceEvent = sourceEvent;
    }
}
async function composeResponse(e, abortSignal) {
    if (!(e.target instanceof Element))
        return;
    const placement = e.target.getAttribute("hx-placement");
    if (placement === null)
        return;
    let request = buildHxRequest(e);
    if (!request)
        return;
    let hxResponse = new HxResponseEvent(e);
    try {
        hxResponse.response = await fetch(request, {
            signal: abortSignal.getSignals()
        });
    }
    catch (error) {
        hxResponse.error = error;
    }
    e.target.dispatchEvent(hxResponse);
}
function buildHxRequest(e) {
    if (!(e instanceof HxRequestEvent))
        return;
    if (e.target instanceof HTMLAnchorElement) {
        return new Request(e.target.href);
    }
    if (e.target instanceof HTMLFormElement) {
        let submitter = (e.sourceEvent instanceof SubmitEvent)
            ? e.sourceEvent.submitter
            : undefined;
        return new Request(e.target.action, {
            method: e.target.getAttribute("method") || "get",
            body: new FormData(e.target, submitter)
        });
    }
}

// assume aborts only happen once
class HxAbortSignal {
    #abortController;
    #signals;
    createdAt;
    timeout;
    aborted;
    constructor(timeout) {
        this.createdAt(performance.now());
        this.timeout = timeout;
        this.#abortController = new AbortController();
        // abort signal is newly adoped, no DOM definition
        // @ts-expect-error
        this.#signals = AbortSignal.any([
            this.#abortController.signal,
            AbortSignal.timeout(timeout),
        ]);
    }
    abort() {
        this.#abortController.abort();
        this.aborted = true;
    }
    getSignals() {
        return this.#signals;
    }
}
class Throttler {
    #req = new WeakMap();
    set(node) {
        if (!(node instanceof Element))
            return;
        let hxAbortSignal = this.#req.get(node);
        if (hxAbortSignal && !hxAbortSignal.aborted) {
            let delta = performance.now() - hxAbortSignal.createdAt;
            if (delta < hxAbortSignal.timeout)
                return;
            hxAbortSignal.abort();
        }
        let timeoutStr = node.getAttribute("hx-timeout");
        let timeout = parseFloat(timeoutStr);
        if (Number.isNaN(timeout))
            timeout = 5000;
        hxAbortSignal = new HxAbortSignal(timeout);
        this.#req.set(node, hxAbortSignal);
        return hxAbortSignal;
    }
}

class HxResponse {
    #tasks = new TaskQueue();
    #throttler = new Throttler();
    constructor() {
        this.onHxRequest = this.onHxRequest.bind(this);
    }
    onHxRequest(e) {
        let abortSignal = this.#throttler.set(e.target);
        if (!abortSignal)
            return;
        this.#tasks.enqueue(composeResponse(e, abortSignal));
    }
}

const placements = new Set(["none"]);
class HxProjectEvent extends Event {
    sourceEvent;
    node;
    fragment;
    error;
    constructor(sourceEvent) {
        super("hx-project", { bubbles: true });
        this.sourceEvent = sourceEvent;
    }
}
async function projectHxResponse(e) {
    if (!(e instanceof HxResponseEvent))
        return;
    if (!(e.target instanceof HTMLElement))
        return;
    // TODO: handle errors
    if (!e.response)
        return;
    const text = await e.response.text();
    queueMicrotask(function () {
        if (!(e.target instanceof HTMLElement && e.currentTarget instanceof HTMLElement))
            return;
        const placement = e.target.getAttribute("hx-placement");
        if (placements.has(placement))
            return;
        const selector = e.target.getAttribute("target") || "_currentTarget";
        let targetNode;
        if (selector === "_target")
            targetNode = e.target;
        if (selector === "_currentTarget")
            targetNode = e.currentTarget;
        if (selector === "_document")
            targetNode = document;
        const event = new HxProjectEvent(e);
        try {
            if (!targetNode)
                targetNode = e.currentTarget.querySelector(selector);
            if (targetNode instanceof Node) {
                event.fragment = dangerouslyBuildTemplate(e.response, text);
            }
            if (event.fragment) {
                if (placement === "none")
                    targetNode;
                if (placement === "start")
                    event.fragment.insertBefore(targetNode, targetNode.firstChild);
                if (placement === "end")
                    targetNode.appendChild(event.fragment);
                const parent = targetNode.parentElement;
                if (parent) {
                    if (placement === "replace")
                        parent.replaceChild(event.fragment, targetNode);
                    if (placement === "remove")
                        parent.removeChild(targetNode);
                    if (placement === "before")
                        event.fragment.insertBefore(parent, targetNode);
                    if (placement === "after")
                        event.fragment.insertBefore(parent, targetNode.nextSibling);
                }
                ;
            }
            ;
        }
        catch (err) {
            event.error = err;
        }
        e.target.dispatchEvent(event);
    });
}
function dangerouslyBuildTemplate(response, text) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl.content.cloneNode(true);
}

class HxProject {
    #tasks = new TaskQueue();
    constructor() {
        this.onHxResponse = this.onHxResponse.bind(this);
    }
    onHxResponse(e) {
        let task = projectHxResponse(e);
        if (!task)
            return;
        this.#tasks.enqueue(task);
    }
}

// this is the opinionated setup
// respond to pointer up, keyboard down, and submit events
function connect(el, onRequest, onResponse) {
    el.addEventListener("pointerup", onHx);
    el.addEventListener("keydown", onHx);
    el.addEventListener("submit", onHx);
    el.addEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
}
function disconnect(el, onRequest, onResponse) {
    el.removeEventListener("pointerup", onHx);
    el.removeEventListener("keydown", onHx);
    el.removeEventListener("submit", onHx);
    el.removeEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
}
// use module for initial setup
const hxResponse = new HxResponse();
const hxProject = new HxProject();
connect(document, hxResponse.onHxRequest, hxProject.onHxResponse);

export { connect, disconnect, hxResponse as hx };
