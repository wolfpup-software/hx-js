import {
	dispatchHxAction,
	dispatchHxActionFromForm,
} from "../hx-action/mod.js";

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

function isFormEvent(name: string) {
	return "submit" === name || "reset" === name;
}

class Hx {
	#eventNames: string[];

	constructor(eventNames: string[] = fallbackEventNames) {
		this.#eventNames = eventNames;
	}

	connect(el: EventTarget) {
		// interactions
		for (let name of this.#eventNames) {
			let dispatch = isFormEvent(name)
				? dispatchHxActionFromForm
				: dispatchHxAction;
			el.addEventListener(name, dispatch);
		}
	}

	disconnect(el: EventTarget) {
		for (let name of this.#eventNames) {
			let dispatch = isFormEvent(name)
				? dispatchHxActionFromForm
				: dispatchHxAction;
			el.removeEventListener(name, dispatch);
		}
	}
}

export { Hx };
