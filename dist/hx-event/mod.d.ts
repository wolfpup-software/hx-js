export type { HxEventInterface };
export { dispatchHxEvent, dispatchHxOnSubmit, HxEvent };
interface HxEventInterface extends Event {
    action: string;
    typeAction: string;
    sourceEvent: Event;
}
declare class HxEvent extends Event implements HxEvent {
    #private;
    constructor(e: Event, action: string);
    get sourceEvent(): Event;
    get action(): string;
    get typeAction(): string;
}
declare function dispatchHxEvent(e: Event): void;
declare function dispatchHxOnSubmit(e: Event): void;
