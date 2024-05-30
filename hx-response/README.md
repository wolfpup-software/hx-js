## hx-response

A linear message queue for hypertext requests.

### events

`hx-response`
- e.target -> the `anchor` or `form` element
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or `shadow root`
- e.sourceEvent -> the `hx-request` event responsible for an `hx-response` event
- request -> the `request` used to fetch a `response`
- response -> the unread response
- error -> any `error` thrown

## about

`Hx-response` defines a barrier between hypertext responses and their projection with DOM `events`.

Hacker pups can tailor their own `hx-response` event callbacks to create custom document fragments.

WOOOF!
