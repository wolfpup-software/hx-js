import { dispatchHxEvent, dispatchHxFromForm } from "../hx-action/mod.js";
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
function isFormEvent(name) {
    return "submit" === name || "reset" === name;
}
class Hx {
    #eventNames;
    constructor(eventNames = fallbackEventNames) {
        this.#eventNames = eventNames;
    }
    connect(el) {
        // interactions
        for (let name of this.#eventNames) {
            let dispatch = isFormEvent(name) ? dispatchHxFromForm : dispatchHxEvent;
            el.addEventListener(name, dispatch);
        }
    }
    disconnect(el) {
        for (let name of this.#eventNames) {
            let dispatch = isFormEvent(name) ? dispatchHxFromForm : dispatchHxEvent;
            el.removeEventListener(name, dispatch);
        }
    }
}
export { Hx };
