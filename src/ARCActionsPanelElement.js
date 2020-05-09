import { html, LitElement } from 'lit-element';
import '@anypoint-web-components/anypoint-button';
import '@anypoint-web-components/anypoint-menu-button/anypoint-menu-button.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import { ArcAction } from './ArcAction.js';
import { ArcActions } from './ArcActions.js';
import styles from './ActionsPanel.styles.js';
import commonStyles from './ActionPanels-common.style.js';
import '../arc-action-editor.js';
import '../arc-condition-editor.js';
import { allowedActions } from './Utils.js';

const tutorialTplSymbol = Symbol('tutorialTplSymbol');
const addAcrionTplSymbol = Symbol('addAcrionTplSymbol');
const addConditionTplSymbol = Symbol('addConditionTplSymbol');
const actionsListTplSymbol = Symbol('actionsListTplSymbol');
const actionTplSymbol = Symbol('actionTplSymbol');
const introTextTplSymbol = Symbol('introTextTplSymbol');
const duplicateHandlerSymbol = Symbol('duplicateHandlerSymbol');
const notifyChangeSymbol = Symbol('notifyChangeSymbol');
const changeHandlerSymbol = Symbol('changeHandlerSymbol');
const removeHandlerSymbol = Symbol('removeHandlerSymbol');
const addHandlerSymbol = Symbol('addHandlerSymbol');
const openTutorialHandlerSymbol = Symbol('openTutorialHandlerSymbol');

/** @typedef {import('./ArcAction.js').ArcAction} ArcAction */
/** @typedef {import('./ArcActions').ArcActions} ArcActions */
/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('./types').ActionsCondition} ActionsCondition */

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
   * @return {Array<ArcActions>|null} Rendered list of actions
   */
  get actions() {
    return this._actions;
  }

  /**
   * @param {Array<ArcActions>|null} value List of actions to render.
   */
  set actions(value) {
    const old = this._actions;
    const actions = ArcActions.importExternal(value);
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
    if (this.type === 'request') {
      this._addRequestAction(name);
    }
    this.requestUpdate();
  }

  _addRequestAction(name) {
    if (this.actions.length) {
      this.actions[0].add(name);
    } else {
      const cond = ArcActions.defaultCondition('request');
      const action = new ArcActions(cond, this.type);
      action.add(name);
      this.actions.push(action);
    }
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
    const { target } = e;
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
    const [ci, ai] = getActionIndexes(e);
    if (ci === undefined || ai === undefined) {
      return;
    }
    const citem = this.actions[ci];
    citem.actions.splice(ai, 1);
    this.requestUpdate();
    this[notifyChangeSymbol]();
  }

  _getEventAction(e) {
    const { target } = e;
    const data = /** @type DOMStringMap */ (/** @type {HTMLElement} */ (target).dataset);
    const cIndex = Number(data.conditionIndex);
    const aIndex = Number(data.actionIndex);
    if (Number.isNaN(cIndex) || Number.isNaN(aIndex)) {
      return null;
    }
    const citem = this.actions[cIndex];
    return citem.actions[aIndex];
  }

  /**
   * Handler for a change made in the editor.
   *
   * @param {CustomEvent} e
   */
  [changeHandlerSymbol](e) {
    const [ci, ai] = getActionIndexes(e);
    if (ci === undefined || ai === undefined) {
      return;
    }
    const citem = this.actions[ci];
    const item = citem.actions[ai];
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
    this[notifyChangeSymbol]();
  }

  [notifyChangeSymbol]() {
    this.dispatchEvent(new CustomEvent('change'));
  }

  /**
   * A handler for the duplicate action event
   * @param {CustomEvent} e
   */
  [duplicateHandlerSymbol](e) {
    const [ci, ai] = getActionIndexes(e);
    if (ci === undefined || ai === undefined) {
      return;
    }
    const citem = this.actions[ci];
    let item = citem.actions[ai];
    if (!(item instanceof ArcAction)) {
      item = new ArcAction(item);
    }
    const action = item.clone();
    citem.actions.push(action);
    this[notifyChangeSymbol]();
    this.requestUpdate();
  }

  _addConditionHandler() {
    const cond = ArcActions.defaultCondition();
    const actions = new ArcActions(cond, this.type);
    if (!Array.isArray(this.actions)) {
      this.actions = [];
    }
    this.actions.push(actions);
    this[notifyChangeSymbol]();
    this.requestUpdate();
  }

  _conditionChangeHandler(e) {
    const { target } = e;
    const data = /** @type DOMStringMap */ (/** @type {HTMLElement} */ (target).dataset);
    const cIndex = Number(data.conditionIndex);
    if (Number.isNaN(cIndex)) {
      return;
    }
    const caction = this.actions[cIndex];
    const { prop } = e.detail;
    caction[prop] = target[prop];
    this[notifyChangeSymbol]();
  }

  _conditionRemoveHandler(e) {
    const { target } = e;
    const data = /** @type DOMStringMap */ (/** @type {HTMLElement} */ (target).dataset);
    const cIndex = Number(data.conditionIndex);
    if (Number.isNaN(cIndex)) {
      return;
    }
    this.actions.splice(cIndex, 1);
    this[notifyChangeSymbol]();
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
   * @return {TemplateResult} Template for the tutorial.
   */
  [tutorialTplSymbol]() {
    const { compatibility, hasConditions } = this;
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
      ${hasConditions ? this[addConditionTplSymbol]() : this[addAcrionTplSymbol]()}
    `;
  }

  [introTextTplSymbol]() {
    const { type } = this;
    let label;
    if (type === 'request') {
      label = `Request actions allow to execute predefined logic before the request is executed.
      When an action fails then the request is not executed.`;
    } else if (type === 'response') {
      label = `Response actions allow to execute predefined logic after the response is ready.
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
  [addAcrionTplSymbol](index) {
    const { outlined, compatibility } = this;
    return html`
      <div class="add-action-line">
        <anypoint-menu-button
          closeOnActivate
          ?data-index="${index}"
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

  [addConditionTplSymbol]() {
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
  [actionsListTplSymbol]() {
    const { actions } = this;
    const result = actions.map((action, index) => this._actionsItemTemplate(action, index));
    return /** @type TemplateResult[] */ (result);
  }

  /**
   * @param {ArcActions} conditionAction
   * @param {number} index
   * @return {TemplateResult|TemplateResult[]|string[]}
   */
  _actionsItemTemplate(conditionAction, index) {
    const hasCondition = this.type === 'response';
    if (!hasCondition) {
      return this._conditionLessActionsTemplate(conditionAction, index);
    }
    const { actions, condition } = conditionAction;
    const { view = {} } = condition;
    const { opened } = view;
    return html`
    ${this._conditionTemplate(conditionAction, index)}
    ${opened ? '' : actions.map((action, i) => this[actionTplSymbol](action, index, i))}
    ${opened ? '' : this[addAcrionTplSymbol](index)}
    `;
  }

  /**
   * @param {ArcActions} conditionAction
   * @param {number} index
   * @return {string[]|TemplateResult[]}
   */
  _conditionLessActionsTemplate(conditionAction, index) {
    const { actions } = conditionAction;
    const result = actions.map((action, i) => this[actionTplSymbol](action, index, i));
    return /** @type TemplateResult[] */ (result);
  }

  /**
   * @param {ArcActions} conditionAction The definition of the condition
   * @param {number} conditionIndex Condition action's index in the `actions` array.
   * @return {TemplateResult} Template for the condition
   */
  _conditionTemplate(conditionAction, conditionIndex) {
    const { enabled, condition } = conditionAction;
    const { outlined, compatibility } = this;
    return html`
      <arc-condition-editor
        .condition="${condition}"
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
  [actionTplSymbol](action, conditionIndex, actionIndex) {
    const { name, type, enabled, priority, config, sync, failOnError, view = {} } = action;
    if (allowedActions.indexOf(name) === -1) {
      return '';
    }
    // TODO: render conditions for response actions.
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
        @remove="${this[removeHandlerSymbol]}"
        @change="${this[changeHandlerSymbol]}"
        @duplicate="${this[duplicateHandlerSymbol]}"
      ></arc-action-editor>
    `;
  }
}
