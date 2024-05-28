import { TaskQueue } from "../../hx-response/dist/task_queue.js";
import { projectHxResponse } from "./project_response.js"

class HxProject {
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

export type { HxProjectEventImpl } from "./project_response.js";
export { HxProjectEvent } from "./project_response.js"
export { HxProject }
