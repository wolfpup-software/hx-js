import { onHx } from "./hx-request/mod.js";
import { HxResponse } from "./hx-response/mod.js";
import { HxProject } from "./hx-projection/mod.js";

function connect(
	el: Node,
	onRequest: EventListenerOrEventListenerObject,
	onResponse: EventListenerOrEventListenerObject,
) {
	el.addEventListener("click", onHx);
	el.addEventListener("submit", onHx);
	el.addEventListener("hx-request", onRequest);
	el.addEventListener("hx-response", onResponse);
}

function disconnect(
	el: Node,
	onRequest: EventListenerOrEventListenerObject,
	onResponse: EventListenerOrEventListenerObject,
) {
	el.removeEventListener("click", onHx);
	el.removeEventListener("submit", onHx);
	el.removeEventListener("hx-request", onRequest);
	el.addEventListener("hx-response", onResponse);
}

const hxResponse = new HxResponse();
const hxProject = new HxProject();

connect(document, hxResponse.onHxRequest, hxProject.onHxResponse);

export { connect, disconnect };
