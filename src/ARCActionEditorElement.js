import { LitElement, html } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { AnypointButton } from '@anypoint-web-components/anypoint-button';
import { AnypointDropdownMenu } from '@anypoint-web-components/anypoint-dropdown-menu';
import { AnypointMenuButton } from '@anypoint-web-components/anypoint-menu-button';
import { AnypointListbox } from '@anypoint-web-components/anypoint-listbox';
import { AnypointItem } from '@anypoint-web-components/anypoint-item';
import { AnypointCheckbox } from '@anypoint-web-components/anypoint-checkbox';
import { AnypointInput } from '@anypoint-web-components/anypoint-input';
import { AnypointSwitch } from '@anypoint-web-components/anypoint-switch';
import styles from './ActionEditor.styles.js';
import tooltipStyles from './Tooltip.styles.js';
import { actionNamesMap } from './Utils.js';
import setCookieTemplate from './EditorMixins/SetCookieTemplate.js';
import setVariableTemplate from './EditorMixins/SetVariableTemplate.js';
import deleteCookieTemplate from './EditorMixins/DeleteCookieTemplate.js';

const configProperty = 'config';

const helpBase = 'https://docs.advancedrestclient.com/arc-actions/';
const helpMap = {
  'set-cookie': `${helpBase}introduction/set-cookie-action`,
  'set-variable': `${helpBase}introduction/set-variable-action`,
  'delete-cookie': `${helpBase}introduction/remove-cookie-s-action`,
};

const notifyChangeSymbol = Symbol('notifyChangeSymbol');
const inputHandlerSymbol = Symbol('inputHandlerSymbol');
const configChangeHandlerSymbol = Symbol('configChangeHandlerSymbol');
const dataSourceHandlerSymbol = Symbol('dataSourceHandlerSymbol');
const actionHelpTplAymbol = Symbol('actionHelpTplAymbol');
const updateDeepPropertySymbol = Symbol('updateDeepPropertySymbol');
const enabledHandlerSymbol = Symbol('enabledHandlerSymbol');
const deleteHandlerSymbol = Symbol('deleteHandlerSymbol');
const duplicateHandlerSymbol = Symbol('duplicateHandlerSymbol');
const closeHandlerSymbol = Symbol('closeHandlerSymbol');
const openenHandlerSymbol = Symbol('openenHandlerSymbol');
const helpHandlerSymbol = Symbol('helpHandlerSymbol');
const openedCardTemplate = Symbol('openedCardTemplate');
const closedCardTemplate = Symbol('closedCardTemplate');
const openedCardTitle = Symbol('openedCardTitle');
const openedCardFooter = Symbol('openedCardFooter');
const openButtonTemplate = Symbol('openButtonTemplate');
const enableSwitchTemplate = Symbol('enableSwitchTemplate');
const deleteButtonTemplate = Symbol('deleteButtonTemplate');
const duplicateButtonTemplate = Symbol('duplicateButtonTemplate');
const closeButtonTemplate = Symbol('closeButtonTemplate');

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('../types').DataSourceConfiguration} DataSourceConfiguration */
/** @typedef {import('../types').IteratorConfiguration} IteratorConfiguration */
/** @typedef {import('../types').SetCookieConfig} SetCookieConfig */
/** @typedef {import('../types').DeleteCookieConfig} DeleteCookieConfig */
/** @typedef {import('../types').SetVariableConfig} SetVariableConfig */
/** @typedef {import('../types').ActionConfiguration} ActionConfiguration */

/**
 * @param {string} name
 * @return {TemplateResult|string} Template for the title when the action is closed.
 */
const closedCardTitleTemplate = (name) => {
  const label = actionNamesMap(name);
  return html` <div class="action-title">${label}</div> `;
};

export class ARCActionEditorElement extends ScopedElementsMixin(LitElement) {
  static get styles() {
    return [styles, tooltipStyles];
  }

  static get scopedElements() {
    return {
      'anypoint-button': AnypointButton,
      'anypoint-dropdown-menu': AnypointDropdownMenu,
      'anypoint-menu-button': AnypointMenuButton,
      'anypoint-listbox': AnypointListbox,
      'anypoint-input': AnypointInput,
      'anypoint-item': AnypointItem,
      'anypoint-checkbox': AnypointCheckbox,
      'anypoint-switch': AnypointSwitch,
    };
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
      readOnly: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.compatibility = false;
    this.outlined = false;
    this.opened = false;
    this.priority = 5;
    this.failOnError = false;
    this.readOnly = false;
    this.disabled = false;
    this.name = undefined;
    this.type = undefined;
    this.config = undefined;
  }

  /**
   * Dispatches the `change` event with the name of the property that changed.
   * @param {string} prop Name of changed property.
   */
  [notifyChangeSymbol](prop) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          prop,
        },
      })
    );
  }

  /**
   * A handler for the
   * @param {Event} e
   */
  [inputHandlerSymbol](e) {
    const { target } = e;
    const targetElement = /** @type {HTMLInputElement} */ (target);
    const { name, value } = targetElement;
    this[updateDeepPropertySymbol](name, value);
    const { notify } = targetElement.dataset;
    if (notify) {
      this[notifyChangeSymbol](notify);
    }
  }

  /**
   * A handler for checkbox / switch change event for the action configuration.
   * @param {Event} e
   */
  [configChangeHandlerSymbol](e) {
    const { target } = e;
    const targetElement = /** @type {HTMLInputElement} */ (target);
    const { name, checked } = targetElement;
    this[updateDeepPropertySymbol](name, checked);
    const { notify, render } = targetElement.dataset;
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
    const { target } = e;
    const targetElement = /** @type {HTMLInputElement} */ (target);
    const parent = /** @type {HTMLFormElement} */ (targetElement.parentElement);
    const { name } = parent;
    // @ts-ignore
    const value = targetElement.selected;
    this[updateDeepPropertySymbol](name, value);
    this[notifyChangeSymbol](configProperty);
    const { notify, render } = targetElement.dataset;
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
    this.enabled = /** @type {HTMLInputElement} */ (e.target).checked;
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
    const { url } = /** @type {HTMLInputElement} */ (e.target).dataset;
    const ev = new CustomEvent('open-external-url', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        url,
      },
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
    const {
      name = '',
      type,
      failOnError,
      config,
      outlined,
      compatibility,
      readOnly,
      disabled,
    } = this;
    const lowerName = String(name).toLowerCase();
    const inputHandler = this[inputHandlerSymbol];
    const changeHandler = this[configChangeHandlerSymbol];
    const dataSourceHandler = this[dataSourceHandlerSymbol];
    const inputConfig = {
      outlined,
      compatibility,
      readOnly,
      disabled,
    };
    let content;
    switch (lowerName) {
      case 'set-cookie':
        content = setCookieTemplate(
          failOnError,
          config,
          type,
          inputHandler,
          changeHandler,
          dataSourceHandler,
          inputConfig
        );
        break;
      case 'set-variable':
        content = setVariableTemplate(
          failOnError,
          config,
          type,
          inputHandler,
          changeHandler,
          dataSourceHandler,
          inputConfig
        );
        break;
      case 'delete-cookie':
        content = deleteCookieTemplate(
          config,
          inputHandler,
          changeHandler,
          inputConfig
        );
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
        ${closedCardTitleTemplate(lowerName)} ${this[openButtonTemplate]()}
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
        ${this[enableSwitchTemplate]()} ${this[deleteButtonTemplate]()}
        ${this[duplicateButtonTemplate]()} ${this[closeButtonTemplate]()}
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
      <anypoint-button
        class="action-help"
        data-url="${url}"
        @click="${this[helpHandlerSymbol]}"
        >Help</anypoint-button
      >
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the help button.
   */
  [enableSwitchTemplate]() {
    const { compatibility, enabled } = this;
    return html`
      <anypoint-switch
        ?compatibility="${compatibility}"
        .checked="${enabled}"
        @change="${this[enabledHandlerSymbol]}"
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
      <anypoint-button
        title="Closes the editor"
        ?compatibility="${compatibility}"
        @click="${this[closeHandlerSymbol]}"
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
}
