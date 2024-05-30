class HxAbortSignal {
	#abortController: AbortController;
	#timeoutSignal: AbortSignal;
	#throttle: number;
	#createdAt: number;

	constructor(throttleMS: number, timeoutMS: number) {
		this.#throttle = throttleMS;
		this.#createdAt = performance.now();
		this.#abortController = new AbortController();
		this.#timeoutSignal = AbortSignal.timeout(timeoutMS);
	}

	get aborted(): boolean {
		return this.#abortController.signal.aborted || this.#timeoutSignal.aborted;
	}

	throttle(): void {
		let now = performance.now();
		let delta = now - this.#createdAt;

		if (delta > this.#throttle) this.abort();
	}

	abort(): void {
		this.#abortController.abort();
	}

	getSignals(): AbortSignal {
		// AbortSignal.any is newly adoped, no DOM definition
		// @ts-expect-error
		return AbortSignal.any([this.#abortController.signal, this.#timeoutSignal]);
	}
}

class Throttler {
	#req = new WeakMap<Element, HxAbortSignal>();

	set(node: unknown) {
		if (!(node instanceof Element)) return;

		let hxAbortSignal = this.#req.get(node);
		if (hxAbortSignal) {
			hxAbortSignal.throttle();
			if (!hxAbortSignal.aborted) return;
		}

		let throttle = parseFloat(node.getAttribute("hx-throttle"));
		if (Number.isNaN(throttle)) throttle = 0;

		let timeout = parseFloat(node.getAttribute("hx-timeout"));
		if (Number.isNaN(timeout)) timeout = 5000;

		hxAbortSignal = new HxAbortSignal(throttle, timeout);
		this.#req.set(node, hxAbortSignal);

		return hxAbortSignal;
	}
}

export { HxAbortSignal, Throttler };
