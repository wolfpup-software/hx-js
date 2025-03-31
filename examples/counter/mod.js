const countEl = document.querySelector("[count]");
let count = parseFloat(countEl.textContent);

addEventListener(":click", function (e) {
	let { action } = e;

	if ("increment" === action) {
		count += 1;
	}

	if ("decrement" === action) {
		count -= 1;
	}

	countEl.textContent = count;
});
