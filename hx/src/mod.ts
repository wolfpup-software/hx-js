import { dispatchHxAction } from "../../actions/dist/mod.js";
import { HxRequest } from "./hx-request.js";

const fallbackEventNames = [
	"animationcancel",
	"animationend",
	"animationstart",
	"blur",
	"change",
	"click",
	"copy",
	"cut",
	"dblclick",
	"focusin",
	"focusout",
	"fullscreenchange",
	"fullscreenerror",
	"gotpointercapture",
	"input",
	"keydown",
	"keyup",
	"lostpointercapture",
	"paste",
	"pointerdown",
	"pointerover",
	"pointerup",
	"pointerenter",
	"pointerleave",
	"reset",
	"scroll",
	"scrollend",
	"submit",
	"transitionend",
	"transitionrun",
	"transitionstart",
	"wheel",
];


class HxActions {
	#eventNames: string[];

	constructor(eventNames: string[]) {
		this.#eventNames = eventNames;
	}

	connect(el: EventTarget) {
		for (let name of this.#eventNames) {
			el.addEventListener(name, dispatchHxAction);
		}
	}

	disconnect(el: EventTarget) {
		for (let name of this.#eventNames) {
			el.removeEventListener(name, dispatchHxAction);
		}
	}
}

let hx = new HxActions(fallbackEventNames);
let hxRequest = new HxRequest(document);

hx.connect(document);
hxRequest.connect();
