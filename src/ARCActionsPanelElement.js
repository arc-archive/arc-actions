import { html, LitElement } from 'lit-element';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-menu-button/anypoint-menu-button.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
// import { ArcAction } from './ArcAction.js';
import { ActionCondition } from './ActionCondition.js';
import styles from './styles/ActionsPanel.styles.js';
import commonStyles from './styles/ActionPanels-common.style.js';
import '../arc-action-editor.js';
import '../arc-condition-editor.js';
import { allowedActions } from './Utils.js';
import {
  tutorialTpl,
  addActionTpl,
  addConditionTpl,
  actionsListTpl,
  actionTpl,
  introTextTpl,
  duplicateHandler,
  notifyChange,
  changeHandler,
  removeHandler,
  addHandler,
  openTutorialHandler,
} from './internals.js';

/** @typedef {import('./ArcAction.js').ArcAction} ArcAction */
/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('@anypoint-web-components/anypoint-listbox').AnypointListbox} AnypointListbox */
/** @typedef {import('@anypoint-web-components/anypoint-menu-button').AnypointMenuButton} AnypointMenuButton */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.Condition} Condition */

/**
 * Reads indexes of an action editor from the editor `data-*` attributes.
 * @param {Event} e
 * @return {number[]} First item is condition index and the second is the action index
 * inside the condition.
 */
const getActionIndexes = (e) => {
  const { target } = e;
  const data = /** @type DOMStringMap */ (/** @type {HTMLElement} */ (target).dataset);
  const cIndex = Number(data.conditionIndex);
  const aIndex = Number(data.actionIndex);
  if (Number.isNaN(cIndex) || Number.isNaN(aIndex)) {
    return [];
  }
  return [cIndex, aIndex];
}

export class ARCActionsPanelElement extends LitElement {
  static get styles() {
    return [styles, commonStyles];
  }

  static get properties() {
    return {
      /**
       * Enables compatibility with the Anypoint theme
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
   * @return {ActionCondition[]|null} Rendered list of actions
   */
  get actions() {
    return this._actions;
  }

  /**
   * @param {ActionCondition[]|null} value List of actions to render.
   */
  set actions(value) {
    const old = this._actions;
    const actions = ActionCondition.importExternal(value);
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
    this.actions = null;
    this.type = null;
    this.compatibility = false;
    this.outlined = false;
  }

  /**
   * Adds a new, empty request action to the list of actions.
   * If actions list hasn't been initialized then it creates it.
   *
   * @param {string} name The name of the action to add.
   * @param {number=} index For the response actions, index of the condition
   */
  add(name, index) {
    if (!Array.isArray(this.actions)) {
      this.actions = [];
    }
    if (this.type === 'request') {
      this._addRequestAction(name, index);
    } else {
      this._addResponseAction(name, index);
    }
    this.requestUpdate();
  }

  /**
   * Adds a new empty action to the request actions.
   * @param {string} name 
   * @param {number=} index For the response actions, index of the condition
   */
  _addRequestAction(name, index) {
    if (!this.actions.length) {
      const condition = ActionCondition.defaultCondition('request');
      const action = new ActionCondition({
        condition, 
        type: this.type,
        actions: [],
        enabled: true,
      });
      action.add(name);
      this.actions.push(action);
    } else {
      const action = this.actions[index];
      action.add(name);
    }
  }

  /**
   * Adds a new empty action to the response actions.
   * @param {string} name  The name of the action
   * @param {number} index The condition index to where to put the action into
   */
  _addResponseAction(name, index) {
    if (!this.actions.length) {
      const condition = ActionCondition.defaultCondition(this.type);
      condition.alwaysPass = false;
      const action = new ActionCondition({
        condition, 
        type: this.type,
        enabled: true,
        actions: [],
      });
      action.add(name);
      this.actions.push(action);
    } else {
      const action = this.actions[index];
      action.add(name);
    }
  }

  /**
   * Dispatches `open-external-url` event to open an URL.
   * If the event is not handled it returns a handler to a window opened
   * by calling `open()` function.
   *
   * @return {Window|null}
   */
  [openTutorialHandler]() {
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
  [addHandler](e) {
    const node = /** @type AnypointListbox */ (e.target);
    const menu = /** @type AnypointMenuButton */ (node.parentElement);
    const { selectedItem } = node;
    const index = Number(menu.dataset.index);
    if (!selectedItem || Number.isNaN(index)) {
      return;
    }
    const { name } = selectedItem.dataset;
    if (!name) {
      return;
    }
    this.add(name, index);
    this[notifyChange]();
  }

  /**
   * Handler for a click on "Delete action button".
   *
   * @param {CustomEvent} e
   */
  [removeHandler](e) {
    const [ci, ai] = getActionIndexes(e);
    if (ci === undefined || ai === undefined) {
      return;
    }
    const cItem = this.actions[ci];
    cItem.actions.splice(ai, 1);
    this.requestUpdate();
    this[notifyChange]();
  }

  _getEventAction(e) {
    const { target } = e;
    const data = /** @type DOMStringMap */ (/** @type {HTMLElement} */ (target).dataset);
    const cIndex = Number(data.conditionIndex);
    const aIndex = Number(data.actionIndex);
    if (Number.isNaN(cIndex) || Number.isNaN(aIndex)) {
      return null;
    }
    const cItem = this.actions[cIndex];
    return cItem.actions[aIndex];
  }

  /**
   * Handler for a change made in the editor.
   *
   * @param {CustomEvent} e
   */
  [changeHandler](e) {
    const [ci, ai] = getActionIndexes(e);
    if (ci === undefined || ai === undefined) {
      return;
    }
    const cItem = this.actions[ci];
    const item = cItem.actions[ai];
    const { prop = '' } = e.detail;
    if (prop.indexOf('.') === -1) {
      item[prop] = e.target[prop];
    } else {
      let tmp = item;
      let last = '';
      const parts = String(prop).split('.');
      parts.forEach((current, i, arr) => {
        if (arr.length === i + 1) {
          last = current;
          return;
        }
        if (!tmp[current]) {
          tmp[current] = {};
        }
        tmp = tmp[current];
      });
      tmp[last] = e.target[last];
    }
    this[notifyChange]();
  }

  [notifyChange]() {
    this.dispatchEvent(new CustomEvent('change'));
  }

  /**
   * A handler for the duplicate action event
   * @param {CustomEvent} e
   */
  [duplicateHandler](e) {
    const [ci, ai] = getActionIndexes(e);
    if (ci === undefined || ai === undefined) {
      return;
    }
    if (this.type === 'request') {
      this._duplicateRequestAction(ci);
    } else {
      this._duplicateResponseAction(ci, ai);
    }
    this[notifyChange]();
    this.requestUpdate();
  }

  /**
   * Duplicates a request condition and adds it to the conditions list
   * @param {number} conditionIndex The index of the condition object to copy
   */
  _duplicateRequestAction(conditionIndex) {
    const condition = this.actions[conditionIndex];
    const copy = condition.clone();
    this.actions.push(copy);
  }

  /**
   * Duplicates an action inside a response condition
   * @param {number} conditionIndex The index of the condition object that contains the action to copy
   * @param {number} actionIndex The action index to copy into the condition
   */
  _duplicateResponseAction(conditionIndex, actionIndex) {
    const condition = this.actions[conditionIndex];
    const source = condition.actions[actionIndex];
    const action = source.clone();
    condition.actions.push(action);
  }

  _addConditionHandler() {
    const condition = ActionCondition.defaultCondition(this.type);
    const actions = new ActionCondition({
      condition, 
      type: this.type,
      enabled: true,
      actions: [],
    });
    if (!Array.isArray(this.actions)) {
      this.actions = [];
    }
    this.actions.push(actions);
    this[notifyChange]();
    this.requestUpdate();
  }

  _conditionChangeHandler(e) {
    const { target } = e;
    const data = /** @type DOMStringMap */ (/** @type {HTMLElement} */ (target).dataset);
    const cIndex = Number(data.conditionIndex);
    if (Number.isNaN(cIndex)) {
      return;
    }
    const cAction = this.actions[cIndex];
    const { prop } = e.detail;
    cAction[prop] = target[prop];
    this[notifyChange]();
  }

  _conditionRemoveHandler(e) {
    const { target } = e;
    const data = /** @type DOMStringMap */ (/** @type {HTMLElement} */ (target).dataset);
    const cIndex = Number(data.conditionIndex);
    if (Number.isNaN(cIndex)) {
      return;
    }
    this.actions.splice(cIndex, 1);
    this[notifyChange]();
    this.requestUpdate();
  }

  render() {
    const { hasActions } = this;
    return html`
      ${this[tutorialTpl]()}
      ${hasActions ? this[actionsListTpl]() : ''}
      ${this[addConditionTpl]()}
    `;
  }

  /**
   * @return {TemplateResult} Template for the tutorial.
   */
  [tutorialTpl]() {
    const { compatibility } = this;
    return html`
    <div class="tutorial-section">
      <p class="content">
        ${this[introTextTpl]()}
      </p>
      <anypoint-button
        ?compatibility="${compatibility}"
        @click="${this[openTutorialHandler]}"
        class="self-center"
      >Learn more</anypoint-button>
    </div>
    `;
  }

  [introTextTpl]() {
    const { type } = this;
    let label;
    if (type === 'request') {
      label = `Request actions allows you to execute predefined logic before the request is executed.
      When an action fails then the request is not executed.`;
    } else if (type === 'response') {
      label = `Response actions allows you to execute predefined logic after the response is ready.
      Actions are grouped into response conditions. When the condition is meet actions in this group are executed.`;
    }
    return html`
      <p class="content">${label}</p>
    `;
  }

  /**
   * @param {number=} index An index of a condition to add the action to.
   * @return {TemplateResult} Template for the add action dropdown button
   */
  [addActionTpl](index) {
    const { compatibility } = this;
    return html`
      <div class="add-action-line">
        <anypoint-menu-button
          closeOnActivate
          data-index="${index}"
          ?compatibility="${compatibility}"
          @select="${this[addHandler]}"
        >
          <anypoint-button slot="dropdown-trigger" ?compatibility="${compatibility}">Add action</anypoint-button>
          <anypoint-listbox ?compatibility="${compatibility}" slot="dropdown-content">
            <anypoint-item data-name="set-variable" ?compatibility="${compatibility}">Set variable</anypoint-item>
            <anypoint-item data-name="set-cookie" ?compatibility="${compatibility}">Set cookie</anypoint-item>
            <anypoint-item data-name="delete-cookie" ?compatibility="${compatibility}">Delete cookie</anypoint-item>
          </anypoint-listbox>
        </anypoint-menu-button>
      </div>
    `;
  }

  [addConditionTpl]() {
    const { compatibility } = this;
    return html`
    <anypoint-button
      ?compatibility="${compatibility}"
      @click="${this._addConditionHandler}"
    >Add condition</anypoint-button>
    `;
  }

  /**
   * @return {TemplateResult[]} List of templates for current actions.
   */
  [actionsListTpl]() {
    const { actions } = this;
    const result = actions.map((action, index) => this._actionsItemTemplate(action, index));
    return /** @type TemplateResult[] */ (result);
  }

  /**
   * @param {ActionCondition} conditionAction
   * @param {number} index
   * @return {TemplateResult|TemplateResult[]|string[]}
   */
  _actionsItemTemplate(conditionAction, index) {
    const { actions } = conditionAction;
    return html`
    <div class="condition-wrapper">
      ${this._conditionTemplate(conditionAction, index)}
      ${actions.map((action, i) => this[actionTpl](action, index, i))}
      ${this[addActionTpl](index)}
    </div>
    `;
  }

  /**
   * @param {ActionCondition} conditionAction The definition of the condition
   * @param {number} conditionIndex Condition action's index in the `actions` array.
   * @return {TemplateResult} Template for the condition
   */
  _conditionTemplate(conditionAction, conditionIndex) {
    const { enabled, condition } = conditionAction;
    const { outlined, compatibility, type } = this;
    return html`
      <arc-condition-editor
        .condition="${condition}"
        .type="${type}"
        ?enabled="${enabled}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        data-condition-index="${conditionIndex}"
        @change="${this._conditionChangeHandler}"
        @remove="${this._conditionRemoveHandler}"
      ></arc-condition-editor>
    `;
  }

  /**
   * @param {ArcAction} action An action definition
   * @param {number} conditionIndex Condition action's index in the `actions` array.
   * @param {number} actionIndex Action index in the condition
   * @return {string|TemplateResult} Template for an action
   */
  [actionTpl](action, conditionIndex, actionIndex) {
    const { name, type, enabled, priority, config, sync, failOnError, view = {} } = action;
    if (allowedActions.indexOf(name) === -1) {
      return '';
    }
    const { outlined, compatibility } = this;
    return html`
      <arc-action-editor
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
        data-condition-index="${conditionIndex}"
        data-action-index="${actionIndex}"
        @remove="${this[removeHandler]}"
        @change="${this[changeHandler]}"
        @duplicate="${this[duplicateHandler]}"
      ></arc-action-editor>
    `;
  }
}
