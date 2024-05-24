interface CallbacksImpl {
    onAnchor(e: Event);
    onSubmit(e: CustomEvent<HTMLElement | null>);
}

// might not be neccessary?
class Callbacks implements CallbacksImpl {
    constructor() {
        this.onAnchor = this.onAnchor.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onAnchor(e: Event) {}
    onSubmit(e: CustomEvent<HTMLElement | null>) {}
}

class MessageQueue {
    pushQueue: unknown[] = [];
    popQueue: unknown[] = [];
    currTask: unknown = {};

    constructor() {
        this.processRequest = this.processRequest.bind(this);
    }

    push(e: unknown) {
        this.pushQueue.push(e);
        // kickoff queue!
        //
        // pop push queue into popQueue
        // pass request to 
    }

    async processRequest() {
        // while pop push queue to pop queue
        // pop off pop queue
    }
}