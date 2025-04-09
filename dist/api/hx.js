import { dispatchHxEvent, dispatchHxFromForm } from "../hx-event/mod.js";
const eventNames = [
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
