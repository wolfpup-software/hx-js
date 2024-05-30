import { onHx } from "../../hx-request/dist/mod.js";
import { HxResponse } from "../../hx-response/dist/mod.js";
import { HxProject } from "../../hx-project/dist/mod.js";

function connect(
    el: Node,
    onRequest: EventListenerOrEventListenerObject,
    onResponse: EventListenerOrEventListenerObject,
) {
    el.addEventListener("pointerup", onHx);
    el.addEventListener("keydown", onHx);
    el.addEventListener("submit", onHx);
    el.addEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
};

function disconnect(
    el: Node,
    onRequest: EventListenerOrEventListenerObject,
    onResponse: EventListenerOrEventListenerObject,
) {
    el.removeEventListener("pointerup", onHx);
    el.removeEventListener("keydown", onHx);
    el.removeEventListener("submit", onHx);
    el.removeEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
};

const hxResponse = new HxResponse();
const hxProject = new HxProject();
connect(document, hxResponse.onHxRequest, hxProject.onHxResponse);
   
export { connect, disconnect };
