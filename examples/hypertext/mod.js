function logEvent(e) {
	console.log(e);
}

document.addEventListener(":request", logEvent);
document.addEventListener(":response", logEvent);
document.addEventListener(":response-error", logEvent);
document.addEventListener(":projection", logEvent);
