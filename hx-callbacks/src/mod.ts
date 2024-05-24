// two stack task queue
class TaskQueue<T> {
    #enq: T[] = [];
    #deq: T[] = [];
    #task: T | undefined;

    constructor() {}

    enqueue(e: T) {
        this.#enq.push(e);
        if (this.#task) return;
        this.#processNextRequest();
    }

    async #processNextRequest() {
        if (!this.#deq.length) {
            let r;
            while (r = this.#enq.pop()) {
                this.#deq.push(r);
            }
        }

        // base case, there are no more tasks
        this.#task = this.#deq.pop();
        if (!this.#task) return;

        // could be errors
        await this.#task;
        this.#processNextRequest();
    }
}
