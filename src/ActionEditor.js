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
import { helpOutline } from '@advanced-rest-client/arc-icons/ArcIcons.js';
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
  dataSourcePathTplSymbol
} from './EditorMixins/Utils.js';
import { actionNamesMap } from './Utils.js';
import { SetCookieEditorMixin, renderSetCookieEditor } from './EditorMixins/SetCookieEditorMixin.js';
import { SetVariableEditorMixin, renderSetVariableEditor } from './EditorMixins/SetVariableEditorMixin.js';
import { DeleteCookieEditorMixin, renderDeleteCookieEditor } from './EditorMixins/DeleteCookieEditorMixin.js';

const configProperty = 'config';

const helpBase = 'https://docs.advancedrestclient.com/arc-actions/';
const helpMap = {
  'set-cookie': `${helpBase}introduction/set-cookie-action`,
  'set-variable': `${helpBase}introduction/set-variable-action`,
  'delete-cookie': `${helpBase}introduction/remove-cookie-s-action`
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

/** @typedef {import('lit-html').TemplateResult} TemplateResult */

/**
 * @typedef {string} RequestDataSourceEnum
 * @property {string} requesturl "request.url"
 * @property {string} requestmethod "request.method"
 * @property {string} requestheaders "request.headers"
 * @property {string} requestbody "request.body"
 */
/**
 * @typedef {string} ResponseDataSourceEnum
 * @property {string} responseurl "response.url"
 * @property {string} responsemethod "response.method"
 * @property {string} responseheaders "response.headers"
 * @property {string} responsebody "response.body"
 */
/**
 * @typedef {string} OperatorEnum
 * @property {string} equal "equal"
 * @property {string} notequal "not-equal"
 * @property {string} greaterthan "greater-than"
 * @property {string} greaterthanequal "greater-than-equal"
 * @property {string} lessthan "less-than"
 * @property {string} lessthanequal "less-than-equal"
 * @property {string} contains "contains"
 * @property {string} regex "regex"
 */
/**
 * @typedef IteratorConfiguration
 * @property {string} path The path to the property to use in the comparison.
 * @property {string} condition The value of the condition.
 * @property {OperatorEnum} operator The comparison operator.
 */
/**
 * @typedef {Object} DataSourceConfiguration
 * @property {RequestDataSourceEnum|ResponseDataSourceEnum} source Source of the data.
 * @property {?boolean} iteratorEnabled When set the iterator configuration is enabled
 * @property {?IteratorConfiguration} iterator Array search configuration.
 * @property {?string} path The path to the data. When `iteratorEnabled` is set then this
 * is a path counting from an array item. When not set an entire value of `source` is used.
 */

/** @typedef {import('./EditorMixins/SetCookieEditorMixin.js').SetCookieConfig} SetCookieConfig */
/** @typedef {import('./EditorMixins/DeleteCookieEditorMixin.js').DeleteCookieConfig} DeleteCookieConfig */
/** @typedef {import('./EditorMixins/SetVariableEditorMixin.js').SetVariableConfig} SetVariableConfig */
/** @typedef {import('./ArcAction.js').ActionConfiguration} ActionConfiguration */

export class ActionEditor extends DeleteCookieEditorMixin(SetVariableEditorMixin(SetCookieEditorMixin(LitElement))) {
  static get styles() {
    return [styles];
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
       * @type {ActionConfiguration}
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
      outlined: { type: Boolean, reflect: true }
    };
  }

  /**
   * Dispatches the `change` event with the name of the property that changed.
   * @param {string} prop Name of changed property.
   */
  [notifyChangeSymbol](prop) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          prop
        }
      })
    );
  }

  /**
   * A handler for the
   * @param {Event} e
   */
  [inputHandlerSymbol](e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    const { name, value } = target;
    this[updateDeepPropertySymbol](name, value);
    const { notify } = target.dataset;
    if (notify) {
      this[notifyChangeSymbol](notify);
    }
  }

  /**
   * A handler for checkbox / switch change event for the action configuration.
   * @param {Event} e
   */
  [configChangeHandlerSymbol](e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
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
    const parent = /** @type {HTMLFormElement} */ (target.parentElement);
    const { name } = parent;
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

  /**
   * Updates a property value for given path. The path may contain `.` to
   * enter sub properties.
   *
   * For example, to set a top level property use the property name.
   *
   * ```
   * this[updateDeepPropertySymbol]('priority', 10);
   * ```
   *
   * To change an object proeprty separate names with a dot:
   *
   * ```
   * this[updateDeepPropertySymbol]('config.enabled', true);
   * ```
   *
   * This function builds the path if it doesn't exist.
   *
   * @param {string} name
   * @param {string|boolean} value
   */
  [updateDeepPropertySymbol](name, value) {
    let tmp = this;
    let last = '';
    String(name)
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
    tmp[last] = value;
  }

  /**
   * A handler for the action enable switch.
   * @param {Event} e
   */
  [enabledHandlerSymbol](e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    this.enabled = target.checked;
    this[notifyChangeSymbol]('enabled');
  }

  /**
   * A handler for the delete action button click. Dispatches the `remove`
   * custom event.
   */
  [deleteHandlerSymbol]() {
    this.dispatchEvent(new CustomEvent('remove'));
  }

  /**
   * A handler for the duplicate action button click. Dispatches the `duplicate`
   * custom event.
   */
  [duplicateHandlerSymbol]() {
    this.dispatchEvent(new CustomEvent('duplicate'));
  }

  /**
   * A handler for the close action button click. Updates the `opened` value
   * on the `view` property.
   */
  [closeHandlerSymbol]() {
    this.opened = false;
    this[notifyChangeSymbol]('view.opened');
  }

  /**
   * A handler for the open action button click. Updates the `opened` value
   * on the `view` property.
   */
  [openenHandlerSymbol]() {
    this.opened = true;
    this[notifyChangeSymbol]('view.opened');
  }

  /**
   * A handler for the help button click.
   * It dispatches used by ARC `open-external-url` to use platform's APIs to
   * open a popup. As a fallback it uses `window.open`.
   *
   * @param {Event} e
   * @return {Window|null} Returns created window if `window.open` was called.
   */
  [helpHandlerSymbol](e) {
    const target = /** @type {HTMLElement} */ (e.target);
    const { url } = target.dataset;
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

  /**
   * Main render function
   * @return {TemplateResult}
   */
  render() {
    const { opened = false } = this;
    return html`
      <section class="action-card">
        ${opened ? this[openedCardTemplate]() : this[closedCardTemplate]()}
      </section>
    `;
  }

  /**
   * @return {TemplateResult} Template for opened action view.
   */
  [openedCardTemplate]() {
    const { name = '' } = this;
    const lowerName = String(name).toLowerCase();
    let content;
    switch (lowerName) {
      // @ts-ignore
      case 'set-cookie':
        content = this[renderSetCookieEditor]();
        break;
      // @ts-ignore
      case 'set-variable':
        content = this[renderSetVariableEditor]();
        break;
      // @ts-ignore
      case 'delete-cookie':
        content = this[renderDeleteCookieEditor]();
        break;
      default:
        return html``;
    }
    return html`
      ${this[openedCardTitle](name)} ${content} ${this[openedCardFooter]()}
    `;
  }

  /**
   * @return {TemplateResult} Template for closed action view.
   */
  [closedCardTemplate]() {
    const { name = '' } = this;
    const lowerName = String(name).toLowerCase();
    return html`
      <div class="closed-title">
        ${this[closedCardTitle](lowerName)} ${this[openButtonTemplate]()}
      </div>
    `;
  }

  /**
   * @param {string} name Action's name
   * @return {TemplateResult} Template for opened action's title.
   */
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

  /**
   * @return {TemplateResult} Template for opened action's footer line.
   */
  [openedCardFooter]() {
    return html`
      <div class="action-footer">
        ${this[enableSwitchTemplate]()} ${this[deleteButtonTemplate]()} ${this[duplicateButtonTemplate]()}
        ${this[closeButtonTemplate]()}
      </div>
    `;
  }

  /**
   * @param {string} url The URL to use to render the action.
   * @return {TemplateResult|string} Template for the help button.
   */
  [actionHelpTplAymbol](url) {
    if (!url) {
      return '';
    }
    return html`
      <anypoint-button class="action-help" data-url="${url}" @click="${this[helpHandlerSymbol]}">Help</anypoint-button>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the help button.
   */
  [enableSwitchTemplate]() {
    const { compatibility, enabled } = this;
    return html`
      <anypoint-switch ?compatibility="${compatibility}" .checked="${enabled}" @change="${this[enabledHandlerSymbol]}"
        >Enabled</anypoint-switch
      >
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the delete button.
   */
  [deleteButtonTemplate]() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Removes this action"
        class="action-delete"
        ?compatibility="${compatibility}"
        @click="${this[deleteHandlerSymbol]}"
        >Delete</anypoint-button
      >
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the duplicate button.
   */
  [duplicateButtonTemplate]() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Duplicates this action"
        ?compatibility="${compatibility}"
        @click="${this[duplicateHandlerSymbol]}"
        >Duplicate</anypoint-button
      >
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the close action button.
   */
  [closeButtonTemplate]() {
    const { compatibility } = this;
    return html`
      <anypoint-button title="Closes the editor" ?compatibility="${compatibility}" @click="${this[closeHandlerSymbol]}"
        >Close</anypoint-button
      >
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the open action button.
   */
  [openButtonTemplate]() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Opens the editor"
        class="action-open"
        ?compatibility="${compatibility}"
        @click="${this[openenHandlerSymbol]}"
        >Open</anypoint-button
      >
    `;
  }

  /**
   * @param {string} name
   * @return {TemplateResult|string} Template for the title when the action is closed.
   */
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
  [configInput](name, value, label, opts = {}) {
    const { outlined, compatibility, readOnly, disabled } = this;
    opts.type = opts.type || 'text';
    if (opts.autocomplete === undefined) {
      opts.autocomplete = true;
    }
    return html`
      <anypoint-input
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
      </anypoint-input>
    `;
  }

  /**
   * Renders an input element for the action configuration.
   * @param {String} name
   * @param {Boolean} checked
   * @param {String} label
   * @param {?Object} opts
   * @return {Object}
   */
  [configCheckbox](name, checked, label, opts = {}) {
    const { outlined, compatibility, readOnly, disabled } = this;
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
          >${label}</anypoint-checkbox
        >
      </div>
    `;
  }

  /**
   * @param {string} [selected=""] Currently selected value
   * @return {TemplateResult} A template for selecting data source drop down.
   */
  [dataSourceSelector](selected = '') {
    const { outlined, compatibility, readOnly, disabled } = this;
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
          ${this[requestSourceOptions]()} ${this[responseSourceOptions]()}
        </anypoint-listbox>
      </anypoint-dropdown-menu>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the request action's source options
   */
  [requestSourceOptions]() {
    const { compatibility, type } = this;
    if (type !== 'request') {
      return '';
    }
    return html`
      <anypoint-item value="request.url" ?compatibility="${compatibility}">URL</anypoint-item>
      <anypoint-item value="request.method" ?compatibility="${compatibility}">Method</anypoint-item>
      <anypoint-item value="request.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
      <anypoint-item value="request.body" ?compatibility="${compatibility}">Body</anypoint-item>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the response action's source options
   */
  [responseSourceOptions]() {
    const { compatibility, type } = this;
    if (type !== 'response') {
      return '';
    }
    return html`
      <anypoint-item value="response.url" ?compatibility="${compatibility}">URL</anypoint-item>
      <anypoint-item value="response.status" ?compatibility="${compatibility}">Status code</anypoint-item>
      <anypoint-item value="response.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
      <anypoint-item value="response.body" ?compatibility="${compatibility}">Body</anypoint-item>
    `;
  }

  /**
   * @param {boolean} enabled Whether the data source iterator is enabled
   * @return {TemplateResult} A template for the data array search switch
   */
  [dataIteratorTplSymbol](enabled) {
    const { compatibility } = this;
    return html`
      <div class="help-hint-block">
        <anypoint-switch
          ?compatibility="${compatibility}"
          .checked="${enabled}"
          name="config.source.iteratorEnabled"
          data-notify="config"
          data-render="true"
          @change="${this[configChangeHandlerSymbol]}"
          >Array search</anypoint-switch
        >
        <div class="tooltip">
          <span class="icon help">${helpOutline}</span>
          <span class="tooltiptext">
            Allows to search for an item in an array by checking each value against a configured condition.
          </span>
        </div>
      </div>
    `;
  }

  /**
   * @param {ActionConfiguration} config
   * @return {TemplateResult|string} Template for the data source's path input.
   */
  [dataSourcePathTplSymbol](config) {
    const configSource = /** @type {DataSourceConfiguration} */ (config.source || {});
    const { iteratorEnabled = false, path = '', source = '' } = configSource;
    if (['request.method'].indexOf(source) !== -1) {
      return '';
    }
    const label = iteratorEnabled ? "Array item's property for the value" : 'Path to the value';
    const help = iteratorEnabled
      ? 'Path to the property relative to the array item found in the search.'
      : 'Path to the property that contains the data to extract.';
    // @ts-ignore
    const input = this[configInput]('config.source.path', path, label, {
      notify: 'config'
    });
    return html`
      <div class="form-row">
        ${input}
        <div class="tooltip">
          <span class="icon help">${helpOutline}</span>
          <span class="tooltiptext">
            ${help} Example: "data.property.subproperty".
          </span>
        </div>
      </div>
    `;
  }

  /**
   * @param {?IteratorConfiguration} config
   * @return {TemplateResult|string} Template for the array search configuration view.
   */
  [iteratorTemplateSymbol](config = /** @type {IteratorConfiguration} */ ({})) {
    return html`
      <div class="iterator-block">
        ${this[iteratorPathTemplate](config.path)} ${this[iteratorOperatorTemplate](config.operator)}
        ${this[iteratorConditionTemplate](config.condition)}
      </div>
    `;
  }

  /**
   * @param {string=} path
   * @return {TemplateResult} Template for the iterator's path input.
   */
  [iteratorPathTemplate](path = '') {
    const input = this[configInput]('config.source.iterator.path', path, 'Path to the property (required)', {
      required: true,
      autoValidate: true,
      notify: 'config'
    });
    return html`
      <div class="form-row">
        ${input}
        <div class="tooltip">
          <span class="icon help">${helpOutline}</span>
          <span class="tooltiptext">
            Path to the property that contains the value to compare. Use star "*" to tell where the array items are.
            Example: data.*.property.
          </span>
        </div>
      </div>
    `;
  }

  /**
   * @param {string=} condition
   * @return {TemplateResult} Template for the iterator's condition input.
   */
  [iteratorConditionTemplate](condition = '') {
    return this[configInput]('config.source.iterator.condition', condition, 'Condition value (required)', {
      required: true,
      autoValidate: true,
      notify: 'config'
    });
  }

  /**
   * @param {string=} operator
   * @return {TemplateResult} Template for the iterator's operator drop down.
   */
  [iteratorOperatorTemplate](operator = '') {
    const { outlined, compatibility, readOnly, disabled } = this;
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

  /**
   * @return {TemplateResult} Template for the iterator's operator drop down options.
   */
  [iteratorConditionOptions]() {
    const { compatibility } = this;
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
