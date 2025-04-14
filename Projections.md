### Requests

If `<a>` and `<form>` elements have a `_projection` attribute, Hx fetch an html fragment and project it into the dom.

```html
<a _href="/document/fragment" _target="ul" _projection="start"> click me! </a>

<a _href="/mouseover/fragment" _target="[preview]" _pointerenter="replace_children">
	<form
		_action="/post/something"
		_method="post"
		_target="li:last-child"
		_submit="replace"
	>
		<input type="submit" />
	</form>
<a>
```

Elements _without_ the `_projection` or attribute behave like normal `<a>` and `<form>` elements.

### Attributes

#### target

`Hx` queries an element using the `target` attribute.

A `target` value can be:

- `_target` -> the `target` property of an hx event.
- `_document` -> the document
- `_currentTarget` -> the `currentTarget` property of an hx event
- any valid CSS selector.

#### Projection

Projection is the process of placing UI fragments into the DOM.

The `_projection` property defines _how_ a `fragment` is projected onto a `document` relative to the `target` element.

A `_projection` properties can have the following values:

- `none` -> do nothing
- `before` -> insert a fragment before the target element
- `after` -> insert a fragment after the target element
- `remove` -> remove the target element
- `replace` -> swap the target element with a fragment
- `start` -> insert a fragment before the target element descendants
- `end` -> append a fragment after the target element descendants
- `remove_children` -> remove the target element descendants
- `replace_children` -> replace the target element descendants with a fragment

#### Throttle

The `_throttle` property defines how to cancel a request made by an anchor or form element before a new request is created.

- `_target` -> the `target` property of an hx event.
- `_document` -> the document
- `_currentTarget` -> the `currentTarget` property of an hx event
- `_projectionTarget` -> the node used to project a fragment
- `none` -> no target provided

The fallback value is `none`.

If a `_throttle` node is associated with a pending fragment request, the request will be cancelled. A new request will be coupled to the `_throttle` node.

#### response-state

The `_fetch-state` attribute reflectS the state of a hypertext request onto the original `<a>` or `<form>` element and the projected target element.

The following values will be applied:

- pending
- fulfilled
- rejected

They directly reflect promise state definitions.

```html
<a
	_href="/document/fragment"
	_target="ul"
	_projection="start"
	_fetch-state="pending"
>
	click me!
</a>
```