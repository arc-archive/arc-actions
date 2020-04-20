import { html, css, LitElement } from 'lit-element';
import '@anypoint-web-components/anypoint-tabs/anypoint-tabs.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tab.js';
import '../actions-panel.js';

const actionChangeEvent = 'actionchange';
const selectedChangeEvent = 'selectedchange';

const tabHandlerSymbol = Symbol();
const actionsHandlerSymbol = Symbol();
const notifyChangeSymbol = Symbol();
const tutorialTplSymbol = Symbol();
const tabsTplSymbol = Symbol();
const reqestActionsTplSymbol = Symbol();
const responseActionsTplSymbol = Symbol();
const panelTplSymbol = Symbol();

/** @typedef {import('./ArcAction.js').ArcAction} ArcAction */
/** @typedef {import('./ActionEditor.js').OperatorEnum} OperatorEnum */

/**
 * @typedef {string} ConditionSourceEnum
 * @property {string} url "url"
 * @property {string} statuscode "statuscode"
 * @property {string} headers "headers"
 * @property {string} body "body"
 */

/**
 * @typedef {Object} ResponseCondition
 * @param {ConditionSourceEnum} source Path to the data source value.
 * @param {string=} path Optional path to the data. It is required for url, headers, and body.
 * @param {string|number} value The value to compare to the value.
 * @param {OperatorEnum} operator The condition operator.
 */

/**
 * @typedef {Object} ArcResponseActions
 * @property {ResponseCondition} condition A response condition
 * @property {Array<ArcAction>} actions List of actions to run in the condition.
 * @property {boolean} enabled Whether the conditions and the actions are enabled.
 */

export class ArcActions extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * A list of response actions
       */
      responseActions: { type: Array },
      /**
       * Enables compatybility with the Anypoint theme
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * Enables outlined MD theme
       */
      outlined: { type: Boolean, reflect: true },
      /**
       * Currently selected tab.
       */
      selected: { type: Number, reflect: true }
    };
  }
  /**
   * A list of request actions.
   * @return {Array<ArcAction>}
   */
  get requestActions() {
    return this._requestActions;
  }

  /**
   * @param {Array<ArcAction>} value List of request actions to render.
   */
  set requestActions(value) {
    const old = this._requestActions;
    if (old === value) {
      return;
    }
    this._requestActions = value;
    this.requestUpdate();
  }

  /**
   * A list of request actions.
   * @return {Array<ArcResponseActions>}
   */
  get responseActions() {
    return this._responseActions;
  }

  /**
   * @param {Array<ArcResponseActions>} value List of request actions to render.
   */
  set responseActions(value) {
    const old = this._responseActions;
    if (old === value) {
      return;
    }
    this._responseActions = value;
    this.requestUpdate();
  }

  get onactionchange() {
    return this._onactionchange;
  }

  set onactionchange(value) {
    const old = this._onactionchange;
    this._onactionchange = null;
    if (old) {
      this.removeEventListener(actionChangeEvent, old);
    }
    if (typeof value !== 'function') {
      return;
    }
    this._onactionchange = value;
    this.addEventListener(actionChangeEvent, value);
  }

  get onselectedchange() {
    return this._onselectedchange;
  }

  set onselectedchange(value) {
    const old = this._onselectedchange;
    this._onselectedchange = null;
    if (old) {
      this.removeEventListener(selectedChangeEvent, old);
    }
    if (typeof value !== 'function') {
      return;
    }
    this._onselectedchange = value;
    this.addEventListener(selectedChangeEvent, value);
  }

  constructor() {
    super();
    this.selected = 0;
    this.compatibility = false;
    this.outlined = false;
    this._requestActions = null;
    this._responseActions = null;
  }

  [tabHandlerSymbol](e) {
    this.selected = e.detail.value;
    this.dispatchEvent(new CustomEvent(selectedChangeEvent));
  }

  [actionsHandlerSymbol](e) {
    const { actions, type } = e.target;
    const key = type === 'request' ? 'requestActions' : 'responseActions';
    this[key] = actions;
    this[notifyChangeSymbol](type);
  }

  [notifyChangeSymbol](type) {
    this.dispatchEvent(
      new CustomEvent(actionChangeEvent, {
        detail: {
          type
        }
      })
    );
  }

  render() {
    return html`
      ${this[tutorialTplSymbol]()} ${this[tabsTplSymbol]()} ${this[reqestActionsTplSymbol]()}
      ${this[responseActionsTplSymbol]()}
    `;
  }

  [tutorialTplSymbol]() {
    return html`
      <p class="actions-intro">
        Actions runs a logic related to the current request. When they fail the request is reported as errored.
      </p>
    `;
  }

  [tabsTplSymbol]() {
    const { selected, compatibility } = this;
    return html`
      <anypoint-tabs
        .selected="${selected}"
        ?compatibility="${compatibility}"
        @selected-changed="${this[tabHandlerSymbol]}"
      >
        <anypoint-tab ?compatibility="${compatibility}">Request actions</anypoint-tab>
        <anypoint-tab ?compatibility="${compatibility}">Response actions</anypoint-tab>
      </anypoint-tabs>
    `;
  }

  [reqestActionsTplSymbol]() {
    if (this.selected !== 0) {
      return '';
    }
    return this[panelTplSymbol](this.requestActions, 'request');
  }

  [responseActionsTplSymbol]() {
    if (this.selected !== 1) {
      return '';
    }
    return this[panelTplSymbol](this.responseActions, 'response');
  }

  [panelTplSymbol](actions, type) {
    const { compatibility, outlined } = this;
    return html`
      <actions-panel
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
        type="${type}"
        @change="${this[actionsHandlerSymbol]}"
        .actions="${actions}"
      ></actions-panel>
    `;
  }
}
