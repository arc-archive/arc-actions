import { LitElement, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import '@anypoint-web-components/anypoint-button';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-menu-button/anypoint-menu-button.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import styles from './ActionEditor.styles.js';
import {
  notifyChangeSymbol,
  configInput,
  inputHandlerSymbol,
  configCheckbox,
  configChangeHandlerSymbol,
  dataSourceSelector,
  dataSourceHandlerSymbol,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
} from './EditorMixins/Utils.js';
import { actionNamesMap } from './Utils.js';
import {
  SetCookieEditorMixin,
  renderSetCookieEditor,
} from './EditorMixins/SetCookieEditorMixin.js';
import {
  SetVariableEditorMixin,
  renderSetVariableEditor,
} from './EditorMixins/SetVariableEditorMixin.js';
import {
  DeleteCookieEditorMixin,
  renderDeleteCookieEditor,
} from './EditorMixins/DeleteCookieEditorMixin.js';

const configProperty = 'config';

const helpBase = 'https://docs.advancedrestclient.com/arc-actions/';
const helpMap = {
  'set-cookie': `${helpBase}introduction/set-cookie-action`,
  'set-variable': `${helpBase}introduction/set-variable-action`,
  'delete-cookie': `${helpBase}introduction/remove-cookie-s-action`,
};

const actionHelpTplAymbol = Symbol();
const updateDeepPropertySymbol = Symbol();
const enabledHandlerSymbol = Symbol();
const deleteHandlerSymbol = Symbol();
const duplicateHandlerSymbol = Symbol();
const closeHandlerSymbol = Symbol();
const openenHandlerSymbol = Symbol();
const helpHandlerSymbol = Symbol();
const openedCardTemplate = Symbol();
const closedCardTemplate = Symbol();
const openedCardTitle = Symbol();
const openedCardFooter = Symbol();
const closedCardTitle = Symbol();
const openButtonTemplate = Symbol();
const enableSwitchTemplate = Symbol();
const deleteButtonTemplate = Symbol();
const duplicateButtonTemplate = Symbol();
const closeButtonTemplate = Symbol();
const requestSourceOptions = Symbol();
const responseSourceOptions = Symbol();
const iteratorConditionOptions = Symbol();
const iteratorOperatorTemplate = Symbol();
const iteratorPathTemplate = Symbol();
const iteratorConditionTemplate = Symbol();

/**
 * @typedef SetCookieConfig
 * @type {Object}
 * @property {String} name
 * @property {String} domain
 * @property {String} path
 * @property {?Number} expires
 * @property {?Boolean} hostOnly
 * @property {?Boolean} httpOnly
 * @property {?Boolean} secure
 * @property {?Boolean} session
 * @property {Object} value
 * @property {String} value.source
 * @property {String} value.path
 * @property {?Boolean} value.isArray
 */
/**
 * @typedef SetVariableConfig
 * @type {Object}
 * @property {String} name
 * @property {Object} value
 * @property {String} value.source
 * @property {String} value.path
 * @property {?Boolean} value.isArray
 */
/**
 * @typedef DeleteCookieConfig
 * @type {Object}
 * @property {?Booelan} useRequestUrl
 * @property {?Booelan} removeAll
 * @property {?String} url
 * @property {?String} name
 */
/**
 * @typedef RunRequestConfig
 * @type {Object}
 * @property {String} id
 * @property {?Booelan} awaitFinish
 */

export class ActionEditor extends
  DeleteCookieEditorMixin(
    SetVariableEditorMixin(
      SetCookieEditorMixin(LitElement))) {

  static get styles() {
    return [
      styles,
    ];
  }

  static get properties() {
    return {
      /**
       * Action name that determines which editor to load.
       * The name mast be one of the supported action types or otherwise the
       * component won't render any editor.
       */
      name: { type: String, reflect: true },
      /**
       * Either `request` or `response`. Actions without a type are not
       * executed.
       */
      type: { type: String, reflect: true },
      /**
       * Whether the action is enabled. An action is considered enabled when
       * this value equals `true`.
       */
      enabled: { type: Boolean, reflect: true },
      /**
       * Whether the action should be called synchronously to the request or
       * the response.
       * This value is optional and default to `true`.
       *
       * @default true
       */
      sync: { type: Boolean, reflect: true },
      /**
       * Whether the action should fail when
       * the request / response if it results in error.
       */
      failOnError: { type: Boolean, reflect: true },
      /**
       * Action's priority on a scale of 1 to 10. The default value is 5 and
       * this property is optional.
       *
       * @default 5
       */
      priority: { type: Number, reflect: true },
      /**
       * The configuration of an action. The type depends on the `name` property.
       * @type {Object|SetCookieConfig|SetVariableConfig|DeleteCookieConfig|RunRequestConfig}
       */
      config: { type: Object },

      /**
       * Whether or not the action is rendered in full view.
       */
      opened: { type: Boolean, reflect: true },
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

  [notifyChangeSymbol](prop) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        prop
      }
    }));
  }

  [inputHandlerSymbol](e) {
    const { name, value } = e.target;
    this[updateDeepPropertySymbol](name, value);
    const { notify } = e.target.dataset;
    if (notify) {
      this[notifyChangeSymbol](notify);
    }
  }

  /**
   * A handler for checkbox/switch change event for the action configuration.
   * @param {Event} e
   */
  [configChangeHandlerSymbol](e) {
    const target = /** @type {HTMLElement} */ (e.target);
    // @ts-ignore
    const { name, checked } = target;
    this[updateDeepPropertySymbol](name, checked);
    const { notify, render } = target.dataset;
    if (notify) {
      this[notifyChangeSymbol](notify);
    }
    if (render) {
      this.requestUpdate();
    }
  }

  /**
   * A handler for the data source selector for action configuration.
   * @param {Event} e
   */
  [dataSourceHandlerSymbol](e) {
    const target = /** @type {HTMLElement} */ (e.target);
    // @ts-ignore
    const name = target.parentElement.name;
    // @ts-ignore
    const value = target.selected;
    this[updateDeepPropertySymbol](name, value);
    this[notifyChangeSymbol](configProperty);
    const { notify, render } = target.dataset;
    if (notify) {
      this[notifyChangeSymbol](notify);
    }
    if (render) {
      this.requestUpdate();
    }
  }

  [updateDeepPropertySymbol](name, value) {
    let tmp = this;
    let last = '';
    String(name).split('.').forEach((item, index, arr) => {
      if (arr.length === index + 1) {
        last = item;
        return;
      }
      if (!tmp[item]) {
        tmp[item] = {};
      }
      tmp = tmp[item];
    });
    tmp[last] = value;
  }

  [enabledHandlerSymbol](e) {
    this.enabled = e.target.checked;
    this[notifyChangeSymbol]('enabled');
  }

  [deleteHandlerSymbol]() {
    this.dispatchEvent(new CustomEvent('remove'));
  }

  [duplicateHandlerSymbol]() {
    this.dispatchEvent(new CustomEvent('duplicate'));
  }

  [closeHandlerSymbol]() {
    this.opened = false;
    this[notifyChangeSymbol]('view.opened');
  }

  [openenHandlerSymbol]() {
    this.opened = true;
    this[notifyChangeSymbol]('view.opened');
  }

  [helpHandlerSymbol](e) {
    const { url } = e.target.dataset;
    const ev = new CustomEvent('open-external-url', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        url
      }
    });
    this.dispatchEvent(ev);
    if (ev.defaultPrevented) {
      return null;
    }
    return window.open(url);
  }

  render() {
    const { opened=false } = this;
    return html`
    <section class="action-card">
      ${opened ? this[openedCardTemplate]() : this[closedCardTemplate]()}
    </section>
    `;
  }

  [openedCardTemplate]() {
    const { name='' } = this;
    const lowerName = String(name).toLowerCase();
    let content;
    switch (lowerName) {
      // @ts-ignore
      case 'set-cookie': content = this[renderSetCookieEditor](); break;
      // @ts-ignore
      case 'set-variable': content = this[renderSetVariableEditor](); break;
      // @ts-ignore
      case 'delete-cookie': content = this[renderDeleteCookieEditor](); break;
      default: return html``;
    }
    return html`
    ${this[openedCardTitle](name)}
    ${content}
    ${this[openedCardFooter]()}
    `;
  }

  [closedCardTemplate]() {
    const { name='' } = this;
    const lowerName = String(name).toLowerCase();
    return html`
    <div class="closed-title">
    ${this[closedCardTitle](lowerName)}
    ${this[openButtonTemplate]()}
    </div>
    `;
  }

  [openedCardTitle](name) {
    const label = actionNamesMap(name);
    const helpUrl = helpMap[name];
    return html`
    <div class="opened-title">
      <div class="action-title">${label}</div>
      ${this[actionHelpTplAymbol](helpUrl)}
    </div>
    `;
  }

  [openedCardFooter]() {
    return html`
    <div class="action-footer">
      ${this[enableSwitchTemplate]()}
      ${this[deleteButtonTemplate]()}
      ${this[duplicateButtonTemplate]()}
      ${this[closeButtonTemplate]()}
    </div>
    `;
  }

  [actionHelpTplAymbol](url) {
    if (!url) {
      return '';
    }
    return html`<anypoint-button
      class="action-help"
      data-url="${url}"
      @click="${this[helpHandlerSymbol]}">Help</anypoint-button>`;
  }

  [enableSwitchTemplate]() {
    const { compatibility, enabled } = this;
    return html`
    <anypoint-switch
      ?compatibility="${compatibility}"
      .checked="${enabled}"
      @change="${this[enabledHandlerSymbol]}"
    >Enabled</anypoint-switch>`;
  }

  [deleteButtonTemplate]() {
    const { compatibility } = this;
    return html`
    <anypoint-button
      title="Removes this action"
      class="action-delete"
      ?compatibility="${compatibility}"
      @click="${this[deleteHandlerSymbol]}"
    >Delete</anypoint-button>`;
  }

  [duplicateButtonTemplate]() {
    const { compatibility } = this;
    return html`
    <anypoint-button
      title="Duplicates this action"
      ?compatibility="${compatibility}"
      @click="${this[duplicateHandlerSymbol]}"
    >Duplicate</anypoint-button>`;
  }

  [closeButtonTemplate]() {
    const { compatibility } = this;
    return html`
    <anypoint-button
      title="Closes the editor"
      ?compatibility="${compatibility}"
      @click="${this[closeHandlerSymbol]}"
    >Close</anypoint-button>`;
  }

  [openButtonTemplate]() {
    const { compatibility } = this;
    return html`
    <anypoint-button
      title="Opens the editor"
      class="action-open"
      ?compatibility="${compatibility}"
      @click="${this[openenHandlerSymbol]}"
    >Open</anypoint-button>`;
  }

  [closedCardTitle](name) {
    const label = actionNamesMap(name);
    return html`
    <div class="action-title">${label}</div>
    `;
  }

  /**
   * Renders an input element for the action configuration.
   * @param {String} name
   * @param {String} value
   * @param {String} label
   * @param {?Object} opts
   * @return {Object}
   */
  [configInput](name, value, label, opts={}) {
    const {
      outlined,
      compatibility,
      readOnly,
      disabled,
    } = this;
    opts.type = opts.type || 'text';
    if (opts.autocomplete === undefined) {
      opts.autocomplete = true;
    }
    return html`<anypoint-input
      .value="${value}"
      @input="${this[inputHandlerSymbol]}"
      name="${name}"
      type="${opts.type}"
      ?required="${opts.required}"
      ?autoValidate="${opts.autoValidate}"
      ?autocomplete="${opts.autocomplete}"
      .outlined="${outlined}"
      .compatibility="${compatibility}"
      ?readOnly="${readOnly}"
      ?disabled="${disabled}"
      .invalidMessage="${opts.invalidLabel}"
      .infoMessage="${opts.infoLabel}"
      class="${classMap(opts.classes)}"
      ?data-persistent="${opts.persistent}"
      data-notify="${opts.notify}"
      data-render="${opts.render}"
    >
      <label slot="label">${label}</label>
    </anypoint-input>`;
  }

  /**
   * Renders an input element for the action configuration.
   * @param {String} name
   * @param {Boolean} checked
   * @param {String} label
   * @param {?Object} opts
   * @return {Object}
   */
  [configCheckbox](name, checked, label, opts={}) {
    const {
      outlined,
      compatibility,
      readOnly,
      disabled
    } = this;
    return html`
    <div class="checkbox-container">
      <anypoint-checkbox
        name="${name}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        ?readOnly="${readOnly}"
        ?disabled="${disabled}"
        ?checked="${checked}"
        @change="${this[configChangeHandlerSymbol]}"
        data-notify="${opts.notify}"
        data-render="${opts.render}"
      >${label}</anypoint-checkbox>
    </div>
    `;
  }

  [dataSourceSelector](selected) {
    const {
      outlined,
      compatibility,
      readOnly,
      disabled
    } = this;
    return html`
    <anypoint-dropdown-menu
      aria-label="Select data source"
      required
      autovalidate
      name="config.source.source"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?readOnly="${readOnly}"
      ?disabled="${disabled}"
    >
      <label slot="label">Data source</label>
      <anypoint-listbox
        slot="dropdown-content"
        tabindex="-1"
        attrforselected="value"
        .selected="${selected}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        @selected-changed="${this[dataSourceHandlerSymbol]}"
        data-notify="config"
        data-render="true"
      >
        ${this[requestSourceOptions]()}
        ${this[responseSourceOptions]()}
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    `;
  }

  [requestSourceOptions]() {
    const {
      compatibility,
      type,
    } = this;
    if (type !== 'request') {
      return '';
    }
    return html`
    <anypoint-item value="request.url" ?compatibility="${compatibility}">URL</anypoint-item>
    <anypoint-item value="request.method" ?compatibility="${compatibility}">Method</anypoint-item>
    <anypoint-item value="request.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
    <anypoint-item value="request.body" ?compatibility="${compatibility}">Body</anypoint-item>`;
  }

  [responseSourceOptions]() {
    const {
      compatibility,
      type,
    } = this;
    if (type !== 'response') {
      return '';
    }
    return html`
    <anypoint-item value="response.url" ?compatibility="${compatibility}">URL</anypoint-item>
    <anypoint-item value="response.status" ?compatibility="${compatibility}">Status code</anypoint-item>
    <anypoint-item value="response.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
    <anypoint-item value="response.body" ?compatibility="${compatibility}">Body</anypoint-item>`;
  }

  [dataIteratorTplSymbol](enabled) {
    const { compatibility } = this;
    return html`
    <div>
      <anypoint-switch
        ?compatibility="${compatibility}"
        .checked="${enabled}"
        name="config.source.iteratorEnabled"
        data-notify="config"
        data-render="true"
        @change="${this[configChangeHandlerSymbol]}"
      >Array search</anypoint-switch>
    </div>`;
  }

  [iteratorTemplateSymbol](config={}) {
    return html`
    <div class="iterator-block">
      ${this[iteratorPathTemplate](config.path)}
      ${this[iteratorOperatorTemplate](config.operator)}
      ${this[iteratorConditionTemplate](config.condition)}
    </div>
    `;
  }

  [iteratorPathTemplate](path='') {
    return this[configInput]('config.source.iterator.path', path, 'Path to the property (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  [iteratorConditionTemplate](condition='') {
    return this[configInput]('config.source.iterator.condition', condition, 'Condition value (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  [iteratorOperatorTemplate](operator='') {
    const {
      outlined,
      compatibility,
      readOnly,
      disabled
    } = this;
    return html`
    <anypoint-dropdown-menu
      aria-label="Select data source"
      required
      autovalidate
      name="config.source.iterator.operator"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?readOnly="${readOnly}"
      ?disabled="${disabled}"
    >
      <label slot="label">Condition</label>
      <anypoint-listbox
        slot="dropdown-content"
        tabindex="-1"
        attrforselected="value"
        .selected="${operator}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        @selected-changed="${this[dataSourceHandlerSymbol]}"
        data-notify="config"
      >
        ${this[iteratorConditionOptions]()}
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    `;
  }

  [iteratorConditionOptions]() {
    const {
      compatibility,
    } = this;
    return html`
    <anypoint-item value="equal" ?compatibility="${compatibility}">Equal</anypoint-item>
    <anypoint-item value="not-equal" ?compatibility="${compatibility}">Not equal</anypoint-item>
    <anypoint-item value="greater-than" ?compatibility="${compatibility}">Greater than</anypoint-item>
    <anypoint-item value="greater-than-equal" ?compatibility="${compatibility}">Greater than or equal</anypoint-item>
    <anypoint-item value="less-than" ?compatibility="${compatibility}">Less than</anypoint-item>
    <anypoint-item value="less-than-equal" ?compatibility="${compatibility}">Less than or equal</anypoint-item>
    <anypoint-item value="contains" ?compatibility="${compatibility}">Contains</anypoint-item>
    <anypoint-item value="regex" ?compatibility="${compatibility}">Regular expression</anypoint-item>
    `;
  }
}
