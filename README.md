# hx-js

(H)ypertext e(x)tension for the browser.

## About

`Hx` lets `<a>` and `<form>` elements _optionally_ fetch hypertext and update the DOM without page refreshes.

## Install

Add `hx-js` to an `html` document.

```html
<script type=module src="https://raw.githubusercontent.com/wolfpup-software/hx-js/main/hx/dist/hx.js"></script>
```

## How to use

Anchor and form elements with an `hx-projection` attribute will fetch html `fragments` and update the dom.

```html
<!-- anchors -->
<a
    href="/document/fragment"
    target="ul"
    hx-projection="start">
    click me!
</a>

<!-- forms -->
<form
    action="/post/something"
    method="post"
    target="li:last-child"
    hx-projection="replace">
    <input type="submit">
</form>
```

Elements _without_ the `hx-projection` attribute behave like normal `<a>` and `<form>` elements.

### Attributes

#### target

`Hx` queries an element using the `target` attribute.

A `target` value can be:
- `_target` -> the `target` property of an hx `event`.
- `_currentTarget` -> the `currentTarget` property for hx `event`
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
- responded
- projected
- error

```html
<a
    href="/document/fragment"
    target="ul"
    hx-projection="start"
    hx-status="requested">
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
    hx-status-code="200">
    click me!
</a>
```

#### hx-composed

The `hx-composed` attribute adds the `composed` property to an event allowing hx events to propagate through the shadow-dom.

This is helpful when developers need to use web components but don't want to import an external library.

## Developer Experience

`Hx` is built to work as closely to the DOM as possible.

It's modular and easily extensible. 

In lieu of "expressive" apis, `Hx` splits the process of making little hypertext jumps into a series of DOM events:
- hx-request events
- hx-response events
- hx-projection events

The `hx-request` module dispatches hx-request events from `<a>` and `<form>` elements with an `hx-projection` attribute.

The `hx-response` module dispatches hx-response events after recieving valid hx-request events.

The `hx-project` module dispatches an hx-project event after placing a document fragment onto a document or shadow dom. 

Every part of the process is opt-in and can be overriden giving pups an opportunity to drop invalid requests and react to projections.

### Goals

Deprecation by RFC.

The browser should already be doing this.

Maybe not the same events, maybe not the same attributes, but little hypertext jumps should already be browser spec.

Until then, `hx` intends to be a 1.5kb minified polyfil.

## License

`Hx-js` is released under the BSD 3-Clause License.