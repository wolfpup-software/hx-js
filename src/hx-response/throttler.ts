/* 

WeakMap
	el => abortController,

No matter what hit the abort controller?s

*/

class Throttler {
	#req = new WeakMap<Element, AbortController>();

	set(node: unknown) {
		if (!(node instanceof Element)) return;

		let abortSignal = this.#req.get(node);
		if (abortSignal) {
			abortSignal.abort();
		}

		let timeout = parseFloat(node.getAttribute(":timeout"));
		if (Number.isNaN(timeout)) timeout = 5000;

		// abortSignal = AbortSignal.timeout(timeout);

		// fetch / compose request
		// this.#req.set(node, abortSignal);

		return abortSignal;
	}
}

export { Throttler };
