declare function connect(
	el: Node,
	onRequest: EventListenerOrEventListenerObject,
	onResponse: EventListenerOrEventListenerObject,
): void;
declare function disconnect(
	el: Node,
	onRequest: EventListenerOrEventListenerObject,
	onResponse: EventListenerOrEventListenerObject,
): void;
export { connect, disconnect };
