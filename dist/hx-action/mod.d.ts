export type { HxEventInterface };
export { dispatchHxEvent, dispatchHxFromForm, HxEvent };
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
declare function dispatchHxEvent(e: Event): void;
declare function dispatchHxFromForm(e: Event): void;
