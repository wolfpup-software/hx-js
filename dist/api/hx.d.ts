declare class Hx {
    #private;
    constructor(eventNames?: string[]);
    connect(el: EventTarget): void;
    disconnect(el: EventTarget): void;
}
export { Hx };
