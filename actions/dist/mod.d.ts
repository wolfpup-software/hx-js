export type { HxActionEventInterface };
export { dispatchHxAction, HxActionEvent, HxActions };
interface HxActionEventInterface extends Event {
    action: string;
    sourceEvent: Event;
}
declare class HxActionEvent extends Event implements HxActionEvent {
    #private;
    constructor(e: Event, action: string);
    get action(): string;
    get sourceEvent(): Event;
}
declare class HxActions {
    #private;
    constructor(eventNames: string[]);
    connect(el: EventTarget): void;
    disconnect(el: EventTarget): void;
}
declare function dispatchHxAction(e: Event): void;
