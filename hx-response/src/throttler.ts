class HxAbortSignal {
    #abortController;
    #signals;
    createdAt;
    timeout;

    constructor(timeout: number) {
        this.createdAt(performance.now());
        this.timeout = timeout;
        this.#abortController = new AbortController();
        
        // abort signal is newly adoped, no DOM definition
        // @ts-expect-error
        this.#signals = AbortSignal.any([
            this.#abortController.signal,
            AbortSignal.timeout(timeout),
        ]);
    }

    abort() {
        this.#abortController.abort();
    }

    getSignals() {
        return this.#signals;
    }
}

class Throttler {
    #req = new WeakMap<Element, HxAbortSignal>();

    set(node: unknown) {
        if (!(node instanceof Element)) return;
        
        let hxAbortSignal = this.#req.get(node);
        if (hxAbortSignal) {
            const now =  performance.now();
            let delta = now - hxAbortSignal.createdAt
            if (delta < hxAbortSignal.timeout) return;   
            hxAbortSignal.abort(); 
        }

        let timeoutStr = node.getAttribute("hx-timeout");
        let timeout = parseFloat(timeoutStr);
        if (Number.isNaN(timeout)) timeout = 5000;

        hxAbortSignal = new HxAbortSignal(timeout)
        this.#req.set(node, hxAbortSignal);
        
        return hxAbortSignal;
    }
}

export { HxAbortSignal, Throttler }
