import { composeResponse } from "./compose_response.js";

class HxResponse {
	constructor() {
		this.onHxRequest = this.onHxRequest.bind(this);
	}

	onHxRequest(e: Event): void {}
}

export { HxResponse };
