import { dispastchHxRequestFromAnchor, dispatchHxRequestOnSubmit, } from "../hx-request/mod.js";

const eventNames = [
	"pointerup",
	"keydown",
	"click"
];

const formEvents = ["submit"];

class HxRequest {
	#el: Document | ShadowRoot;

	constructor(el: Document | ShadowRoot) {
		this.#el = el;
	}

	connect() {
		// interactions
		for (let name of eventNames) {
			this.#el.addEventListener(name, dispastchHxRequestFromAnchor);
		}

		// form submissions
		this.#el.addEventListener("submit", dispatchHxRequestOnSubmit);
	}

	disconnect() {
		for (let name of eventNames) {
			this.#el.removeEventListener(name, dispastchHxRequestFromAnchor);
		}

		this.#el.removeEventListener("submit", dispatchHxRequestOnSubmit);
	}
}

export { HxRequest }