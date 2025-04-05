import { HxResponseEvent, HxResponseErrorEvent } from "./hx_response_event.js";
function getProjectionStyle(el) {
    return el.getAttribute(":projection");
}
function getProjectionTarget(e) {
    let { target, currentTarget } = e;
    if (!(target instanceof Element))
        return null;
    const selector = target.getAttribute("target") || "_currentTarget";
    if ("_document" === selector)
        return document;
    if ("_target" === selector)
        return target;
    if (currentTarget instanceof Document ||
        currentTarget instanceof DocumentFragment ||
        currentTarget instanceof Element) {
        if ("_currentTarget" === selector)
            return currentTarget;
        return currentTarget.querySelector(selector);
    }
}
function getThrottleTarget(e, projectionTarget) {
    let { target, currentTarget } = e;
    if (!(target instanceof Element))
        return null;
    const selector = target.getAttribute(":throttle") || "none";
    if ("_projectionTarget" === selector)
        return projectionTarget;
    if ("_document" === selector)
        return document;
    if ("_target" === selector)
        return target;
    if ("_currentTarget" === selector)
        return currentTarget;
}
function getTimeoutMs(el) {
    let timeoutMsAttr = el.getAttribute(":timeout-ms");
    let timeoutMs = parseFloat(timeoutMsAttr);
    if (Number.isNaN(timeoutMs)) {
        timeoutMs = 5000;
    }
    return timeoutMs;
}
function buildHxRequest(e) {
    let { target } = e;
    if (target instanceof HTMLAnchorElement) {
        return new Request(target.href);
    }
    if (target instanceof HTMLFormElement) {
        return new Request(target.action, {
            method: target.getAttribute("method") || "get",
            body: new FormData(target),
        });
    }
}
function getAbortController(target) {
    let timeoutMs = getTimeoutMs(target);
    let abortController = new AbortController();
    let timeoutAbortSignal = AbortSignal.timeout(timeoutMs);
    let signal = AbortSignal.any([abortController.signal, timeoutAbortSignal]);
    return [abortController, signal];
}
function setThrottler(throttler, throttleTarget, abortController) {
    let el = throttler.get(throttleTarget);
    if (el)
        el.abort();
    if (throttleTarget)
        throttler.set(throttleTarget, abortController);
}
function dangerouslyBuildTemplate(response, text) {
    let contentType = response.headers.get("content-type");
    // maybe fail silently?
    if ("text/html; charset=utf-8" !== contentType) {
        throw new Error(`unexpected content-type: ${contentType}`);
    }
    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl;
}
function fetchAndDispatchResponseEvent(target, request, signal, projectionStyle, projectionTarget) {
    fetch(request, {
        signal,
    })
        .then(function (response) {
        return Promise.all([response, response.text()]);
    })
        .then(function ([response, body]) {
        let template = dangerouslyBuildTemplate(response, body);
        let event = new HxResponseEvent({
            template,
            response,
            projectionTarget,
            projectionStyle,
        }, { bubbles: true, composed: true });
        target.dispatchEvent(event);
    })
        .catch(function (reason) {
        let event = new HxResponseErrorEvent(reason, {
            bubbles: true,
            composed: true,
        });
        target.dispatchEvent(event);
    });
}
function composeResponse(throttler, e) {
    let { target } = e;
    if (!(target instanceof Element))
        return;
    let projectionStyle = getProjectionStyle(target);
    if (!projectionStyle)
        return;
    let request = buildHxRequest(e);
    if (!request)
        return;
    let [abortController, signal] = getAbortController(target);
    let projectionTarget = getProjectionTarget(e);
    let throttleTarget = getThrottleTarget(e, projectionTarget);
    setThrottler(throttler, throttleTarget, abortController);
    // set request status on projection and target elements
    fetchAndDispatchResponseEvent(target, request, signal, projectionStyle, projectionTarget);
}
export { composeResponse };
