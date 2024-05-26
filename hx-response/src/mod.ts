import { TaskQueue } from "./task_queue";
import { composeResponse } from "./compose_response";

interface HxResponseImpl<T> {
    onHxRequest(e: Event): void;
}

class HxResponse<T> implements HxResponseImpl<T> {
    #tasks = new TaskQueue();

    constructor() {
        this.onHxRequest = this.onHxRequest.bind(this);
    }

    onHxRequest(e: Event): void {
        let task = composeResponse(e);
        if (task) this.#tasks.enqueue(task);
    }
}

export { HxResponse }