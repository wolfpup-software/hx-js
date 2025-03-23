# hex-js

(H)ypertext e(x)tension for the browser.

## About

`Hx` enables `<a>` and `<form>` elements to _optionally_ fetch hypertext and update the DOM without page refreshes.

## Install

Add `hx-js` to an `html` document.

```html
npm install https://github.com/wolfpup-software/hx-js
```

## How to use

### Fetch DOM

Anchor and form elements with an `hx-projection` attribute will fetch html `fragments` and update the dom.

```html
<!-- Fetch HTML with hx-projection -->
<!-- anchors -->
<a
	hx-projection="start"
	href="/document/fragment"
	target="ul">
	click me!
</a>

<!-- forms -->
<form
	hx-projection="replace"
	action="/post/something"
	method="post"
	target="li:last-child"
>
	<input type="submit" >
</form>
```

### Dispatch Events

Button and input elements with an `hx-event` attribute will dispatch an corresponding `HxEvent`.

UI data can be extracted from buttons and input elements.

```html
<!-- send UI data to local logic -->
<button hx-event>
	click me!
</button>

<input
	hx-event
	type="date">

<form
	action="/post/something"
	method="post"
>
	<input hx-event type="submit" >
</form>
```

Elements _without_ the `hx-projection` or the `hx-event` attribute behave like normal `<a>` and `<form>` elements.

### Attributes

#### target

`Hx` queries an element using the `target` attribute.

A `target` value can be:

- `_target` -> the `target` property of an hx event.
- `_currentTarget` -> the `currentTarget` property for hx event
- `_document` -> the document
- any valid CSS selector.

#### hx-projection

The `hx-projection` property defines how a `fragment` is projected onto a `document` relative to the `target` element.

An `hx-projection` properties can have the following values:

- `none` -> nothing will happen
- `before` -> insert a fragment before the target element
- `after` -> insert a fragment after the target element
- `remove` -> remove the target element
- `replace` -> place the target element with a fragment
- `start` -> insert a fragment before the target element descendants
- `end` -> append a fragment after the target element descendants
- `remove_children` -> remove the target element descendants
- `replace_children` -> replace the target element descendants with a fragment

#### hx-status

The `hx-status` attribute is used to reflect the state of a hypertext request onto the original `<a>` or `<form>` element.

The following values will be applied:

- requested
- response-error
- responded
- projection-error
- projected

```html
<a
	href="/document/fragment"
	target="ul"
	hx-projection="start"
	hx-status="requested"
>
	click me!
</a>
```

#### hx-status-code

The `hx-status-code` attribute is used to signal request state to the original `<a>` or `<form>` element

```html
<a
	href="/document/fragment"
	target="ul"
	hx-projection="start"
	hx-status="responded"
	hx-status-code="200"
>
	click me!
</a>
```

#### hx-composed

The `hx-composed` attribute adds the `composed` property to an event allowing hx events to propagate through a shadow root.

```html
<a href="/document/fragment" target="ul" hx-projection="start" hx-composed>
	click me!
</a>
```

## Developer Experience

`Hx` is designed to work _with_ the DOM.

It's modular and easily extensible.

In lieu of "expressive" apis, `Hx` staggers small hypertext jumps into a series of DOM events:

- hx-request events
- hx-response events
- hx-projection events

The `hx-request` module dispatches hx-request events from `<a>` and `<form>` elements with an `hx-projection` attribute.

The `hx-response` module dispatches hx-response events after recieving valid hx-request events.

The `hx-project` module dispatches an hx-project event after placing a fragment into a document or shadow dom.

Every step is opt-in. Pups can listen to events to drop invalid requests and react to projections.

### Goals

Deprecation by RFC. The browser should already be doing this.

Maybe not the same events, maybe not the same attributes, but little hypertext jumps should already be browser spec.

Until then, `hx` intends to be a polyfil (at 1.5kb minified, zipped).

## License

`Hx-js` is released under the BSD 3-Clause License.
