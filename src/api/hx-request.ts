import {
	dispatchHxRequestFromAnchor,
	dispatchHxRequestOnSubmit,
} from "../hx-request/mod.js";

class HxRequest {
	#el: Document | ShadowRoot;

	constructor(el: Document | ShadowRoot) {
		this.#el = el;
	}

	connect() {
		// interactions
		this.#el.addEventListener("click", dispatchHxRequestFromAnchor);
		// form submissions
		this.#el.addEventListener("submit", dispatchHxRequestOnSubmit);
	}

	disconnect() {
		this.#el.removeEventListener("click", dispatchHxRequestFromAnchor);
		this.#el.removeEventListener("submit", dispatchHxRequestOnSubmit);
	}
}

export { HxRequest };
