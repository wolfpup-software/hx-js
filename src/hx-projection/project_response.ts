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
		super("hx-project", {
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

	const placement = e.target.getAttribute("hx-projection");
	if (placement === "none") return targetNode;
	if (placement === "start")
		return targetNode.insertBefore(fragment, targetNode.firstChild);
	if (placement === "end") return targetNode.appendChild(fragment);

	const parent = targetNode.parentElement;
	if (parent) {
		if (placement === "replace")
			return parent.replaceChild(fragment, targetNode);
		if (placement === "remove") return parent.removeChild(targetNode);
		if (placement === "before")
			return parent.insertBefore(fragment, targetNode);
		if (placement === "after")
			return parent.insertBefore(fragment, targetNode.nextSibling);
	}

	if (
		targetNode instanceof Element ||
		targetNode instanceof Document ||
		targetNode instanceof DocumentFragment
	) {
		if (placement === "remove_children") {
			targetNode.replaceChildren();
			return targetNode;
		}
		if (placement === "replace_children") {
			targetNode.replaceChildren(fragment);
			return targetNode;
		}
	}

	throw new HxProjectError("unknown hx-projection attribute");
}

function getTarget(e: Event): Node | undefined {
	if (!(e.target instanceof Element)) return;

	const selector = e.target.getAttribute("target") || "_currentTarget";
	if (selector === "_target") return e.target;
	if (selector === "_document") return document;

	if (e.currentTarget === null) {
		if (selector === "_currentTarget") return document;
		return document.querySelector(selector);
	}

	if (e.currentTarget instanceof Element) {
		if (selector === "_currentTarget") return e.currentTarget;
		return e.currentTarget.querySelector(selector);
	}
}

function dangerouslyBuildTemplate(response: Response, text: string): Node {
	let contentType = response.headers.get("content-type");
	if (contentType !== "text/html; charset=utf-8") {
		throw new HxProjectError(`unexpected content-type: ${contentType}`);
	}

	const templateEl = document.createElement("template");
	templateEl.innerHTML = text;

	return templateEl.content.cloneNode(true);
}

async function projectHxResponse(e: Event) {
	if (!(e instanceof HxResponseEvent) || e.error || !e.response) return;
	if (
		!(
			e.target instanceof HTMLAnchorElement ||
			e.target instanceof HTMLFormElement
		)
	)
		return;

	const text = await e.response.text();

	queueMicrotask(function () {
		const event = new HxProjectEvent(e);

		try {
			event.node = getTarget(e);
			if (event.node)
				event.fragment = dangerouslyBuildTemplate(e.response, text);
			if (event.fragment) projectPlacement(e, event.node, event.fragment);
		} catch (err: unknown) {
			event.error = err;
		}

		if (e.target instanceof Element) {
			const status = event.error ? "projection-error" : "projected";
			e.target.setAttribute("hx-status", status);
		}

		e.target.dispatchEvent(event);
	});
}

export type { HxProjectEventImpl };
export { projectHxResponse, HxProjectEvent };
