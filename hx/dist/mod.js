import { onHx } from "../../hx-request/dist/mod.js";
import { HxResponse } from "../../hx-response/dist/mod.js";
import { HxProject } from "../../hx-project/dist/mod.js";
// this is the opinionated setup
// respond to pointer up, keyboard down, and submit events
function connect(el, onRequest, onResponse) {
    el.addEventListener("pointerup", onHx);
    el.addEventListener("keydown", onHx);
    el.addEventListener("submit", onHx);
    el.addEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
}
;
function disconnect(el, onRequest, onResponse) {
    el.removeEventListener("pointerup", onHx);
    el.removeEventListener("keydown", onHx);
    el.removeEventListener("submit", onHx);
    el.removeEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
};

// use module for initial setup
const hxResponse = new HxResponse();
const hxProject = new HxProject();
connect(document, hxResponse.onHxRequest, hxProject.onHxResponse);
// provide an opportunity to connnect other nodes
export { connect, disconnect, hxResponse as hx };
