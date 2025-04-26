export type { HxEventInterface };
export { dispatchHxAction, HxEvent };
interface HxEventInterface extends Event {
    action: string;
    sourceEvent: Event;
}
declare class HxEvent extends Event implements HxEvent {
    #private;
    constructor(e: Event, action: string);
    get action(): string;
    get sourceEvent(): Event;
}
declare function dispatchHxAction(e: Event): void;
