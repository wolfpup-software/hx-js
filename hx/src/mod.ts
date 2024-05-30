import { onHx } from "../../hx-request/dist/mod.js";
import { HxResponse } from "../../hx-response/dist/mod.js";
import { HxProject } from "../../hx-project/dist/mod.js";

function connect(
    el: Node,
    onRequest: EventListenerOrEventListenerObject,
    onResponse: EventListenerOrEventListenerObject,
) {
    el.addEventListener("click", onHx);
    el.addEventListener("submit", onHx);
    el.addEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
};

function disconnect(
    el: Node,
    onRequest: EventListenerOrEventListenerObject,
    onResponse: EventListenerOrEventListenerObject,
) {
    el.removeEventListener("click", onHx);
    el.removeEventListener("submit", onHx);
    el.removeEventListener("hx-request", onRequest);
    el.addEventListener("hx-response", onResponse);
};

const hxResponse = new HxResponse();
const hxProject = new HxProject();

connect(document, hxResponse.onHxRequest, hxProject.onHxResponse);

export type { HxRequestEventImpl } from "../../hx-request/dist/mod.ts";
export type { HxResponseEventImpl } from "../../hx-response/dist/mod.ts";
export type { HxProjectEventImpl } from "../../hx-project/dist/mod.ts";

export { HxRequestEvent } from "../../hx-request/dist/mod.js";
export { HxResponseEvent } from "../../hx-response/dist/mod.js";
export { HxProjectEvent } from "../../hx-project/dist/mod.js";

export {connect, disconnect}