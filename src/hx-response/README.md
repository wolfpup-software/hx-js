## hx-response

`:response` callbacks dispatch :response events.

## about

`:response` defines a barrier between hypertext responses and their projection with DOM `events`.

Hacker pups can tailor their own `:response` event callbacks to create custom document fragments.

WOOOF!

### events

`:response`

- e.target -> the `anchor` or `form` element dispatching the :request event
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or `shadow root`
- e.sourceEvent -> the event responsible for an originating `:project` event
- response -> the unread response
- error -> any `error` thrown
