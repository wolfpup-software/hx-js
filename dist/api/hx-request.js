import { dispatchHxRequestFromAnchor, dispatchHxRequestOnSubmit, } from "../hx-request/mod.js";
import { HxResponse } from "../hx-response/mod.js";
import { dispatchHxProjection } from "../hx-projection/mod.js";
const fallbackEventNames = [
    "change",
    "click",
    "dblclick",
    "focusin",
    "focusout",
    "input",
    "pointerenter",
    "pointerleave",
    "submit",
];
class HxRequest {
    #el;
    #response;
    constructor(el) {
        this.#el = el;
        this.#response = new HxResponse();
    }
    connect() {
        // interactions
        this.#el.addEventListener("click", dispatchHxRequestFromAnchor);
        // form submissions
        this.#el.addEventListener("submit", dispatchHxRequestOnSubmit);
        this.#el.addEventListener("#request", this.#response.onHxRequest);
        this.#el.addEventListener("#response", dispatchHxProjection);
    }
    disconnect() {
        this.#el.removeEventListener("click", dispatchHxRequestFromAnchor);
        this.#el.removeEventListener("submit", dispatchHxRequestOnSubmit);
        this.#el.removeEventListener("#request", this.#response.onHxRequest);
        this.#el.removeEventListener("#response", dispatchHxProjection);
    }
}
export { HxRequest };
