import { HxResponseEvent } from "../hx-response/mod.js";

interface HxProjectEventImpl {
	sourceEvent: Event;
	node: Node | undefined;
	fragment: Node | undefined;
	error: unknown;
}

class HxProjectEvent extends Event implements HxProjectEventImpl {
	sourceEvent: Event;
	node: Node | undefined;
	fragment: Node | undefined;
	error: unknown;

	constructor(sourceEvent: Event) {
		super(":project", {
			bubbles: true,
			composed: sourceEvent.composed,
		});

		this.sourceEvent = sourceEvent;
	}
}

class HxProjectError extends Error {}

function projectPlacement(
	e: Event,
	targetNode: Node,
	fragment: Node,
): Node | undefined {
	if (!(e.target instanceof Element)) return;

	const placement = e.target.getAttribute(":projection");
	if ("none" === placement) return targetNode;
	if ("start" === placement)
		return targetNode.insertBefore(fragment, targetNode.firstChild);
	if ("end" === placement) return targetNode.appendChild(fragment);

	const parent = targetNode.parentElement;
	if (parent) {
		if ("replace" === placement)
			return parent.replaceChild(fragment, targetNode);
		if ("remove" === placement) return parent.removeChild(targetNode);
		if ("before" === placement)
			return parent.insertBefore(fragment, targetNode);
		if ("after" === placement)
			return parent.insertBefore(fragment, targetNode.nextSibling);
	}

	if (
		targetNode instanceof Element ||
		targetNode instanceof Document ||
		targetNode instanceof DocumentFragment
	) {
		if ("remove_children" === placement) {
			targetNode.replaceChildren();
			return targetNode;
		}
		if ("replace_children" === placement) {
			targetNode.replaceChildren(fragment);
			return targetNode;
		}
	}

	// maybe fail silently?
	throw new HxProjectError("unknown :projection attribute");
}

function getTarget(e: Event): Node | undefined {
	if (!(e.target instanceof Element)) return;

	// ?? ify logic
	// const selector = e.target.getAttribute("target") || "_document";

	// e.currentTarget
	const selector = e.target.getAttribute("target") || "_currentTarget";
	if ("_target" === selector) return e.target;
	if ("_document" === selector) return document;

	// if (e.currentTarget === null) {
	// 	if ("_currentTarget" === selector) return document;
	// 	return document.querySelector(selector);
	// }

	// if (e.currentTarget instanceof Element) {
	// 	if ("_currentTarget" === selector) return e.currentTarget;
	// 	return e.currentTarget.querySelector(selector);
	// }
}

function dangerouslyBuildTemplate(response: Response, text: string): Node {
	let contentType = response.headers.get("content-type");
	if ("text/html; charset=utf-8" !== contentType) {
		// maybe fail silently?
		throw new HxProjectError(`unexpected content-type: ${contentType}`);
	}

	const templateEl = document.createElement("template");
	templateEl.innerHTML = text;

	return templateEl.content.cloneNode(true);
}

function dispatchHxProjection(e: Event) {
	console.log(e);
	// if (!(e instanceof HxResponseEvent) || e.error || !e.response) return;
	// if (
	// 	!(
	// 		e.target instanceof HTMLAnchorElement ||
	// 		e.target instanceof HTMLFormElement
	// 	)
	// )
	// 	return;
	// const text = await e.response.text();
	// queueMicrotask(function () {
	// 	const event = new HxProjectEvent(e);
	// 	try {
	// 		event.node = getTarget(e);
	// 		if (event.node)
	// 			event.fragment = dangerouslyBuildTemplate(e.response, text);
	// 		if (event.fragment) projectPlacement(e, event.node, event.fragment);
	// 	} catch (err: unknown) {
	// 		event.error = err;
	// 	}
	// 	if (e.target instanceof Element) {
	// 		const status = event.error ? "projection-error" : "projected";
	// 		e.target.setAttribute("hx-status", status);
	// 	}
	// 	e.target.dispatchEvent(event);
	// });
}

export type { HxProjectEventImpl };
export { dispatchHxProjection, HxProjectEvent };
