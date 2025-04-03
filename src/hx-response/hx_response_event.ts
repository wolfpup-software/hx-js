interface HxResponseEventInterface {
	projectionTarget: Node | null;
	projectionStyle: string;
	response: Response;
}

class HxResponseEvent extends Event implements HxResponseEventInterface {
	#projectionTarget: Node | null;
	#projectionStyle: string;
	#response: Response;

	constructor(
		response: Response,
		projectionTarget: Node | null,
		projectionStyle,
		eventInit?: EventInit,
	) {
		super(":response", eventInit);

		this.#response = response;
		this.#projectionStyle = projectionStyle;
		this.#projectionTarget = projectionTarget;
	}

	get projectionTarget() {
		return this.#projectionTarget;
	}

	get projectionStyle() {
		return this.#projectionStyle;
	}

	get response() {
		return this.#response;
	}
}

export type { HxResponseEventInterface };
export { HxResponseEvent };
