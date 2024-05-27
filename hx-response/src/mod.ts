import { TaskQueue } from "./task_queue.js";
import { composeResponse } from "./compose_response.js";
import { Throttler } from "./throttler.js";

interface HxResponseImpl<T> {
    onHxRequest(e: Event): void;
}

class HxResponse<T> implements HxResponseImpl<T> {
    #tasks = new TaskQueue();
    #throttler = new Throttler();

    constructor() {
        this.onHxRequest = this.onHxRequest.bind(this);
    }

    onHxRequest(e: Event): void {
        let abortSignal = this.#throttler.set(e.target);
        if (!abortSignal) return;

        this.#tasks.enqueue(composeResponse(e, abortSignal));
    }
}

export { HxResponseEvent } from "./compose_response.js"
export { HxResponse }
