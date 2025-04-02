/* 
WeakMap el => abortController,

No matter what hit the abort controller?s
*/

class Throttler {
	#req = new WeakMap<Element, AbortController>();

	set(node: EventTarget): EventTarget | undefined {
		if (!(node instanceof Element)) return;

		let timeout = parseFloat(node.getAttribute(":timeout"));
		if (Number.isNaN(timeout)) timeout = 5000;

		return;
	}
}

export { Throttler };
