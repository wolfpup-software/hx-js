import { onHx } from "../../hx-core/dist/mod.js";
import { HxResponse } from "../../hx-response/dist/mod.js";
import { composeResponse } from "../../hx-response/dist/compose_response.js";

// this is the opinionated setup
// respond to pointer up, keyboard down, and submit events

function connect(el: Node, eventlistener: EventListenerOrEventListenerObject) {
    el.addEventListener("pointerup", onHx);
    el.addEventListener("keydown", onHx);
    el.addEventListener("submit", onHx);
    el.addEventListener("hx-request", eventlistener)
};

function disconnect(el: Node, eventlistener: EventListenerOrEventListenerObject) {
    el.removeEventListener("pointerup", onHx);
    el.removeEventListener("keydown", onHx);
    el.removeEventListener("submit", onHx);
    el.removeEventListener("hx-request", eventlistener)
};

// use module for initial setup
const hxResponse = new HxResponse();
connect(document, hxResponse.onHxRequest)

// provide an opportunity to connnect other nodes
export { connect, disconnect, hxResponse as hx };
