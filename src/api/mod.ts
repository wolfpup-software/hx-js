import { Hx } from "./hx.js";
import { HxRequest } from "./hx-request.js";

let hx = new Hx();
let hxRequest = new HxRequest(document);

hx.connect(document);
hxRequest.connect();
