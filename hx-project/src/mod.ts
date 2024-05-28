import { TaskQueue } from "../../hx-response/dist/task_queue.js";
import { projectHxResponse } from "./render_response.js"

interface HxProjectImpl {
    onHxResponse(e: Event): void;
}

class HxProject implements HxProjectImpl {
    #tasks = new TaskQueue();

    constructor() {
        this.onHxResponse = this.onHxResponse.bind(this);
    }

    onHxResponse(e: Event): void {        
        let task = projectHxResponse(e);
        if (!task) return;

        this.#tasks.enqueue(task);
    }
}

export { HxProject }