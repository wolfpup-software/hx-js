# hex-js

(H)ypertext e(x)tension for the browser.

## About

`Hx` enables `<a>` and `<form>` elements to _optionally_ fetch hypertext and update the DOM without page refreshes.

## Install

```html
npm install https://github.com/wolfpup-software/hx-js
```

## How to use

### Events

#### Syntax

Hx listens for common interaction events like `click` and `keydown`.

In the example below, elements with an `:` attribute will dispatch an `HxEvent`.

```html
<button :="increment">+1</button>
<button :="decrement">-1</button>

<input :="set_date" type="date" />

<form :="update_form">
	<input />
	<input type="submit" />
</form>
```

#### HxEvent

Hx will dispatch an `HxEvent` on all elements with a `:` property in the composed path of an event. The `:` property defines an "action".

A new event will dispatched with `Event.type` defined as the original event type preceeded by a colon.

So a `click` event becomes a `:click` event.

And a `keydown` event becomes a `:keydown`.

The `event.target` will always be the element with an action `:` property.
HxEvents have a corresponding property `HxEvent.action`. They also have a property called `HxEvent.typeAction` that combines the event and the action:

`:click:increment`;

This makes it relatively easy to send `:click:increment` as an action to update state.

### Requests

If `<a>` and `<form>` elements have a `:projection` attribute, Hx fetch an html fragment and project it into the dom.

```html
<a href="/document/fragment" target="ul" :projection="start"> click me! </a>

<form
	action="/post/something"
	method="post"
	target="li:last-child"
	:projection="replace"
>
	<input type="submit" />
</form>
```

Elements _without_ the `:projection` or attribute behave like normal `<a>` and `<form>` elements.

### Attributes

#### target

`Hx` queries an element using the `target` attribute.

A `target` value can be:

- `_target` -> the `target` property of an hx event.
- `_document` -> the document
- `_currentTarget` -> the `currentTarget` property of an hx event
- any valid CSS selector.

#### :projection

Projection is the process of placing UI fragments into the DOM.

The `:projection` property defines _how_ a `fragment` is projected onto a `document` relative to the `target` element.

A `:projection` properties can have the following values:

- `none` -> do nothing
- `before` -> insert a fragment before the target element
- `after` -> insert a fragment after the target element
- `remove` -> remove the target element
- `replace` -> swap the target element with a fragment
- `start` -> insert a fragment before the target element descendants
- `end` -> append a fragment after the target element descendants
- `remove_children` -> remove the target element descendants
- `replace_children` -> replace the target element descendants with a fragment

#### :throttle

The `:throttle` property defines how to cancel a request made by an anchor or form element before a new request is created.

- `_target` -> the `target` property of an hx event.
- `_document` -> the document
- `_currentTarget` -> the `currentTarget` property of an hx event
- `_projectionTarget` -> the node used to project a fragment
- `none`

The default value is `none`.

If a `:throttle` node is associated with a pending fragment request, the request will be cancelled. A new request will be coupled to the `:throttle` node.

#### :status

The `:status` attribute is used to reflect the state of a hypertext request onto the original `<a>` or `<form>` element.

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
	:projection="start"
	:status="requested"
>
	click me!
</a>
```

#### :status-code

The `:status-code` attribute is used to signal request state to the original `<a>` or `<form>` element

```html
<a
	href="/document/fragment"
	target="ul"
	:projection="start"
	*status="responded"
	*status-code="200"
>
	click me!
</a>
```

#### :composed

The `:composed` attribute adds the `composed` property to an event allowing hx events to propagate through a shadow root.

```html
<a href="/document/fragment" target="ul" :projection="start" :composed>
	click me!
</a>
```

## License

`Hx-js` is released under the BSD 3-Clause License.
