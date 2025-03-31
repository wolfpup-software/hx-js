import { dispatchHxEvent, dispatchHxOnSubmit } from "../hx-event/mod.js";

const eventNames = [
	"pointerup",
	"pointerover",
	"keydown",
	"click",
	"change",
];

class Hx {
	connect(el: EventTarget) {
		// interactions
		for (let name of eventNames) {
			el.addEventListener(name, dispatchHxEvent);
		}

		// form submission
		el.addEventListener("submit", dispatchHxOnSubmit);
	}

	disconnect(el: EventTarget) {
		for (let name of eventNames) {
			el.removeEventListener(name, dispatchHxEvent);
		}
		el.removeEventListener("submit", dispatchHxOnSubmit);
	}
}

function connect(el: EventTarget) {
	// interactions
	for (let name of eventNames) {
		el.addEventListener(name, dispatchHxEvent);
	}

	// form submission
	el.addEventListener("submit", dispatchHxOnSubmit);
}

function disconnect(el: EventTarget) {
	for (let name of eventNames) {
		el.removeEventListener(name, dispatchHxEvent);
	}
	el.removeEventListener("submit", dispatchHxOnSubmit);
}

export { Hx }
