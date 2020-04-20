import { html, LitElement } from 'lit-element';
import '@anypoint-web-components/anypoint-button';
import '@anypoint-web-components/anypoint-menu-button/anypoint-menu-button.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import { ArcAction } from './ArcAction.js';
import styles from './ActionsPanel.styles.js';
import commonStyles from './ActionPanels-common.style.js';
import '../action-editor.js';
import { mapActions, allowedActions } from './Utils.js';

const tutorialTplSymbol = Symbol();
const addAcrionTplSymbol = Symbol();
const actionsListTplSymbol = Symbol();
const actionTplSymbol = Symbol();
const introTextTplSymbol = Symbol();
const duplicateHandlerSymbol = Symbol();
const notifyChangeSymbol = Symbol();
const changeHandlerSymbol = Symbol();
const removeHandlerSymbol = Symbol();
const addHandlerSymbol = Symbol();
const openTutorialHandlerSymbol = Symbol();

/** @typedef {import('./ArcAction.js').ArcAction} ArcAction */
/** @typedef {import('./ArcActions.js').ArcResponseActions} ArcResponseActions */

export class ActionsPanel extends LitElement {
  static get styles() {
    return [styles, commonStyles];
  }

  static get properties() {
    return {
      /**
       * Enables compatybility with the Anypoint theme
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * Enables outlined MD theme
       */
      outlined: { type: Boolean, reflect: true },
      /**
       * A type of actions this panel renders. The actions are using
       * type defined in the action definition. This property is used by the tutorial.
       */
      type: { type: String, reflect: true }
    };
  }

  /**
   * @return {Array<ArcResponseActions|ArcAction>|null} Rendered list of actions
   */
  get actions() {
    return this._actions;
  }

  /**
   * @param {Array<ArcResponseActions|ArcAction>|null} value List of actions to render.
   */
  set actions(value) {
    const old = this._actions;
    const actions = mapActions(value);
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

  /**
   * @return {Boolean} Determines whether the actions are part of the conditions.
   */
  get hasConditions() {
    const { type } = this;
    return type === 'response';
  }

  constructor() {
    super();
    this.actions = null;
    this.type = null;
    this.compatibility = false;
    this.outlined = false;
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
  [openTutorialHandlerSymbol]() {
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
  [addHandlerSymbol](e) {
    const target = /** @type {HTMLElement} */ (e.target);
    // @ts-ignore
    const { selectedItem } = target;
    if (!selectedItem) {
      return;
    }
    const { name } = selectedItem.dataset;
    if (!name) {
      return;
    }
    this.add(name);
    this[notifyChangeSymbol]();
  }

  /**
   * Handler for a click on "Delete action button".
   *
   * @param {CustomEvent} e
   */
  [removeHandlerSymbol](e) {
    const target = /** @type {HTMLElement} */ (e.target);
    const index = Number(target.dataset.index);
    if (isNaN(index)) {
      return;
    }
    this.actions.splice(index, 1);
    this.requestUpdate();
    this[notifyChangeSymbol]();
  }

  /**
   * Handler for a change made in the editor.
   *
   * @param {CustomEvent} e
   */
  [changeHandlerSymbol](e) {
    const target = /** @type {HTMLElement} */ (e.target);
    const index = Number(target.dataset.index);
    if (isNaN(index)) {
      return;
    }
    const item = this.actions[index];
    const { prop = '' } = e.detail;
    if (prop.indexOf('.') === -1) {
      item[prop] = target[prop];
    } else {
      let tmp = item;
      let last = '';
      String(prop)
        .split('.')
        .forEach((item, index, arr) => {
          if (arr.length === index + 1) {
            last = item;
            return;
          }
          if (!tmp[item]) {
            tmp[item] = {};
          }
          tmp = tmp[item];
        });
      tmp[last] = target[last];
    }
    this[notifyChangeSymbol]();
  }

  [notifyChangeSymbol]() {
    this.dispatchEvent(new CustomEvent('change'));
  }

  [duplicateHandlerSymbol](e) {
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
      ${this[tutorialTplSymbol]()} ${hasActions ? this[actionsListTplSymbol]() : ''}
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
          ${this[introTextTplSymbol]()}
        </p>
        <anypoint-button
          ?compatibility="${compatibility}"
          @click="${this[openTutorialHandlerSymbol]}"
          class="self-center"
          >Learn more</anypoint-button
        >
      </div>
      ${this[addAcrionTplSymbol]()}
    `;
  }

  [introTextTplSymbol]() {
    const { type } = this;
    let label;
    if (type === 'request') {
      label = `Request actions allow to execute some predefined logic before the request is executed.
      When an action fails then the request is not executed.`;
    } else if (type === 'response') {
      label = `Response actions allow to execute some predefined logic after the response is ready.
      When an action fails then the request is reported as an error.`;
    }
    return html`
      <p class="content">${label}</p>
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
          @select="${this[addHandlerSymbol]}"
        >
          <anypoint-button slot="dropdown-trigger" ?compatibility="${compatibility}">Add action</anypoint-button>
          <anypoint-listbox ?outlined="${outlined}" ?compatibility="${compatibility}" slot="dropdown-content">
            <anypoint-item data-name="set-variable" ?compatibility="${compatibility}">Set variable</anypoint-item>
            <anypoint-item data-name="set-cookie" ?compatibility="${compatibility}">Set cookie</anypoint-item>
            <anypoint-item data-name="delete-cookie" ?compatibility="${compatibility}">Delete cookie</anypoint-item>
          </anypoint-listbox>
        </anypoint-menu-button>
      </div>
    `;
  }

  /**
   * @return {Array<Object|String>} List of templates for current actions.
   */
  [actionsListTplSymbol]() {
    const { actions, hasConditions } = this;
    return actions.map((action, index) => this[actionTplSymbol](hasConditions, action, index));
  }

  /**
   * @param {boolean} hasCondition
   * @param {Object} action An action definition
   * @param {Number} index Action's index in the `actions` array.
   * @return {String|Object} Template for an action
   */
  [actionTplSymbol](hasCondition, action, index) {
    const { name, type, enabled, priority, config, sync, failOnError, view = {} } = action;
    if (allowedActions.indexOf(name) === -1) {
      return '';
    }
    // TODO: render conditions for response actions.
    const { outlined, compatibility } = this;
    return html`
      <action-editor
        name="${name}"
        type="${type}"
        ?enabled="${enabled}"
        priority="${priority}"
        .config="${config}"
        ?sync="${sync}"
        ?failOnError="${failOnError}"
        ?opened="${view.opened}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        data-index="${index}"
        @remove="${this[removeHandlerSymbol]}"
        @change="${this[changeHandlerSymbol]}"
        @duplicate="${this[duplicateHandlerSymbol]}"
      ></action-editor>
    `;
  }
}
