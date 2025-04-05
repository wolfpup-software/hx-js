export type { HxEventInterface };
export { dispatchHxEvent, dispatchHxFromForm, HxEvent };
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
declare function dispatchHxFromForm(e: Event): void;
