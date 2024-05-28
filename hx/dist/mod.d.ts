import { HxResponse } from "../../hx-response/dist/mod.js";
declare function connect(el: Node, onRequest: EventListenerOrEventListenerObject, onResponse: EventListenerOrEventListenerObject): void;
declare function disconnect(el: Node, onRequest: EventListenerOrEventListenerObject, onResponse: EventListenerOrEventListenerObject): void;
declare const hxResponse: HxResponse<unknown>;
export { connect, disconnect, hxResponse as hx };
