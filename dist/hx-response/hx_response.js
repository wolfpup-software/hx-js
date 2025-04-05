import { composeResponse } from "./compose_response.js";
class HxResponse {
    #throttler = new WeakMap();
    constructor() {
        this.onHxRequest = this.onHxRequest.bind(this);
    }
    onHxRequest(e) {
        composeResponse(this.#throttler, e);
    }
}
export { HxResponse };
