import { dispatchHxEvent, dispatchHxOnSubmit } from "../hx-event/mod.js";

const eventNames = [
	"change",
	"click",
	"dblclick",
	"input",
	"keydown",
	"pointerover",
	"pointerup",
	"submit",
];

class Hx {
	connect(el: EventTarget) {
		// interactions
		for (let name of eventNames) {
			let dispatch = "submit" === name ? dispatchHxOnSubmit : dispatchHxEvent;

			el.addEventListener(name, dispatch);
		}
	}

	disconnect(el: EventTarget) {
		for (let name of eventNames) {
			let dispatch = "submit" === name ? dispatchHxOnSubmit : dispatchHxEvent;

			el.removeEventListener(name, dispatch);
		}
	}
}

export { Hx };
