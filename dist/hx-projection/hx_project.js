import { projectHxResponse } from "./project_response.js";
class HxProject {
	// #tasks = new TaskQueue();
	constructor() {
		this.onHxResponse = this.onHxResponse.bind(this);
	}
	onHxResponse(e) {
		let task = projectHxResponse(e);
		if (!task) return;
	}
}
export { HxProject };
