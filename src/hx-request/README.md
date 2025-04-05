# hx-request

`Hx-request` defines a boundary between hypertext requests and their responses with DOM events.

`Hx-request` callbacks dispatch hx-request events.

WOOOF!

## events

`:request`

- e.target -> the `anchor` or `form` dispatching an hx-request event
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or a `shadow root`
