import { HxAnchorEvent, HxFormEvent } from "../../hx-core/dist/mod";

interface HxAdapterImpl {
    onHxRequest(e: Event);
}

// two stack task queue
class TaskQueue<T = Promise<void>> {
    #enq: T[] = [];
    #deq: T[] = [];
    #task: T | undefined;

    constructor() { }

    enqueue(e: T) {
        this.#enq.push(e);
        if (this.#task) return;
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
        if (!this.#task) return;

        // could be errors
        await this.#task;
        this.#processNextTask();
    }
}

class HxAdapter implements HxAdapterImpl {
    #tasks = new TaskQueue();

    constructor() {
        this.onHxRequest = this.onHxRequest.bind(this);
    }

    onHxRequest(e: Event) {
        // create a "kind"
        this.#tasks.enqueue(composeResponse(e));
    }
}

async function composeResponse(e: Event) {
    // bail if required properties are not met
    if (!(e.target instanceof HTMLElement)) return;
    const target = e.target.getAttribute("target");
    const placement = e.target.getAttribute("hx-placement");
    if (!target || target !== "" || !placement || placement !== "") return;

    let request;
    if (e instanceof HxAnchorEvent) {
        request = buildHxAnchorRequest(e);
    }
    if (e instanceof HxFormEvent) {
        request = buildHxFormRequest(e);
    }
    if (!request) return;

    let response = await fetch(request);
    let text = await response.text();

    placeHxResponse(e, text, target, placement);
}

function buildHxAnchorRequest(e: Event): Request | undefined {
    if (!(e instanceof HxAnchorEvent && e.target instanceof HTMLAnchorElement)) return;

    // maybe no defaults?
    const url = e.target.getAttribute("href") ?? "";

    return new Request(url);
}

function buildHxFormRequest(e: Event): Request | undefined {
    if (!(e instanceof HxFormEvent && e.target instanceof HTMLFormElement)) return;

    // maybe no defaults?
    const action = e.target.getAttribute("action") ?? "";
    const method = e.target.getAttribute("method") ?? "get";
    const body = new FormData(e.target, e.submitter);

    return new Request(action, { method, body });
}

function buildTemplate(text: string): HTMLTemplateElement {
    const template = document.createElement("template");
    template.innerHTML = text;

    return template;
}

function placeHxResponse(
    e: Event,
    text: string,
    selector: string,
    placement: string,
) {
    // actual creation and insertion should be left to the microtaskqueue
    queueMicrotask(function () {
        if (!(e instanceof HxFormEvent && e.target instanceof HTMLElement && e.currentTarget instanceof HTMLElement)) return;

        // get target node
        let target: Element | null | undefined;
        if (selector === "_self") {
            target = e.target
        }
        if (!target) {
            target = e.currentTarget.querySelector(selector);
        }
        if (!(target instanceof HTMLElement)) return;
    
        // get parent node for placement
        const parent = target.parentElement;
        if (parent === null) return;
        let template = buildTemplate(text);
        const cloned = template.content.cloneNode(true);

        // placement strategy
        switch (placement) {
            case "before":
                cloned.insertBefore(parent, target);
                break;
            case "after":
                cloned.insertBefore(parent, target.nextSibling)
                break;
            case "start":
                cloned.insertBefore(target, target.firstChild)
                break;
            case "end":
                target.appendChild(cloned);
                break;
            case "remove":
                parent.removeChild(target);
                break;
            case "replace":
                parent.replaceChild(cloned, target);
                break;
            default:
                break;
        }
    });
}

export { HxAdapter }