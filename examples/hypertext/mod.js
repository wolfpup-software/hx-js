document.addEventListener(":request", function (e) {
	console.log(e);
});

document.addEventListener(":response", function (e) {
	console.log(e);
	// console.log(e.projectionTarget);
	// console.log(e.projectionStyle);
	// console.log(e.response);
	// console.log(e.template.content);
});

document.addEventListener(":response-error", function (e) {
	console.log(e);
	console.log(e.error);
});
