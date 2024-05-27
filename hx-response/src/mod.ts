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

        let task = composeResponse(e, abortSignal);
        if (task) this.#tasks.enqueue(task);
    }
}

export { HxResponseEvent, ResponseDetails} from "./compose_response.js"
export { HxResponse }