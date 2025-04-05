import { dispatchHxEvent, dispatchHxFromForm } from "../hx-event/mod.js";
const eventNames = [
    "animationstart",
    "animationend",
    "animationcancel",
    "copy",
    "paste",
    "cut",
    "fullscreenchange",
    "fullscreenerror",
    "gotpointercapture",
    "lostpointercapture",
    "transitionstart",
    "transitionrun",
    "transitionend",
    "change",
    "click",
    "dblclick",
    "input",
    "keydown",
    "keyup",
    "focusin",
    "focusout",
    "blur",
    "scroll",
    "scrollend",
    "pointerover",
    "pointerdown",
    "pointerup",
    "submit",
    "reset",
    "wheel",
];
function isFormEvent(name) {
    return "submit" === name || "reset" === name;
}
class Hx {
    connect(el) {
        // interactions
        for (let name of eventNames) {
            let dispatch = isFormEvent(name) ? dispatchHxFromForm : dispatchHxEvent;
            el.addEventListener(name, dispatch);
        }
    }
    disconnect(el) {
        for (let name of eventNames) {
            let dispatch = isFormEvent(name) ? dispatchHxFromForm : dispatchHxEvent;
            el.removeEventListener(name, dispatch);
        }
    }
}
export { Hx };
