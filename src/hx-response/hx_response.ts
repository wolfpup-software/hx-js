// import { TaskQueue } from "./task_queue.js";
import { composeResponse } from "./compose_response.js";
import { Throttler } from "./throttler.js";

class HxResponse {
	constructor() {
		this.onHxRequest = this.onHxRequest.bind(this);
	}

	onHxRequest(e: Event): void {
		// pass event to function

		// create abort controller
		// create request
		// set e.target => abort controller

		// on subsequet requersts targeting the same node
		// abort the signal


		// let abortSignal = this.#throttler.set(e.target);
		// if (!abortSignal) return;

		// this.#tasks.enqueue(composeResponse(e, abortSignal));
	}
}

export { HxResponse };
