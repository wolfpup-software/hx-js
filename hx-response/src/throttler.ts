class HxAbortSignal {
    #abortController: AbortController;
    #timeoutSignal: AbortSignal;

    constructor(timeoutMS: number) {
        this.#abortController = new AbortController();
        this.#timeoutSignal = AbortSignal.timeout(timeoutMS);
    }

    abort(): void {
        this.#abortController.abort();
    }

    isAborted(): boolean {
        return this.#abortController.signal.aborted || this.#timeoutSignal.aborted;
    }
    
    getSignals(): AbortSignal {
        // AbortSignal.any is newly adoped, no DOM definition
        // @ts-expect-error
        return AbortSignal.any([
            this.#abortController.signal,
            this.#timeoutSignal,
        ]);
    }
}

class Throttler {
    #req = new WeakMap<Element, HxAbortSignal>();

    set(node: unknown) {
        if (!(node instanceof Element)) return;

        let hxAbortSignal = this.#req.get(node);
        if (hxAbortSignal && !hxAbortSignal.isAborted()) return;

        let timeout = parseFloat(node.getAttribute("hx-timeout"));
        if (Number.isNaN(timeout)) timeout = 5000;

        hxAbortSignal = new HxAbortSignal(timeout);
        this.#req.set(node, hxAbortSignal);
        
        return hxAbortSignal;
    }
}

export { HxAbortSignal, Throttler }
