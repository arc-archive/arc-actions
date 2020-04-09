# ARC actions

An UI and logic for Advanced REST Client actions.

This module contains a set of web components and libraries responsible for the UI and execution of actions in the Advanced REST Client application.
An action is a runnable command that is executed, depending on the configuration, before or after a request. Actions can change data stored in ARC,
like variables or cookies, based on the data in request or response.

The module replaces:
-   request-actions-panel component
-   other ARC's local libraries in the application logic to process actions.

## Installation

```bash
npm i @advanced-rest-client/arc-actions
```

## Usage

The component has `requestActions` and `responseActions` properties that contains
request and response actions definitions respectively.

Each time a user change an editor value the `actionchange` event is dispatched from the panel. The event's detail contains `type` property that informs which array changed. Possible values are `request` and `response`.

Corresponding `onactionchange` setter is available.

```javascript
render() {
  const {
    requestActions = [],
    responseActions = [],
    compatibility,
    outlined,
  } = this;
  return html`
  <arc-actions
    .requestActions="${requestActions}"
    .responseActions="${responseActions}"
    ?compatibility="${compatibility}"
    ?outlined="${outlined}"
    @actionchange="${this._actionsChange}"
  ></arc-actions>`;
}

_actionsChange(e) {
  const { type } = e.detail;
  const { target } = e;
  const list = type === 'request' ? target.requestActions : target.responseActions;
  const key = type === 'request' ? 'requestActions' : 'responseActions';
  this[key] = list;
}
```

The view can be controlled by setting `selected` property which is 0-based index of the selected tab. When a user change the selection of the tab the `selectedchange` event is dispatched. Corresponding `onselectedchange` setter is available.
