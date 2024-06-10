# hx-request

`Hx-request` defines a boundary between hypertext requests and their responses with DOM events.

`Hx-request` callbacks dispatch hx-request events.

WOOOF!

## events

`hx-request`

- e.target -> the `anchor` or `form` element dispatching the hx-request event
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or `shadow root`
- e.sourceEvent -> the `DOM` event responsible for an hx-request event
