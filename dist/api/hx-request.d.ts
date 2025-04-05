declare class HxRequest {
    #private;
    constructor(el: Document | ShadowRoot);
    connect(): void;
    disconnect(): void;
}
export { HxRequest };
