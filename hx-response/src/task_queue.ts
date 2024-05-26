class TaskQueue<T> {
    #enq: T[] = [];
    #deq: T[] = [];
    #task: T | undefined;

    enqueue(e: T) {
        if (e === undefined) return;

        this.#enq.push(e);
        if (this.#task) return;
        
        this.#processNextTask();
    }

    async #processNextTask() {
        if (!this.#deq.length) {
            let r;
            while (r = this.#enq.pop()) {
                this.#deq.push(r);
            }
        }

        // base case, there are no more tasks
        this.#task = this.#deq.pop();
        if (this.#task === undefined) return;

        // could be errors
        await this.#task;
        this.#processNextTask();
    }
}

export { TaskQueue }