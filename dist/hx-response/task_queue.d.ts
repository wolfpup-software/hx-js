declare class TaskQueue {
    #private;
    enqueue(e: Promise<void>): void;
}
export { TaskQueue };
