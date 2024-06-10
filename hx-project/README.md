# hx-project

`Hx-project` callbacks dispatch hx-project events.

## about

`Hx-project` event dispatches after a document `fragment` is projected onto the DOM.

Hacker pups can tailor their own hx-project callbacks to create reactive behavior (like adding a css class to trigger animations).

WOOOF!

## events

`hx-project`

- e.target -> the `anchor` or `form` element dispatching the hx-request event
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or `shadow root`
- e.sourceEvent -> the DOM `event` triggering an hx-project event
