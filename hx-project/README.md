# hx-request

`Hx-request` callbacks dispatch `hx-request` events.

## events

`hx-request`

- e.target -> the `anchor` or `form` element
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or `shadow root`
- e.sourceEvent -> the `DOM` event triggering an `hx-request` event

## about

`Hx-project` event dispatches after a document `fragment` is projected onto the DOM.

Hacker pups can tailor their own `hx-project` callbacks to create reactive behavior (like adding a css class to trigger animations).

WOOOF!
