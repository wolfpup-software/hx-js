# Actions

Actions are the value of an event attribute that loos like this: `_event_`.

## Syntax

Hx can listen for events like `click` and `keydown`.

```html
<button _click_="increment_count">+1</button>

<a _click_="decrement_count">+1</a>

<form _submit_="update_form">
	<input />
	<input type="submit" />
</form>
```
