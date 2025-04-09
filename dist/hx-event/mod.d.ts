export type { HxEventInterface };
export { dispatchHxEvent, dispatchHxFromForm, HxEvent };
interface HxEventInterface extends Event {
    action: string;
    sourceEvent: Event;
}
declare class HxEvent extends Event implements HxEvent {
    #private;
    constructor(e: Event, type: string, action: string);
    get action(): string;
    get actionType(): string;
    get sourceEvent(): Event;
}
declare function dispatchHxEvent(e: Event): void;
declare function dispatchHxFromForm(e: Event): void;
