import { onHx } from "../../hx-request/dist/mod.js";
import { HxResponse } from "../../hx-response/dist/mod.js";
// this is the opinionated setup
// respond to pointer up, keyboard down, and submit events
function connect(el, eventlistener) {
    el.addEventListener("pointerup", onHx);
    el.addEventListener("keydown", onHx);
    el.addEventListener("submit", onHx);
    el.addEventListener("hx-request", eventlistener);
}
;
function disconnect(el, eventlistener) {
    el.removeEventListener("pointerup", onHx);
    el.removeEventListener("keydown", onHx);
    el.removeEventListener("submit", onHx);
    el.removeEventListener("hx-request", eventlistener);
}
;
// use module for initial setup
const hxResponse = new HxResponse();
connect(document, hxResponse.onHxRequest);
// provide an opportunity to connnect other nodes
export { connect, disconnect, hxResponse as hx };
