class TaskQueue {
    #enq = [];
    #deq = [];
    #task;
    enqueue(e) {
        this.#enq.push(e);
        if (this.#task)
            return;
        this.#processNextTask();
    }
    async #processNextTask() {
        if (!this.#deq.length) {
            let r;
            while ((r = this.#enq.pop())) {
                this.#deq.push(r);
            }
        }
        // base case, there are no more tasks
        this.#task = this.#deq.pop();
        if (this.#task === undefined)
            return;
        await this.#task;
        this.#processNextTask();
    }
}
export { TaskQueue };
