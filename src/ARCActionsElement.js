/* eslint-disable class-methods-use-this */
import { html, css, LitElement } from 'lit-element';
import '@anypoint-web-components/anypoint-tabs/anypoint-tabs.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tab.js';
import '../arc-actions-panel.js';
import {
  tabHandler,
  actionsHandler,
  notifyChange,
  tabsTpl,
  requestActionsTpl,
  responseActionsTpl,
  panelTpl,
} from './internals.js';

export const conditionChangeEvent = 'change';
export const selectedChangeEvent = 'selectedchange';
export const requestConditionsValue = Symbol('requestConditionsValue');
export const responseConditionsValue = Symbol('responseConditionsValue');
export const tutorialTemplate = Symbol('tutorialTemplate');
export const onChangeValue = Symbol('onChangeValue');
export const onSelectedValue = Symbol('onSelectedValue');

/** @typedef {import('./ArcAction').ArcAction} ArcAction */
/** @typedef {import('./ActionCondition').ActionCondition} ActionCondition */
/** @typedef {import('./ARCActionsPanelElement').ARCActionsPanelElement} ARCActionsPanelElement */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.OperatorEnum} OperatorEnum */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/**
 * An HTML element that renders a panel with request and response
 * actions.
 */
export class ARCActionsElement extends LitElement {
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
       * Enables compatibility with the Anypoint theme
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
   * A list of request conditions and actions.
   * @return {ActionCondition[]}
   */
  get request() {
    return this[requestConditionsValue];
  }

  /**
   * @param {ActionCondition[]} value List of request actions to render.
   */
  set request(value) {
    const old = this[requestConditionsValue];
    if (old === value) {
      return;
    }
    this[requestConditionsValue] = value;
    this.requestUpdate();
  }

  /**
   * A list of response conditions and actions.
   * @return {ActionCondition[]}
   */
  get response() {
    return this[responseConditionsValue];
  }

  /**
   * @param {ActionCondition[]} value List of request actions to render.
   */
  set response(value) {
    const old = this[responseConditionsValue];
    if (old === value) {
      return;
    }
    this[responseConditionsValue] = value;
    this.requestUpdate();
  }

  get onchange() {
    return this[onChangeValue];
  }

  set onchange(value) {
    const old = this[onChangeValue];
    this[onChangeValue] = null;
    if (old) {
      this.removeEventListener(conditionChangeEvent, old);
    }
    if (typeof value !== 'function') {
      return;
    }
    this[onChangeValue] = value;
    this.addEventListener(conditionChangeEvent, value);
  }

  get onselectedchange() {
    return this[onSelectedValue];
  }

  set onselectedchange(value) {
    const old = this[onSelectedValue];
    this[onSelectedValue] = null;
    if (old) {
      this.removeEventListener(selectedChangeEvent, old);
    }
    if (typeof value !== 'function') {
      return;
    }
    this[onSelectedValue] = value;
    this.addEventListener(selectedChangeEvent, value);
  }

  constructor() {
    super();
    this.selected = 0;
    this.compatibility = false;
    this.outlined = false;
    /**
     * @type {ActionCondition[]}
     */
    this[requestConditionsValue] = null;
    /**
     * @type {ActionCondition[]}
     */
    this[responseConditionsValue] = null;
  }

  /**
   * @param {CustomEvent} e 
   */
  [tabHandler](e) {
    this.selected = e.detail.value;
    this.dispatchEvent(new Event(selectedChangeEvent));
  }

  /**
   * @param {Event} e 
   */
  [actionsHandler](e) {
    const panel = /** @type ARCActionsPanelElement */ (e.target);
    const { conditions, type } = panel;
    this[type] = conditions;
    this[notifyChange](type);
  }

  /**
   * @param {string} type 
   */
  [notifyChange](type) {
    this.dispatchEvent(
      new CustomEvent(conditionChangeEvent, {
        detail: {
          type
        }
      })
    );
  }

  render() {
    return html`
      ${this[tutorialTemplate]()}
      ${this[tabsTpl]()}
      ${this[requestActionsTpl]()}
      ${this[responseActionsTpl]()}
    `;
  }

  /**
   * @return {TemplateResult} Template for the tutorial
   */
  [tutorialTemplate]() {
    return html`
      <p class="actions-intro">
        Actions run a custom logic in a context of the current request. When they fail the request is reported as error.
      </p>
    `;
  }

  /**
   * @returns {TemplateResult}  The template for the context tabs
   */
  [tabsTpl]() {
    const { selected, compatibility } = this;
    return html`
      <anypoint-tabs
        .selected="${selected}"
        ?compatibility="${compatibility}"
        @selected-changed="${this[tabHandler]}"
      >
        <anypoint-tab ?compatibility="${compatibility}">Request actions</anypoint-tab>
        <anypoint-tab ?compatibility="${compatibility}">Response actions</anypoint-tab>
      </anypoint-tabs>
    `;
  }

  /**
   * @returns {TemplateResult|string}  The template for the request actions panel
   */
  [requestActionsTpl]() {
    if (this.selected !== 0) {
      return '';
    }
    return this[panelTpl](this.request, 'request');
  }

  /**
   * @returns {TemplateResult|string}  The template for the response actions panel
   */
  [responseActionsTpl]() {
    if (this.selected !== 1) {
      return '';
    }
    return this[panelTpl](this.response, 'response');
  }

  /**
   * @param {ActionCondition[]} conditions The list of conditions to render.
   * @param {string} type The type of the UI.
   * @returns {TemplateResult}  The template for the actions panel
   */
  [panelTpl](conditions, type) {
    const { compatibility, outlined } = this;
    return html`
      <arc-actions-panel
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
        type="${type}"
        @change="${this[actionsHandler]}"
        .conditions="${conditions}"
      ></arc-actions-panel>
    `;
  }
}
