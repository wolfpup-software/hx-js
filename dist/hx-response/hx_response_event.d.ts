interface HxResponseEventInterface {
    projectionTarget: Node | null;
    projectionStyle: string;
    response: Response;
    template: HTMLTemplateElement;
}
interface HxResponseEventParams {
    projectionTarget: Node | null;
    projectionStyle: string;
    response: Response;
    template: HTMLTemplateElement;
}
interface HxResponseErrorEventInterface {
    error: unknown;
}
declare class HxResponseErrorEvent extends Event implements HxResponseErrorEventInterface {
    #private;
    constructor(error: unknown, eventInit?: EventInit);
    get error(): unknown;
}
declare class HxResponseEvent extends Event implements HxResponseEventInterface {
    #private;
    constructor(params: HxResponseEventParams, eventInit?: EventInit);
    get projectionTarget(): Node;
    get projectionStyle(): string;
    get response(): Response;
    get template(): HTMLTemplateElement;
}
export type { HxResponseEventInterface };
export { HxResponseEvent, HxResponseErrorEvent };
