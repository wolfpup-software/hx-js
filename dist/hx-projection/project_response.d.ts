interface HxProjectEventImpl {
    projectionTarget: EventTarget;
    projectedFragment: Node;
    projectionStyle: string;
    disconnectedFragment?: Node;
}
interface HxProjectEventParams {
    projectionTarget: EventTarget;
    projectionStyle: string;
    projectedFragment: Node;
    disconnectedFragment?: Node;
}
declare class HxProjectEvent extends Event implements HxProjectEventImpl {
    #private;
    constructor(params: HxProjectEventParams);
    get projectionTarget(): EventTarget;
    get projectedFragment(): Node;
    get disconnectedFragment(): Node;
    get projectionStyle(): string;
}
declare function dispatchHxProjection(e: Event): void;
export type { HxProjectEventImpl };
export { dispatchHxProjection, HxProjectEvent };
