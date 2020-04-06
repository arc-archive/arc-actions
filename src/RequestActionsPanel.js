import { html, LitElement } from 'lit-element';
import '@anypoint-web-components/anypoint-button';
import '@anypoint-web-components/anypoint-menu-button/anypoint-menu-button.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import { ArcAction } from './ArcAction.js';
import styles from './RequestActionsPanel.styles.js';
import commonStyles from './ActionPanels-common.style.js';
import '../action-editor.js';

const tutorialTplSymbol = Symbol();
const addAcrionTplSymbol = Symbol();
const actionsListTplSymbol = Symbol();
const actionTplSymbol = Symbol();

/**
 * A list of actions names that are supported by this element.
 * @type {Array<String>}
 */
export const allowedActions = [
  'set-variable',
  'set-cookie',
  'delete-cookie',
  'run-request',
];

export class RequestActionsPanel extends LitElement {
  static get styles() {
    return [
      styles,
      commonStyles,
    ];
  }

  static get properties() {
    return {
      /**
       * A list of actions
       */
      actions: { type: Array },
      /**
       * Enables compatybility with the Anypoint theme
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * Enables outlined MD theme
       */
      outlined: { type: Boolean, reflect: true },
    };
  }

  get actions() {
    return this._actions;
  }

  set actions(value) {
    const old = this._actions;
    const actions = this._mapActions(value);
    if (old === actions) {
      return;
    }
    this._actions = actions;
    this.requestUpdate('actions', actions);
  }

  /**
   * @return {Boolean} Returns true when the element has any action.
   */
  get hasActions() {
    const { actions } = this;
    return !!(actions && actions.length);
  }

  constructor() {
    super();
    /**
     * @type {Array<Object>}
     */
    this.actions = null;
    this.compatibility = false;
    this.outlined = false;
  }

  _mapActions(value) {
    if (!Array.isArray(value)) {
      return null;
    }
    return value.map((item) => {
      if (!(item instanceof ArcAction)) {
        item = new ArcAction(item);
      }
      return item;
    });
  }

  /**
   * Adds a new, empty request action to the list of actions.
   * If actions list hasn't been initialized then it creates it.
   *
   * @param {String} name The name of the action to add.
   */
  add(name) {
    if (!Array.isArray(this.actions)) {
      this.actions = [];
    }
    const action = new ArcAction({ name });
    this.actions.push(action);
    this.requestUpdate();
  }

  /**
   * Dispatches `open-external-url` event to open an URL.
   * If the event is not handled it returns a handler to a window opened
   * by calling `open()` function.
   *
   * @return {window|null}
   */
  _openTutorialHandler() {
    const url = 'https://docs.advancedrestclient.com/using-arc/request-actions';
    const e = new CustomEvent('open-external-url', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        url
      }
    });
    this.dispatchEvent(e);
    if (e.defaultPrevented) {
      return null;
    }
    return window.open(url);
  }

  /**
   * Handler for a click on "Add action button".
   *
   * @param {CustomEvent} e
   */
  _addHandler(e) {
    const { selectedItem } = e.target;
    if (!selectedItem) {
      return;
    }
    const { name } = selectedItem.dataset;
    if (!name) {
      return;
    }
    this.add(name);
    this._notifyChange();
  }

  _removeHandler(e) {
    const index = Number(e.target.dataset.index);
    if (isNaN(index)) {
      return;
    }
    this.actions.splice(index, 1);
    this.requestUpdate();
    this._notifyChange();
  }

  _changeHandler(e) {
    const index = Number(e.target.dataset.index);
    if (isNaN(index)) {
      return;
    }
    const item = this.actions[index];
    const { prop='' } = e.detail;
    if (prop.indexOf('.') === -1) {
      item[prop] = e.target[prop];
    } else {
      let tmp = item;
      let last = '';
      String(prop).split('.').forEach((item, index, arr) => {
        if (arr.length === index + 1) {
          last = item;
          return;
        }
        if (!tmp[item]) {
          tmp[item] = {};
        }
        tmp = tmp[item];
      });
      tmp[last] = e.target[last];
    }
    this._notifyChange();
  }

  _notifyChange() {
    this.dispatchEvent(new CustomEvent('change'));
  }

  _duplicateHandler(e) {
    const index = Number(e.target.dataset.index);
    if (isNaN(index)) {
      return;
    }
    let item = this.actions[index];
    if (!(item instanceof ArcAction)) {
      item = new ArcAction(item);
    }
    const action = item.clone();
    this.actions.push(action);
    this.requestUpdate();
  }

  render() {
    const { hasActions } = this;
    return html`
      ${this[tutorialTplSymbol]()}
      ${hasActions ? this[actionsListTplSymbol]() : ''}
    `;
  }

  /**
   * @return {Object} Template for the tutorial.
   */
  [tutorialTplSymbol]() {
    const { compatibility } = this;
    return html`
    <div class="tutorial-section">
      <p class="content">
        Request actions allow to execute some predefined logic before the request is executed.
        When an action fails then the request is not executed.
      </p>
      <anypoint-button
        ?compatibility="${compatibility}"
        @click="${this._openTutorialHandler}"
      >Learn more</anypoint-button>
    </div>
    ${this[addAcrionTplSymbol]()}
    `;
  }

  /**
   * @return {Object} Template for the add action dropdown button
   */
  [addAcrionTplSymbol]() {
    const { outlined, compatibility } = this;
    return html`
    <div class="add-action-line">
      <anypoint-menu-button
        closeOnActivate
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        @select="${this._addHandler}"
      >
        <anypoint-button
          slot="dropdown-trigger"
          ?compatibility="${compatibility}"
        >Add action</anypoint-button>
        <anypoint-listbox
          ?outlined="${outlined}"
          ?compatibility="${compatibility}"
          slot="dropdown-content"
        >
          <anypoint-item data-name="set-variable" ?compatibility="${compatibility}">Set variable</anypoint-item>
          <anypoint-item data-name="set-cookie" ?compatibility="${compatibility}">Set cookie</anypoint-item>
          <anypoint-item data-name="delete-cookie" ?compatibility="${compatibility}">Delete cookie</anypoint-item>
          <anypoint-item data-name="run-request" ?compatibility="${compatibility}">Run request</anypoint-item>
        </anypoint-listbox>
      </anypoint-menu-button>
    </div>
    `;
  }

  /**
   * @return {Array<Object|String>} List of templates for current actions.
   */
  [actionsListTplSymbol]() {
    const { actions } = this;
    return actions.map((action, index) => this[actionTplSymbol](action, index));
  }

  /**
   * @param {Object} action An action definition
   * @param {Number} index Action's index in the `actions` array.
   * @return {String|Object} Template for an action
   */
  [actionTplSymbol](action, index) {
    const { name, type, enabled, priority, config, sync, silent, view={} } = action;
    if (allowedActions.indexOf(name) === -1) {
      return '';
    }
    const { outlined, compatibility } = this;
    return html`
    <action-editor
      name="${name}"
      type="${type}"
      ?enabled="${enabled}"
      priority="${priority}"
      .config="${config}"
      ?sync="${sync}"
      ?silent="${silent}"
      ?opened="${view.opened}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      data-index="${index}"
      @remove="${this._removeHandler}"
      @change="${this._changeHandler}"
      @duplicate="${this._duplicateHandler}"
    ></action-editor>`;
  }
}
