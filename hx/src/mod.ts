import { HxActions } from "../../actions/dist/mod.js";
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

let hx = new HxActions(fallbackEventNames);
let hxRequest = new HxRequest(document);

hx.connect(document);
hxRequest.connect();
