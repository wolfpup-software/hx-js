import { composeResponse } from "./compose_response.js";
import { Throttler } from "./throttler.js";

class HxResponse {
	constructor() {
		this.onHxRequest = this.onHxRequest.bind(this);
	}

	onHxRequest(e: Event): void {
		// get req params
		// projection target, throttle target
		// if :throttle "target | currentTarget | projectionTarget | document | none"
		// do throttle logic
		// create response
		// if throttle add to throttle
	}
}

export { HxResponse };
