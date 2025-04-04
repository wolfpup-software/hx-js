interface HxProjectEventImpl {
    sourceEvent: Event;
    node: Node | undefined;
    fragment: Node | undefined;
    error: unknown;
}
declare class HxProjectEvent extends Event implements HxProjectEventImpl {
    sourceEvent: Event;
    node: Node | undefined;
    fragment: Node | undefined;
    error: unknown;
    constructor(sourceEvent: Event);
}
declare function dispatchHxProjection(e: Event): void;
export type { HxProjectEventImpl };
export { dispatchHxProjection, HxProjectEvent };
