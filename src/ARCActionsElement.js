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

const actionChangeEvent = 'actionchange';
const selectedChangeEvent = 'selectedchange';

/** @typedef {import('./ArcAction').ArcAction} ArcAction */
/** @typedef {import('./ActionCondition').ActionCondition} ActionCondition */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.OperatorEnum} OperatorEnum */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/**
 * @return {TemplateResult} Template for the tutorial
 */
const tutorialTemplate = () => {
  return html`
    <p class="actions-intro">
      Actions run a custom logic in a context of the current request. When they fail the request is reported as error.
    </p>
  `;
}

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
       * A list of response actions
       */
      responseActions: { type: Array },
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
   * A list of request actions.
   * @return {ActionCondition[]}
   */
  get requestActions() {
    return this._requestActions;
  }

  /**
   * @param {ActionCondition[]} value List of request actions to render.
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
   * @return {ActionCondition[]}
   */
  get responseActions() {
    return this._responseActions;
  }

  /**
   * @param {ActionCondition[]} value List of request actions to render.
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

  [tabHandler](e) {
    this.selected = e.detail.value;
    this.dispatchEvent(new CustomEvent(selectedChangeEvent));
  }

  [actionsHandler](e) {
    const { conditions, type } = e.target;
    const key = type === 'request' ? 'requestActions' : 'responseActions';
    this[key] = conditions;
    this[notifyChange](type);
  }

  [notifyChange](type) {
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
      ${tutorialTemplate()}
      ${this[tabsTpl]()}
      ${this[requestActionsTpl]()}
      ${this[responseActionsTpl]()}
    `;
  }

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

  [requestActionsTpl]() {
    if (this.selected !== 0) {
      return '';
    }
    return this[panelTpl](this.requestActions, 'request');
  }

  [responseActionsTpl]() {
    if (this.selected !== 1) {
      return '';
    }
    return this[panelTpl](this.responseActions, 'response');
  }

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
