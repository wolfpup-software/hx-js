class t extends Event{sourceEvent;constructor(t,e){super("hx-request",{bubbles:!0,composed:e}),this.sourceEvent=t}}function e(e){let r=function(t){if(!(t.target instanceof Element))return;if(t.target instanceof HTMLFormElement)return t.target;let e=t.target;for(;e&&e!==t.currentTarget;){if(e instanceof HTMLAnchorElement)return e;e=e.parentElement}}(e);if(r){if(!r.getAttribute("hx-projection"))return;e.preventDefault();let n=null!==r.getAttribute("hx-composed");r.dispatchEvent(new t(e,n))}}class r extends Event{sourceEvent;response;error;constructor(t){super("hx-response",{bubbles:!0,composed:t.composed}),this.sourceEvent=t}}async function n(e,n){if(!(e.target instanceof Element))return;if(!e.target.getAttribute("hx-projection"))return;let s=function(e){if(!(e instanceof t))return;if(e.target instanceof HTMLAnchorElement)return new Request(e.target.href);if(e.target instanceof HTMLFormElement){let t;return e.sourceEvent instanceof SubmitEvent&&(t=e.sourceEvent.submitter),new Request(e.target.action,{method:e.target.getAttribute("method")||"get",body:new FormData(e.target,t)})}}(e);if(!s)return;e.target.removeAttribute("hx-status-code"),e.target.setAttribute("hx-status","requested");let o=new r(e);try{o.response=await fetch(s,{signal:n.getSignals()}),e.target.setAttribute("hx-status","responded")}catch(t){o.error=t,e.target.setAttribute("hx-status","request-error")}o.response&&e.target.setAttribute("hx-status-code",o.response.status.toString()),e.target.dispatchEvent(o)}class s{#t=[];#e=[];#r;enqueue(t){this.#t.push(t),this.#r||this.#n()}async#n(){if(!this.#e.length){let t;for(;t=this.#t.pop();)this.#e.push(t)}this.#r=this.#e.pop(),void 0!==this.#r&&(await this.#r,this.#n())}}class o{#s;#o;#i;#a;constructor(t,e){this.#i=t,this.#a=performance.now(),this.#s=new AbortController,this.#o=AbortSignal.timeout(e)}get aborted(){return this.#s.signal.aborted||this.#o.aborted}throttle(){performance.now()-this.#a>this.#i&&this.abort()}abort(){this.#s.abort()}getSignals(){return AbortSignal.any([this.#s.signal,this.#o])}}class i{#c=new WeakMap;set(t){if(!(t instanceof Element))return;let e=this.#c.get(t);if(e&&(e.throttle(),!e.aborted))return;let r=parseFloat(t.getAttribute("hx-throttle"));Number.isNaN(r)&&(r=0);let n=parseFloat(t.getAttribute("hx-timeout"));return Number.isNaN(n)&&(n=5e3),e=new o(r,n),this.#c.set(t,e),e}}class a extends Event{sourceEvent;node;fragment;error;constructor(t){super("hx-project",{bubbles:!0,composed:t.composed}),this.sourceEvent=t}}class c extends Error{}async function u(t){if(!(t instanceof r)||t.error||!t.response)return;if(!(t.target instanceof HTMLAnchorElement||t.target instanceof HTMLFormElement))return;const e=await t.response.text();queueMicrotask((function(){const r=new a(t);try{r.node=function(t){if(!(t.target instanceof Element))return;const e=t.target.getAttribute("target")||"_currentTarget";return"_target"===e?t.target:"_document"===e?document:null===t.currentTarget?"_currentTarget"===e?document:document.querySelector(e):t.currentTarget instanceof Element?"_currentTarget"===e?t.currentTarget:t.currentTarget.querySelector(e):void 0}(t),r.node&&(r.fragment=function(t,e){let r=t.headers.get("content-type");if("text/html; charset=utf-8"!==r)throw new c(`unexpected content-type: ${r}`);const n=document.createElement("template");return n.innerHTML=e,n.content.cloneNode(!0)}(t.response,e)),r.fragment&&function(t,e,r){if(!(t.target instanceof Element))return;const n=t.target.getAttribute("hx-projection");if("none"===n)return e;if("start"===n)return e.insertBefore(r,e.firstChild);if("end"===n)return e.appendChild(r);const s=e.parentElement;if(s){if("replace"===n)return s.replaceChild(r,e);if("remove"===n)return s.removeChild(e);if("before"===n)return s.insertBefore(r,e);if("after"===n)return s.insertBefore(r,e.nextSibling)}if(e instanceof Element||e instanceof Document||e instanceof DocumentFragment){if("remove_children"===n)return e.replaceChildren(),e;if("replace_children"===n)return e.replaceChildren(r),e}throw new c("unknown hx-projection attribute")}(t,r.node,r.fragment)}catch(t){r.error=t}if(t.target instanceof Element){const e=r.error?"projection-error":"projected";t.target.setAttribute("hx-status",e)}t.target.dispatchEvent(r)}))}function l(t,r,n){t.addEventListener("click",e),t.addEventListener("submit",e),t.addEventListener("hx-request",r),t.addEventListener("hx-response",n)}function h(t,r,n){t.removeEventListener("click",e),t.removeEventListener("submit",e),t.removeEventListener("hx-request",r),t.addEventListener("hx-response",n)}const f=new class{#u=new s;#l=new i;constructor(){this.onHxRequest=this.onHxRequest.bind(this)}onHxRequest(t){let e=this.#l.set(t.target);e&&this.#u.enqueue(n(t,e))}},g=new class{#u=new s;constructor(){this.onHxResponse=this.onHxResponse.bind(this)}onHxResponse(t){let e=u(t);e&&this.#u.enqueue(e)}};l(document,f.onHxRequest,g.onHxResponse);export{a as HxProjectEvent,t as HxRequestEvent,r as HxResponseEvent,l as connect,h as disconnect};
