import { html, LitElement } from 'lit-element';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import styles from './styles/ArcConditionEditor.styles.js';
import tooltipStyles from './styles/Tooltip.styles.js';
import {
  dataSourceSelector,
  operatorTemplate,
  inputTemplate,
} from './CommonTemplates.js';

/** @typedef {import('@advanced-rest-client/arc-types').Actions.RequestDataSourceEnum} RequestDataSourceEnum */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.ResponseDataSourceEnum} ResponseDataSourceEnum */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.Condition} Condition */
/** @typedef {import('lit-html').TemplateResult} TemplateResult */

export class ARCConditionEditorElement extends LitElement {
  static get styles() {
    return [styles, tooltipStyles];
  }

  static get properties() {
    return {
      /**
       * A list of response actions
       */
      condition: { type: Object },
      /**
       * Enables compatibility with the Anypoint theme
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * Enables outlined MD theme
       */
      outlined: { type: Boolean, reflect: true },

      /**
       * Whether or not the condition is enabled
       */
      enabled: { type: Boolean }
    };
  }

  /**
   * @return {Condition} A condition to render.
   */
  get condition() {
    return this._condition;
  }

  /**
   * @param {Condition} value A condition to render.
   */
  set condition(value) {
    const old = this._condition;
    if (old === value) {
      return;
    }
    this._condition = value;
    this.requestUpdate('condition', old);
  }

  get opened() {
    const { condition } = this;
    if (!condition) {
      return false;
    }
    const { view = {} } = condition;
    const { opened } = view;
    return !!opened;
  }

  constructor() {
    super();
    this.compatibility = false;
    this.outlined = false;
  }

  /**
   * Dispatches the `change` event with the name of the property that changed.
   * @param {string} prop Name of changed property.
   */
  _notifyChange(prop) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          prop
        }
      })
    );
  }

  /**
   * A handler for the action enable switch.
   * @param {Event} e
   */
  _enabledHandler(e) {
    this.enabled = /** @type {HTMLInputElement} */ (e.target).checked;
    this._notifyChange('enabled');
  }

  /**
   * A handler for the delete action button click. Dispatches the `remove`
   * custom event.
   */
  _deleteHandler() {
    this.dispatchEvent(new CustomEvent('remove'));
  }

  /**
   * A handler for the close action button click. Updates the `opened` value
   * on the `view` property.
   */
  _closeHandler() {
    const { condition } = this;
    if (!condition.view) {
      condition.view = {};
    }
    condition.view.opened = false;
    this._notifyChange('condition');
    this.requestUpdate();
  }

  /**
   * A handler for the open action button click. Updates the `opened` value
   * on the `view` property.
   */
  _openedHandler() {
    const { condition } = this;
    if (!condition.view) {
      condition.view = {};
    }
    condition.view.opened = true;
    this._notifyChange('condition');
    this.requestUpdate();
  }

  _dataSourceHandler(e) {
    const { condition  } = this;
    condition.source = e.detail.value;
    this._notifyChange('condition');
    this.requestUpdate();
  }

  _operatorHandler(e) {
    const { condition  } = this;
    condition.operator = e.detail.value;
    this._notifyChange('condition');
  }

  _valueHandler(e) {
    const { condition  } = this;
    condition.value = e.target.value;
    this._notifyChange('condition');
  }

  _pathHandler(e) {
    const { condition  } = this;
    condition.path = e.target.value;
    this._notifyChange('condition');
  }

  render() {
    const { opened, condition } = this;
    if (!condition) {
      return '';
    }
    if (opened) {
      return this._renderEditor();
    }
    return this._renderSummary();
  }

  _renderEditor() {
    return html`
    <section class="action-card opened">
      <div class="editor-contents">
        ${this._dataSourceSelector()}
        ${this._dataPathTemplate()}
        ${this._operatorTemplate()}
        ${this._valueTemplate()}
      </div>
      <div class="action-footer">
        ${this._enableSwitchTemplate()}
        ${this._deleteButtonTemplate()}
        ${this._closeButtonTemplate()}
      </div>
    </section>`;
  }

  _renderSummary() {
    const { condition } = this;
    const { source, value, operator } = condition;
    return html`
    <section class="action-card closed">
      When <strong>${source}</strong> is <strong>${operator}</strong> <strong>${value}</strong> then:
      ${this._openButtonTemplate()}
    </section>`;
  }

  _dataSourceSelector() {
    const { condition, outlined, compatibility } = this;
    const { type, source } = condition;

    const input = dataSourceSelector(source, this._dataSourceHandler, {
      outlined, compatibility,
      requestOptions: type === 'request',
      responseOptions: type === 'response',
      name: 'source'
    });
    return html`
    <div class="form-row">${input}</div>
    `;
  }

  _operatorTemplate() {
    const { condition, outlined, compatibility } = this;
    const { operator } = condition;
    const input = operatorTemplate(this._operatorHandler, operator, {
      outlined, compatibility,
      name: 'operator'
    });
    return html`
    <div class="form-row">${input}</div>
    `;
  }

  _valueTemplate() {
    const { condition, outlined, compatibility } = this;
    const { value, source } = condition;
    const rsValue = /** @type RequestDataSourceEnum | ResponseDataSourceEnum | 'value' */ ('status');
    const type = source === rsValue ? 'number' : 'text';

    const input = inputTemplate('value', String(value), 'Value', this._valueHandler, {
      outlined,
      compatibility,
      type,
    });
    return html`
    <div class="form-row">${input}</div>
    `;
  }

  _dataPathTemplate() {
    const { condition, outlined, compatibility } = this;
    const { path, source } = condition;
    if (['request.method', 'response.status'].indexOf(source) !== -1) {
      // these sources do not have path value.
      return '';
    }

    const help = 'Path to the property that contains the data to extract.';
    // @ts-ignore
    const input = inputTemplate('path', path, 'Path to the value', this._pathHandler, {
      outlined,
      compatibility,
    });
    return html`
      <div class="form-row">
        ${input}
        <div class="tooltip">
          <arc-icon icon="helpOutline"></arc-icon>
          <span class="tooltiptext">
            ${help} Example: "data.property.subproperty".
          </span>
        </div>
      </div>
    `;
  }

  /**
   * @return {TemplateResult} Template for the help button.
   */
  _enableSwitchTemplate() {
    const { compatibility, enabled } = this;
    return html`
      <anypoint-switch
        ?compatibility="${compatibility}"
        .checked="${enabled}"
        @change="${this._enabledHandler}"
      >Enabled</anypoint-switch>
    `;
  }

  /**
   * @return {TemplateResult} Template for the delete button.
   */
  _deleteButtonTemplate() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Removes this action"
        class="action-delete"
        ?compatibility="${compatibility}"
        @click="${this._deleteHandler}"
      >Delete</anypoint-button>
    `;
  }

  /**
   * @return {TemplateResult} Template for the close action button.
   */
  _closeButtonTemplate() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Closes the editor"
        ?compatibility="${compatibility}"
        @click="${this._closeHandler}"
      >Close</anypoint-button>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the open action button.
   */
  _openButtonTemplate() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Opens the editor"
        class="action-open"
        ?compatibility="${compatibility}"
        @click="${this._openedHandler}"
      >Open</anypoint-button>
    `;
  }
}
