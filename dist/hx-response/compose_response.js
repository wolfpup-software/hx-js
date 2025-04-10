import { HxResponseEvent, HxResponseErrorEvent } from "./hx_response_event.js";
function getProjectionStyle(el) {
    return el.getAttribute("_projection");
}
function getProjectionTarget(e) {
    let { target } = e;
    if (!(target instanceof Element))
        return null;
    const selector = target.getAttribute("target") || "_currentTarget";
    if ("_document" === selector)
        return document;
    if ("_target" === selector)
        return target;
    let { currentTarget } = e;
    if ("_currentTarget" === selector)
        return currentTarget;
    if (currentTarget instanceof Document ||
        currentTarget instanceof DocumentFragment ||
        currentTarget instanceof Element) {
        return currentTarget.querySelector(selector);
    }
}
function getThrottleTarget(e, projectionTarget) {
    let { target, currentTarget } = e;
    if (!(target instanceof Element))
        return null;
    const selector = target.getAttribute("_throttle") || "none";
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
    let timeoutMsAttr = el.getAttribute("_timeout-ms");
    let timeoutMs = parseFloat(timeoutMsAttr);
    if (Number.isNaN(timeoutMs)) {
        timeoutMs = 5000;
    }
    return timeoutMs;
}
function buildHxRequest(e) {
    let { target } = e;
    if (target instanceof HTMLAnchorElement) {
        // get _href
        return new Request(target.href);
    }
    if (target instanceof HTMLFormElement) {
        // get _action
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
    if ("text/html; charset=utf-8" !== contentType) {
        throw new Error(`unexpected content-type: ${contentType}`);
    }
    const templateEl = document.createElement("template");
    templateEl.innerHTML = text;
    return templateEl;
}
function fetchAndDispatchResponseEvent(target, request, signal, projectionStyle, projectionTarget) {
    let hangarElement;
    let targetElement;
    if (projectionTarget instanceof Element && target instanceof Element) {
        hangarElement = projectionTarget;
        targetElement = target;
    }
    fetch(request, {
        signal,
    })
        .then(function (response) {
        if (hangarElement && targetElement) {
            targetElement.setAttribute("_fetch-state", "pending");
            hangarElement.setAttribute("_fetch-state", "pending");
        }
        return Promise.all([response, response.text()]);
    })
        .then(function ([response, body]) {
        if (hangarElement && targetElement) {
            targetElement.setAttribute("_fetch-state", "fulfilled");
            hangarElement.setAttribute("_fetch-state", "fulfilled");
        }
        let template = dangerouslyBuildTemplate(response, body);
        let event = new HxResponseEvent({
            template,
            response,
            projectionTarget,
            projectionStyle,
            eventInit: { bubbles: true, composed: true },
        });
        target.dispatchEvent(event);
    })
        .catch(function (reason) {
        if (hangarElement && targetElement) {
            targetElement.setAttribute("_fetch-state", "rejected");
            hangarElement.setAttribute("_fetch-state", "rejected");
        }
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
    fetchAndDispatchResponseEvent(target, request, signal, projectionStyle, projectionTarget);
}
export { composeResponse };
