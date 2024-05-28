class HxRequestEvent extends Event {
    sourceEvent;
    constructor(e, composed) {
        super("hx-request", { bubbles: true, composed });
        this.sourceEvent = e;
    }
}
function getHxElement(e) {
    if (!(e.target instanceof Element))
        return;
    if (!e.target.getAttribute("hx-placement"))
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
        let composed = el.getAttribute("hx-composed") !== null;
        el.dispatchEvent(new HxRequestEvent(e, composed));
    }
}

class TaskQueue {
    #enq = [];
    #deq = [];
    #task;
    enqueue(e) {
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
        await this.#task;
        this.#processNextTask();
    }
}

class HxResponseEvent extends Event {
    sourceEvent;
    response;
    error;
    constructor(sourceEvent) {
        super("hx-response", {
            bubbles: true,
            composed: sourceEvent.composed,
        });
        this.sourceEvent = sourceEvent;
    }
}
async function composeResponse(e, abortSignal) {
    if (!(e.target instanceof Element))
        return;
    if (!e.target.getAttribute("hx-placement"))
        return;
    let request = buildHxRequest(e);
    if (!request)
        return;
    let hxResponse = new HxResponseEvent(e);
    try {
        hxResponse.response = await fetch(request, {
            signal: abortSignal.getSignals(),
        });
    }
    catch (error) {
        hxResponse.error = error;
    }
    // abort regardless so throttler can delete
    abortSignal.abort();
    e.target.dispatchEvent(hxResponse);
}
function buildHxRequest(e) {
    if (!(e instanceof HxRequestEvent))
        return;
    if (e.target instanceof HTMLAnchorElement) {
        return new Request(e.target.href);
    }
    if (e.target instanceof HTMLFormElement) {
        let submitter;
        if (e.sourceEvent instanceof SubmitEvent)
            submitter = e.sourceEvent.submitter;
        return new Request(e.target.action, {
            method: e.target.getAttribute("method") || "get",
            body: new FormData(e.target, submitter)
        });
    }
}

class HxAbortSignal {
    #abortController;
    #timeoutSignal;
    #throttle;
    #createdAt;
    constructor(throttleMS, timeoutMS) {
        this.#throttle = throttleMS;
        this.#createdAt = performance.now();
        this.#abortController = new AbortController();
        this.#timeoutSignal = AbortSignal.timeout(timeoutMS);
    }
    get aborted() {
        return this.#abortController.signal.aborted || this.#timeoutSignal.aborted;
    }
    throttle() {
        let now = performance.now();
        let delta = now - this.#createdAt;
        if (delta > this.#throttle)
            this.abort();
    }
    abort() {
        this.#abortController.abort();
    }
    getSignals() {
        // AbortSignal.any is newly adoped, no DOM definition
        // @ts-expect-error
        return AbortSignal.any([
            this.#abortController.signal,
            this.#timeoutSignal,
        ]);
    }
}
class Throttler {
    #req = new WeakMap();
    set(node) {
        if (!(node instanceof Element))
            return;
        let hxAbortSignal = this.#req.get(node);
        if (hxAbortSignal) {
            hxAbortSignal.throttle();
            if (!hxAbortSignal.aborted)
                return;
        }
        let throttle = parseFloat(node.getAttribute("hx-throttle"));
        if (Number.isNaN(throttle))
            throttle = 0;
        let timeout = parseFloat(node.getAttribute("hx-timeout"));
        if (Number.isNaN(timeout))
            timeout = 5000;
        hxAbortSignal = new HxAbortSignal(throttle, timeout);
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

class HxProjectEvent extends Event {
    sourceEvent;
    node;
    fragment;
    error;
    constructor(sourceEvent) {
        super("hx-project", {
            bubbles: true,
            composed: sourceEvent.composed,
        });
        this.sourceEvent = sourceEvent;
    }
}
class HxProjectError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
function projectPlacement(e, targetNode, fragment) {
    if (!(e.target instanceof Element))
        return;
    const placement = e.target.getAttribute("hx-placement");
    switch (placement) {
        case "none": return targetNode;
        case "start": return fragment.insertBefore(targetNode, targetNode.firstChild);
        case "end": return targetNode.appendChild(fragment);
    }
    const parent = targetNode.parentElement;
    if (parent) {
        switch (placement) {
            case "replace": return parent.replaceChild(fragment, targetNode);
            case "remove": return parent.removeChild(targetNode);
            case "before": return fragment.insertBefore(parent, targetNode);
            case "after": return fragment.insertBefore(parent, targetNode.nextSibling);
        }
    }
    throw new HxProjectError("unknown hx-placement attribute");
}
function getTarget(e) {
    if (!(e.target instanceof Element && e.currentTarget instanceof Element))
        return;
    const selector = e.target.getAttribute("target") || "_currentTarget";
    switch (selector) {
        case "_target": return e.target;
        case "_currentTarget": return e.currentTarget;
        case "_document": return document;
    }
    return e.currentTarget.querySelector(selector);
}
function dangerouslyBuildTemplate(response, text) {
    if (response.status !== 200) {
        throw new HxProjectError(`unexpected response status code: ${response.status}`);
    }
    let contentType = response.headers.get("content-type");
    if (contentType !== "text/html; charset=utf-8") {
        throw new HxProjectError(`unexpected content-type: ${contentType}`);
    }
    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl.content.cloneNode(true);
}
async function projectHxResponse(e) {
    if (!(e instanceof HxResponseEvent) || e.error || !e.response)
        return;
    if (!(e.target instanceof HTMLAnchorElement || e.target instanceof HTMLFormElement))
        return;
    const text = await e.response.text();
    queueMicrotask(function () {
        const event = new HxProjectEvent(e);
        try {
            event.node = getTarget(e);
            if (event.node)
                event.fragment = dangerouslyBuildTemplate(e.response, text);
            if (event.fragment)
                projectPlacement(e, event.node, event.fragment);
        }
        catch (err) {
            event.error = err;
        }
        e.target.dispatchEvent(event);
    });
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
const hxResponse = new HxResponse();
const hxProject = new HxProject();
connect(document, hxResponse.onHxRequest, hxProject.onHxResponse);

export { connect, disconnect, hxResponse as hx };
