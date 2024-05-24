// two stack queue
class Queue<T> {
    #enq: T[] = [];
    #deq: T[] = [];

    enqueue(e: T) {
        this.#enq.push(e);
    }

    dequeue(): T | undefined {
        if (!this.#deq.length) {
            let r;
            while (r = this.#enq.pop()) {
                this.#deq.push(r);
            }
        }

        return this.#deq.pop();
    }
}

class TaskQueue<T> {
    #queue = new Queue<T>();
    #task: T | undefined;

    constructor() {}

    push(e: T) {
        this.#queue.enqueue(e);
        if (this.#task) return;
        this.#processNextRequest();
    }

    async #processNextRequest() {
        // base case, there are no more tasks
        this.#task = this.#queue.dequeue();
        if (!this.#task) return;

        // could be errors
        await this.#task;
        this.#processNextRequest();
    }
}
