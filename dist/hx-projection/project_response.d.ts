interface HxProjectEventImpl {
    projectionTarget: Node;
    projectedFragment: Node;
    projectionStyle: string;
}
interface HxProjectEventParams {
    projectionTarget: Node;
    projectionStyle: string;
    projectedFragment: Node;
    disconnectedFragment: Node;
}
declare class HxProjectEvent extends Event implements HxProjectEventImpl {
    #private;
    constructor(params: HxProjectEventParams);
    get projectionTarget(): Node;
    get projectedFragment(): Node;
    get disconnectedFragment(): Node | undefined;
    get projectionStyle(): string;
}
declare function dispatchHxProjection(e: Event): void;
export type { HxProjectEventImpl };
export { dispatchHxProjection, HxProjectEvent };
